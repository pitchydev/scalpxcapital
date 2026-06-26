"use client";

import { useState } from "react";
import { useMotionValueEvent, type MotionValue } from "framer-motion";
import { siteConfig } from "@/lib/site";
import { lerp, smoothstep } from "./anim";

type HeroContentProps = {
  scrollYProgress: MotionValue<number>;
  reducedMotion?: boolean;
};

export function HeroContent({ scrollYProgress, reducedMotion = false }: HeroContentProps) {
  const [p, setP] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!reducedMotion) setP(v);
  });

  // Reduced motion: render a clean, fully-visible static INTRO hero.
  const progress = reducedMotion ? 0 : p;

  // Centred intro fades/scales out as we pass ~0.22.
  const introFade = 1 - smoothstep(0.06, 0.22, progress);
  const introScale = lerp(1, 0.94, smoothstep(0.06, 0.24, progress));
  const introY = lerp(0, -36, smoothstep(0.06, 0.24, progress));
  const cueFade = 1 - smoothstep(0.02, 0.12, progress);

  // Left-aligned info slides/fades in around 0.42–0.64.
  const infoFade = reducedMotion ? 0 : smoothstep(0.42, 0.64, progress);
  const infoX = lerp(-44, 0, infoFade);

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {/* Centred intro scrim + copy */}
      <div
        className="ch-scrim-radial absolute inset-0"
        style={{ opacity: introFade }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{
          opacity: introFade,
          transform: `translateY(${introY}px) scale(${introScale})`,
          visibility: introFade < 0.01 ? "hidden" : "visible",
        }}
      >
        <h1>
          <span className="ch-head-line1">Stop trading in</span>
          <span className="ch-head-line2">Silence</span>
        </h1>
        <p className="mt-7 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
          Millisecond signal, live order-flow and execution built for scalpers, so you strike
          before the market makes a sound.
        </p>
        <div className="pointer-events-auto mt-10 flex items-center gap-4">
          <a
            href={siteConfig.discordInvite}
            target="_blank"
            rel="noopener noreferrer"
            className="ch-join rounded-full px-7 py-3 text-sm font-bold text-black"
          >
            Join
          </a>
          <a
            href="#platform"
            className="rounded-full border border-white/25 px-7 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-[var(--ch-acid)]/60 hover:bg-white/5"
          >
            Explore
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-2"
        style={{ opacity: cueFade }}
        aria-hidden="true"
      >
        <span className="text-[11px] uppercase tracking-[0.35em] text-white/50">- Scroll -</span>
        <span className="ch-scroll-line h-9 w-px bg-gradient-to-b from-[var(--ch-acid)] to-transparent" />
      </div>

      {/* Left-aligned info scrim + copy */}
      {!reducedMotion && (
        <>
          <div
            className="ch-scrim-left absolute inset-0"
            style={{ opacity: infoFade }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-y-0 left-0 flex max-w-xl flex-col justify-center px-6 sm:px-10 lg:px-16"
            style={{
              opacity: infoFade,
              transform: `translateX(${infoX}px)`,
              visibility: infoFade < 0.01 ? "hidden" : "visible",
            }}
          >
            <h2 className="ch-display-sm text-white">
              See the market <span className="text-[var(--ch-acid)]">before</span> it moves.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/85">
              Real-time order-flow, whale alerts and AI sentiment in one low-latency cockpit.
              Chrome-grade clarity on every coin you trade, for traders who refuse to guess.
            </p>
            <div className="pointer-events-auto mt-8 flex items-center gap-4">
              <a
                href={siteConfig.discordInvite}
                target="_blank"
                rel="noopener noreferrer"
                className="ch-join rounded-full px-7 py-3 text-sm font-bold text-black"
              >
                Get started
              </a>
              <a
                href="#education"
                className="rounded-full border border-white/25 px-7 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-[var(--ch-acid)]/60 hover:bg-white/5"
              >
                Learn more
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
