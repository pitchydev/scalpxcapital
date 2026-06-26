"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { flowXImages } from "@/lib/images";
import { flowXMedia } from "@/lib/media";

export function HeroBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotion = () => setReduceMotion(mq.matches);
    applyMotion();
    mq.addEventListener("change", applyMotion);

    const video = videoRef.current;
    if (!video || mq.matches) return;

    video.muted = true;
    video.defaultMuted = true;

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

    const onReady = () => play();
    play();

    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    video.addEventListener("playing", () => video.removeAttribute("poster"));

    const onVisible = () => {
      if (document.visibilityState === "visible") play();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", play);

    return () => {
      if (retryTimer) clearTimeout(retryTimer);
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      mq.removeEventListener("change", applyMotion);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", play);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-flow-black" aria-hidden="true">
      {reduceMotion && flowXImages.hero.ready ? (
        <Image
          src={flowXImages.hero.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full scale-[1.02] object-cover object-center"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={flowXMedia.heroVideo.poster}
          src={flowXMedia.heroVideo.src}
        />
      )}

      <div className="hero-cinematic-overlay absolute inset-0" />
    </div>
  );
}
