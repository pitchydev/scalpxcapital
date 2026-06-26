"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FlowXVideoVisualProps = {
  src: string;
  poster?: string;
  label: string;
  fallback: ReactNode;
  className?: string;
  aspect?: "square" | "video" | "hero" | "wide" | "portrait";
  fit?: "cover" | "contain";
  glow?: boolean;
};

const aspectClass = {
  square: "aspect-square",
  video: "aspect-video",
  hero: "aspect-[4/3] lg:aspect-[4/5]",
  wide: "aspect-[16/10]",
  portrait: "aspect-[9/16]",
};

export function FlowXVideoVisual({
  src,
  poster,
  label,
  fallback,
  className,
  aspect = "square",
  fit = "cover",
  glow = false,
}: FlowXVideoVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotion = () => setReduceMotion(mq.matches);
    applyMotion();
    mq.addEventListener("change", applyMotion);

    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container || mq.matches) return;

    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;

    let attempts = 0;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const play = () => {
      if (attempts >= 15) return;
      attempts += 1;

      void video
        .play()
        .then(() => video.removeAttribute("poster"))
        .catch(() => {
          retryTimer = setTimeout(play, 150 * attempts);
        });
    };

    const resetAndPlay = () => {
      attempts = 0;
      play();
    };

    const onReady = () => play();
    play();

    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    video.addEventListener("canplaythrough", onReady);
    video.addEventListener("playing", () => video.removeAttribute("poster"));
    video.addEventListener("ended", resetAndPlay);

    const onVisible = () => {
      if (document.visibilityState === "visible") resetAndPlay();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", resetAndPlay);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) resetAndPlay();
      },
      { threshold: 0.15 },
    );
    observer.observe(container);

    return () => {
      if (retryTimer) clearTimeout(retryTimer);
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("canplaythrough", onReady);
      video.removeEventListener("ended", resetAndPlay);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", resetAndPlay);
      mq.removeEventListener("change", applyMotion);
      observer.disconnect();
    };
  }, [src]);

  if (reduceMotion) {
    return <div className={className}>{fallback}</div>;
  }

  return (
    <div ref={containerRef} className={className}>
      <div
        className={cn(
          "visual-frame relative overflow-hidden rounded-2xl border bg-flow-black",
          glow
            ? "electric-frame border-flow-green/20 shadow-[0_0_80px_rgba(114,205,104,0.12)]"
            : "border-flow-border shadow-[0_0_0_1px_rgba(114,205,104,0.06)_inset,0_32px_64px_rgba(0,0,0,0.5)]",
          aspectClass[aspect],
        )}
      >
        <video
          ref={videoRef}
          className={cn(
            "absolute inset-0 h-full w-full object-center",
            fit === "contain" ? "object-contain" : "object-cover",
          )}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={poster}
          src={src}
          aria-label={label}
        />

        <noscript>{fallback}</noscript>

        <div
          className={cn(
            "pointer-events-none absolute inset-0",
            glow
              ? "bg-gradient-to-t from-flow-black/25 via-transparent to-transparent"
              : "bg-gradient-to-t from-flow-black/50 via-flow-black/5 to-transparent",
          )}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
