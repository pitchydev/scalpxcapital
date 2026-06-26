"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { prefersReducedMotionSafe } from "@/lib/utils";

/** Fires once when the element scrolls into view. Honours reduced-motion. */
function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (prefersReducedMotionSafe()) {
      setReduced(true);
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView, reduced };
}

type AnimProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
};

/**
 * Cinematic settle reveal for imagery: fade + slight zoom-out + lift.
 *
 * NB: we deliberately avoid `clip-path` here. Clipping the *observed* element to
 * zero area makes its IntersectionObserver ratio 0, so it would never report as
 * visible and the reveal would never fire (the element stays hidden forever).
 */
export function ClipReveal({ children, className = "", delay = 0, style }: AnimProps) {
  const { ref, inView, reduced } = useInView<HTMLDivElement>(0.1);
  const anim: CSSProperties = reduced
    ? {}
    : {
        transform: inView ? "scale(1) translateY(0)" : "scale(1.05) translateY(26px)",
        opacity: inView ? 1 : 0,
        transition: `transform 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}ms, opacity 0.8s ease ${delay}ms`,
        willChange: "transform, opacity",
      };
  return (
    <div ref={ref} className={className} style={{ ...anim, ...style }}>
      {children}
    </div>
  );
}

/** Directional slide + fade. Use for copy blocks. */
export function SlideIn({
  children,
  className = "",
  delay = 0,
  from = "up",
  style,
}: AnimProps & { from?: "up" | "left" | "right" }) {
  const { ref, inView, reduced } = useInView<HTMLDivElement>();
  const offset =
    from === "right" ? "translateX(44px)" : from === "left" ? "translateX(-44px)" : "translateY(38px)";
  const anim: CSSProperties = reduced
    ? {}
    : {
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : offset,
        transition: `opacity 0.7s ease ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: "transform, opacity",
      };
  return (
    <div ref={ref} className={className} style={{ ...anim, ...style }}>
      {children}
    </div>
  );
}

/** 3D card that tilts up off the floor like a dealt card. For card grids. */
export function TiltCard({ children, className = "", delay = 0, style }: AnimProps) {
  const { ref, inView, reduced } = useInView<HTMLDivElement>(0.18);
  const anim: CSSProperties = reduced
    ? {}
    : {
        opacity: inView ? 1 : 0,
        transform: inView
          ? "perspective(1000px) rotateX(0deg) translateY(0)"
          : "perspective(1000px) rotateX(14deg) translateY(52px)",
        transformOrigin: "center bottom",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: "transform, opacity",
      };
  return (
    <div ref={ref} className={className} style={{ ...anim, ...style }}>
      {children}
    </div>
  );
}

/** Springy scale + de-blur pop. For chips / small tokens. */
export function PopIn({ children, className = "", delay = 0, style }: AnimProps) {
  const { ref, inView, reduced } = useInView<HTMLSpanElement>(0.2);
  const anim: CSSProperties = reduced
    ? {}
    : {
        display: "inline-block",
        opacity: inView ? 1 : 0,
        transform: inView ? "scale(1)" : "scale(0.6)",
        filter: inView ? "blur(0px)" : "blur(4px)",
        transition: `opacity 0.45s ease ${delay}ms, transform 0.6s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms, filter 0.45s ease ${delay}ms`,
        willChange: "transform, opacity, filter",
      };
  return (
    <span ref={ref} className={className} style={{ ...anim, ...style }}>
      {children}
    </span>
  );
}

/** Animated count-up for numeric stats; plain reveal for word values. */
export function StatNumber({ value, className = "" }: { value: string; className?: string }) {
  const { ref, inView, reduced } = useInView<HTMLSpanElement>(0.4);
  const match = value.match(/^(\D*)([\d,]+)(.*)$/);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match) return;
    const target = parseInt(match[2].replace(/,/g, ""), 10);
    const prefix = match[1];
    const suffix = match[3];
    const fmt = (n: number) => n.toLocaleString("en-US");

    if (reduced || !inView) {
      if (reduced) el.textContent = prefix + fmt(target) + suffix;
      return;
    }

    const duration = 1500;
    const startTime = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + fmt(Math.round(eased * target)) + suffix;
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, match]);

  return (
    <span ref={ref} className={className}>
      {match ? `${match[1]}0${match[3]}` : value}
    </span>
  );
}
