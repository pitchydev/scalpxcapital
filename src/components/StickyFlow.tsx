"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BarChart3, BookOpen, LineChart, Users } from "lucide-react";
import { siteCopy } from "@/lib/content";
import { flowStepImages } from "@/lib/media";
import { cn, prefersReducedMotionSafe } from "@/lib/utils";

const STEP_ICONS = [LineChart, Users, BookOpen, BarChart3];

const STEPS = siteCopy.flow.steps.map((step, i) => ({
  ...step,
  icon: STEP_ICONS[i],
  image: flowStepImages[i],
}));

const N = STEPS.length;

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

/**
 * "How ScalpX works" - a pinned, scroll-driven sequence.
 *
 * All panels and images are mounted once and cross-faded imperatively from a
 * single rAF loop (gated by an IntersectionObserver). We write transform/opacity
 * straight to the DOM nodes - no React state churn per frame - so the motion is
 * smooth and compositor-friendly rather than laggy.
 */
export function StickyFlow() {
  const sectionRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<HTMLDivElement[]>([]);
  const imageRefs = useRef<HTMLDivElement[]>([]);
  const numberRefs = useRef<HTMLDivElement[]>([]);
  const segRefs = useRef<HTMLSpanElement[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduce = prefersReducedMotionSafe();
    let raf = 0;
    let running = false;
    let lastDom = -1;

    const render = () => {
      const vh = window.innerHeight;
      const total = Math.max(1, section.offsetHeight - vh);
      const p = clamp(-section.getBoundingClientRect().top / total);
      const t = p * N;
      const idx = Math.min(N - 1, Math.floor(t));
      const frac = clamp(t - idx);
      const blend = smoothstep(0.5, 0.92, frac);
      const dom = blend < 0.5 ? idx : Math.min(N - 1, idx + 1);

      for (let i = 0; i < N; i++) {
        const o = i === idx ? 1 - blend : i === idx + 1 ? blend : 0;

        const panel = panelRefs.current[i];
        if (panel) {
          const y = i === idx ? -36 * blend : i === idx + 1 ? 36 * (1 - blend) : i < idx ? -36 : 36;
          panel.style.opacity = String(o);
          panel.style.transform = `translate3d(0,${reduce ? 0 : y}px,0)`;
          panel.style.pointerEvents = o > 0.6 ? "auto" : "none";
        }

        const img = imageRefs.current[i];
        if (img) {
          img.style.opacity = String(o);
          img.style.transform = reduce ? "scale(1)" : `scale(${1 + 0.05 * (1 - o)})`;
        }

        const num = numberRefs.current[i];
        if (num) {
          const y = i === idx ? -40 * blend : i === idx + 1 ? 40 * (1 - blend) : i < idx ? -40 : 40;
          num.style.opacity = String(o);
          num.style.transform = `translate3d(0,${reduce ? 0 : y}px,0)`;
        }

        const seg = segRefs.current[i];
        if (seg) seg.style.transform = `scaleX(${clamp(t - i)})`;
      }

      if (stackRef.current && !reduce) {
        stackRef.current.style.transform = `translate3d(0,${(p - 0.5) * -26}px,0)`;
      }
      if (glowRef.current && !reduce) {
        glowRef.current.style.transform = `translate3d(0,${(t - dom) * 40}px,0)`;
      }

      if (dom !== lastDom) {
        lastDom = dom;
        setActive(dom);
      }
    };

    const onScroll = () => {
      if (!running) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(render);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running) onScroll();
      },
      { rootMargin: "300px 0px 300px 0px" },
    );

    io.observe(section);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    render();

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goTo = (i: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const total = section.offsetHeight - window.innerHeight;
    const y = window.scrollY + section.getBoundingClientRect().top + ((i + 0.32) / N) * total;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section id="platform" ref={sectionRef} className="relative h-[280svh] bg-flow-black lg:h-[400vh]">
      <div className="sticky top-0 flex min-h-[100svh] flex-col overflow-hidden">
        <div className="electric-ambient absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="bg-flow-grid absolute inset-0 opacity-10" aria-hidden="true" />

        <div className="relative mx-auto grid w-full max-w-7xl flex-1 items-start gap-5 px-5 py-6 pt-[4.5rem] lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-14 lg:py-20 lg:pt-24 lg:px-8">
          {/* Text column */}
          <div className="relative order-2 lg:order-1">
            <p className="mm-eyebrow mb-6">{siteCopy.flow.eyebrow}</p>

            {/* Ghost step numbers */}
            <div className="pointer-events-none absolute -top-2 right-0 h-28 select-none lg:-top-6 lg:right-4 lg:h-40">
              {STEPS.map((step, i) => (
                <div
                  key={`num-${step.eyebrow}`}
                  ref={(el) => {
                    if (el) numberRefs.current[i] = el;
                  }}
                  className="ch-flow-ghost absolute right-0 top-0 font-display text-[6rem] font-black leading-none lg:text-[10rem]"
                  style={{ opacity: i === 0 ? 1 : 0, willChange: "transform, opacity" }}
                >
                  0{i + 1}
                </div>
              ))}
            </div>

            {/* Panels (stacked) */}
            <div className="relative min-h-[21rem] lg:min-h-[27rem]">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                const isActive = active === i;
                return (
                  <div
                    key={step.title}
                    ref={(el) => {
                      if (el) panelRefs.current[i] = el;
                    }}
                    aria-hidden={!isActive}
                    className="absolute inset-x-0 top-0"
                    style={{ opacity: i === 0 ? 1 : 0, willChange: "transform, opacity" }}
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-flow-green/20 bg-flow-green/10 lg:h-14 lg:w-14">
                      <Icon className="h-6 w-6 text-flow-green lg:h-7 lg:w-7" strokeWidth={1.75} />
                    </div>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-flow-green">
                      0{i + 1} · {step.eyebrow}
                    </p>
                    <h2 className="mm-section-title mt-3 max-w-xl">{step.title}</h2>
                    <p className="mt-5 max-w-lg text-base text-flow-muted lg:text-lg">{step.copy}</p>
                    <div className="mt-7 flex flex-wrap gap-2">
                      {step.bullets.map((bullet, b) => (
                        <span
                          key={bullet}
                          className="rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-flow-white/80 transition-all duration-500 ease-out"
                          style={{
                            transitionDelay: `${120 + b * 70}ms`,
                            opacity: isActive ? 1 : 0,
                            transform: isActive ? "none" : "translateY(10px)",
                          }}
                        >
                          {bullet}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Clickable progress rail */}
            <div className="mt-6 grid grid-cols-4 gap-3 lg:mt-14">
              {STEPS.map((step, i) => {
                const isActive = active === i;
                return (
                  <button
                    key={`rail-${step.eyebrow}`}
                    type="button"
                    onClick={() => goTo(i)}
                    className="group text-left"
                    aria-label={`Go to step ${i + 1}: ${step.eyebrow}`}
                  >
                    <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/10">
                      <span
                        ref={(el) => {
                          if (el) segRefs.current[i] = el;
                        }}
                        className="block h-full w-full origin-left rounded-full bg-flow-green"
                        style={{ transform: "scaleX(0)", willChange: "transform" }}
                      />
                    </div>
                    <span
                      className={cn(
                        "mt-2 block font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-300",
                        isActive ? "text-flow-white" : "text-flow-muted group-hover:text-flow-white/70",
                      )}
                    >
                      0{i + 1} {step.eyebrow}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Visual column */}
          <div className="relative order-1 lg:order-2">
            <div
              ref={glowRef}
              className="absolute -inset-6 rounded-[3rem] bg-flow-green/10 blur-3xl lg:-inset-10"
              style={{ willChange: "transform" }}
              aria-hidden="true"
            />
            <div ref={stackRef} className="relative mx-auto w-full max-w-[12rem] lg:max-w-2xl" style={{ willChange: "transform" }}>
              <div className="relative aspect-[4/5] w-full lg:aspect-video">
                {STEPS.map((step, i) => (
                  <div
                    key={`img-${step.eyebrow}`}
                    ref={(el) => {
                      if (el) imageRefs.current[i] = el;
                    }}
                    className="absolute inset-0"
                    style={{ opacity: i === 0 ? 1 : 0, willChange: "transform, opacity" }}
                  >
                    <div className="electric-frame relative h-full w-full overflow-hidden rounded-2xl border border-flow-green/20 bg-flow-black shadow-[0_0_80px_rgba(114,205,104,0.12)]">
                      <Image
                        src={step.image.mobileSrc}
                        alt={step.image.alt}
                        fill
                        sizes="100vw"
                        className="object-cover lg:hidden"
                        style={{ objectPosition: step.image.mobileObjectPosition }}
                      />
                      <Image
                        src={step.image.src}
                        alt={step.image.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 56vw"
                        className="hidden object-cover lg:block"
                        style={{ objectPosition: step.image.objectPosition }}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-flow-black/30 via-transparent to-transparent" />
                      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
