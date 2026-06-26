"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { siteCopy } from "@/lib/content";
import { prefersReducedMotionSafe } from "@/lib/utils";

/**
 * Mobile-only kinetic statement. The desktop version cycles the middle word as
 * you scroll through a 180vh track; on phones there's no such track, so the
 * word-swap is driven by a timer instead. It starts only once the block scrolls
 * into view (and is skipped entirely under reduced-motion).
 */
function MobileKineticStatement({
  eyebrow,
  words,
}: {
  eyebrow: string;
  words: readonly string[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

  useEffect(() => {
    if (prefersReducedMotionSafe()) {
      setReduced(true);
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Cycle the word even under reduced-motion: the swap is a gentle opacity-only
  // crossfade there (no translate), so the headline still feels alive on phones
  // that have "Reduce Motion" enabled - which is common and was making it look
  // static before.
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setActive((a) => (a + 1) % words.length), 1900);
    return () => clearInterval(id);
  }, [inView, words.length]);

  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: reduced || inView ? 1 : 0,
        transform: reduced || inView ? "none" : "translateY(38px)",
      }}
    >
      <p className="mm-eyebrow-dark mb-6">{eyebrow}</p>
      <div className="mm-stacked-title text-flow-black">
        <span>All your</span>
        <span className="relative block text-flow-green-dim">
          {words.map((word, index) => (
            <span
              key={word}
              className="absolute inset-0 capitalize transition-all duration-500 ease-out"
              style={{
                opacity: active === index ? 1 : 0,
                transform: `translateY(${active === index ? 0 : reduced ? 0 : 22}px)`,
              }}
            >
              {word}.
            </span>
          ))}
          <span className="invisible capitalize">{longest}.</span>
        </span>
        <span>Mapped.</span>
      </div>
    </div>
  );
}

export function MaskedStatement() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);
  const { eyebrow, words, marquee } = siteCopy.statement;
  const active = Math.min(words.length - 1, Math.floor(progress * words.length));

  return (
    <section ref={ref} className="mm-surface-light relative lg:h-[180vh]">
      <div className="flex min-h-[78svh] items-center justify-center px-5 py-20 text-center lg:hidden">
        <MobileKineticStatement eyebrow={eyebrow} words={words} />
      </div>

      <div className="sticky top-0 hidden min-h-screen items-center justify-center overflow-hidden px-5 py-24 lg:flex">
        <div className="absolute inset-x-0 top-1/2 h-40 -translate-y-1/2 overflow-hidden opacity-10" aria-hidden="true">
          <div className="marquee-line flex w-max gap-8 whitespace-nowrap font-display text-8xl font-bold uppercase tracking-tight text-flow-black">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i}>{marquee}</span>
            ))}
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <p className="mm-eyebrow-dark mb-6">{eyebrow}</p>
          <h2 className="mm-stacked-title text-flow-black">
            <span>All your</span>
            <span className="relative inline-block min-w-[9ch] text-flow-green-dim">
              {words.map((word, index) => (
                <span
                  key={word}
                  className="absolute inset-0 capitalize transition-all duration-500"
                  style={{
                    opacity: active === index ? 1 : 0,
                    transform: `translateY(${active === index ? 0 : 24}px)`,
                  }}
                >
                  {word}.
                </span>
              ))}
              <span className="invisible">{words[1]}.</span>
            </span>
            <span>Mapped.</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
