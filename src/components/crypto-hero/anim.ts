/**
 * Shared math + easing helpers for the cinematic crypto hero.
 * Kept framework-agnostic so they can be used both inside useFrame (R3F)
 * and in the DOM overlay logic.
 */

/** Clamp a value into [min, max]. */
export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

/** Linear interpolation. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Cubic ease-in-out - the workhorse for the scroll-driven choreography. */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Cubic ease-out - decelerating "pop", used for the coin eruption. */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Ease-out with a gentle overshoot - gives the eruption a lively settle. */
export function easeOutBack(t: number, overshoot = 1.2): number {
  const c1 = overshoot;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

/**
 * Smoothstep between edge0 and edge1. Returns 0 below edge0, 1 above edge1,
 * with a smooth Hermite ramp in-between. Used to fade/translate the copy
 * deterministically from a single scroll progress value.
 */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/**
 * Frame-rate-independent damping factor.
 *
 * Instead of lerp(current, target, fixedAlpha) - which moves faster on
 * high-refresh displays - we compute an alpha from elapsed `delta` so the
 * motion feels identical at 30fps, 60fps or 120fps.
 *
 * `dampFactor` is the fraction of distance REMAINING after one second
 * (smaller = snappier). Typical range 0.0001 (very snappy) … 0.2 (loose).
 */
export function dampAlpha(dampFactor: number, delta: number): number {
  return 1 - Math.pow(dampFactor, delta);
}

/** Damp a scalar toward a target with frame-rate-independent smoothing. */
export function damp(current: number, target: number, dampFactor: number, delta: number): number {
  return lerp(current, target, dampAlpha(dampFactor, delta));
}
