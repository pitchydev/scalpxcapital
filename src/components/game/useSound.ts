"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Sfx = "flap" | "coin" | "hit" | "select";

const MUTE_KEY = "scalpx_flappy_muted";

/** Tiny WebAudio chiptune blips - no asset files needed. */
export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    try {
      setMuted(localStorage.getItem(MUTE_KEY) === "1");
    } catch {}
  }, []);

  const ensureCtx = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctxRef.current = new AC();
    }
    if (ctxRef.current.state === "suspended") void ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const blip = useCallback(
    (
      ctx: AudioContext,
      type: OscillatorType,
      from: number,
      to: number,
      dur: number,
      gain: number,
    ) => {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(from, t);
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t + dur);
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(g).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    },
    [],
  );

  const play = useCallback(
    (sfx: Sfx) => {
      if (muted) return;
      const ctx = ensureCtx();
      if (!ctx) return;
      switch (sfx) {
        case "flap":
          blip(ctx, "square", 520, 760, 0.09, 0.06);
          break;
        case "coin":
          blip(ctx, "square", 880, 1320, 0.07, 0.05);
          setTimeout(() => blip(ctx, "square", 1320, 1660, 0.08, 0.05), 60);
          break;
        case "hit":
          blip(ctx, "sawtooth", 320, 60, 0.32, 0.09);
          break;
        case "select":
          blip(ctx, "square", 660, 990, 0.06, 0.04);
          break;
      }
    },
    [muted, ensureCtx, blip],
  );

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      try {
        localStorage.setItem(MUTE_KEY, next ? "1" : "0");
      } catch {}
      return next;
    });
  }, []);

  return { play, muted, toggleMute };
}
