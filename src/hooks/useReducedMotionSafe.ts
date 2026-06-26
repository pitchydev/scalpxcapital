"use client";

import { useEffect, useState } from "react";

/**
 * Reactive `prefers-reduced-motion` that treats touch / mobile devices as
 * motion-OK, so the hero and reveals still animate on phones even when the user
 * has "Reduce Motion" enabled (common on iOS). Desktop pointer users keep full
 * reduced-motion respect.
 */
export function useReducedMotionSafe(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touch = window.matchMedia("(pointer: coarse)");
    const update = () => setReduced(motion.matches && !touch.matches);
    update();
    motion.addEventListener("change", update);
    touch.addEventListener("change", update);
    return () => {
      motion.removeEventListener("change", update);
      touch.removeEventListener("change", update);
    };
  }, []);

  return reduced;
}
