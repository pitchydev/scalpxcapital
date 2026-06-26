"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  useScroll,
  useMotionValueEvent,
  useTransform,
  motion,
} from "framer-motion";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { HeroNav } from "./HeroNav";
import { HeroContent } from "./HeroContent";

// WebGL canvas is client-only; CSS background shows underneath while it boots.
const CoinScene = dynamic(() => import("./CoinScene"), { ssr: false, loading: () => null });

export function CryptoHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotionSafe();
  const [sceneReady, setSceneReady] = useState(false);
  // Pause the WebGL render loop when the hero scrolls off-screen (perf only -
  // no visual change while it's in view).
  const [heroVisible, setHeroVisible] = useState(true);

  // Live progress, mutated outside React so useFrame reads it without re-renders.
  const progressRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
  });

  // Background streaks parallax at a slower rate than the coins.
  const streakY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const streakX = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  // Always begin at the intro - mobile browsers otherwise restore mid-scroll.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  // Stop rendering the canvas once the hero is fully scrolled past.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { rootMargin: "100px 0px 100px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="crypto-hero relative w-full"
      style={{ height: reducedMotion ? "100svh" : "260vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* CSS background (visible before/while WebGL initialises) */}
        <div className="ch-bg absolute inset-0" aria-hidden="true" />
        <div className="ch-grid absolute inset-0" aria-hidden="true" />
        <motion.div
          className="ch-aurora absolute inset-[-20%]"
          style={reducedMotion ? undefined : { x: streakX, y: streakY }}
          aria-hidden="true"
        />
        <div className="ch-grain absolute inset-0" aria-hidden="true" />
        <div className="ch-vignette absolute inset-0" aria-hidden="true" />

        {/* 3D coins (fade in once WebGL is ready, no pop) */}
        <div
          className="absolute inset-0 z-10 transition-opacity duration-1000 ease-out"
          style={{ opacity: sceneReady ? 1 : 0 }}
        >
          <CoinScene
            progressRef={progressRef}
            reducedMotion={reducedMotion}
            paused={!heroVisible}
            onReady={() => setSceneReady(true)}
          />
        </div>

        {/* Overlays */}
        <HeroNav />
        <HeroContent scrollYProgress={scrollYProgress} reducedMotion={reducedMotion} />
      </div>
    </section>
  );
}

export default CryptoHero;
