"use client";

import { useEffect, useState, type RefObject } from "react";

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

/**
 * Scroll progress (0→1) through an element.
 *
 * Perf: work is gated by an IntersectionObserver so the scroll listener and
 * layout reads only run while the section is near the viewport. Tiny deltas are
 * ignored to avoid re-rendering the (heavy) sticky sections on every frame.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    let active = false;

    const update = () => {
      const node = ref.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const scrollTop = window.scrollY || window.pageYOffset;
      const elementTop = rect.top + scrollTop;
      const start = elementTop - window.innerHeight * 0.75;
      const end = elementTop + rect.height - window.innerHeight * 0.35;
      const next = clamp((scrollTop - start) / Math.max(1, end - start));

      setProgress((current) => (Math.abs(current - next) < 0.0015 ? current : next));
    };

    const requestUpdate = () => {
      if (!active) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active) requestUpdate();
      },
      { rootMargin: "200px 0px 200px 0px" },
    );

    io.observe(el);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    update();

    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [ref]);

  return progress;
}
