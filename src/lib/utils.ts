import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Like `prefers-reduced-motion`, but touch / mobile devices are intentionally
 * treated as motion-OK so the marketing animations still play on phones (the
 * brand wants a lively mobile experience). Desktop pointer users keep full
 * reduced-motion respect. Safe to call during SSR (returns false).
 */
export function prefersReducedMotionSafe(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  return reduced && !isTouch;
}
