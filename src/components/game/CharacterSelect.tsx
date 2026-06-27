"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CHARACTERS, type Character } from "./characters";

type Props = {
  onSelect: (c: Character) => void;
  onNudge?: () => void;
};

export function CharacterSelect({ onSelect, onNudge }: Props) {
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const startX = useRef<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const last = CHARACTERS.length - 1;
  const current = CHARACTERS[index];

  const go = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(last, next));
      if (clamped !== index) onNudge?.();
      setIndex(clamped);
    },
    [index, last, onNudge],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(index - 1);
      else if (e.key === "ArrowRight") go(index + 1);
      else if (e.key === "Enter" && !current.locked) onSelect(current);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, current, go, onSelect]);

  const onDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    setDrag(e.clientX - startX.current);
  };
  const onUp = () => {
    if (startX.current === null) return;
    const w = trackRef.current?.clientWidth ?? 320;
    const threshold = Math.min(80, w * 0.18);
    if (drag > threshold) go(index - 1);
    else if (drag < -threshold) go(index + 1);
    startX.current = null;
    setDrag(0);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-between px-5 py-[max(env(safe-area-inset-top),1.25rem)] pb-[max(env(safe-area-inset-bottom),1.25rem)]">
      <header className="pt-2 text-center">
        <p
          className="text-flow-green"
          style={{ fontFamily: "var(--font-pixel)", fontSize: "0.72rem", letterSpacing: "0.12em" }}
        >
          SELECT YOUR TRADER
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.3em] text-flow-muted">Swipe to browse</p>
      </header>

      {/* carousel */}
      <div className="relative w-full max-w-sm flex-1">
        <div ref={trackRef} className="relative h-full w-full overflow-hidden">
          <div
            className="flex h-full touch-none"
            style={{
              transform: `translateX(calc(${-index * 100}% + ${drag}px))`,
              transition: startX.current === null ? "transform 280ms cubic-bezier(0.22,1,0.36,1)" : "none",
            }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            {CHARACTERS.map((c) => (
              <div key={c.id} className="flex h-full w-full shrink-0 flex-col items-center justify-center">
                <Card character={c} />
              </div>
            ))}
          </div>
        </div>

        {/* arrows */}
        <button
          aria-label="Previous"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full border border-flow-border bg-black/40 p-2 text-flow-white/80 backdrop-blur disabled:opacity-25"
        >
          <Chevron dir="left" />
        </button>
        <button
          aria-label="Next"
          onClick={() => go(index + 1)}
          disabled={index === last}
          className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full border border-flow-border bg-black/40 p-2 text-flow-white/80 backdrop-blur disabled:opacity-25"
        >
          <Chevron dir="right" />
        </button>
      </div>

      {/* dots + play */}
      <footer className="flex w-full max-w-sm flex-col items-center gap-5">
        <div className="flex items-center gap-2">
          {CHARACTERS.map((c, i) => (
            <button
              key={c.id}
              aria-label={`Go to ${c.name}`}
              onClick={() => go(i)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                i === index ? "scale-110 bg-flow-green" : "bg-flow-border"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => !current.locked && onSelect(current)}
          disabled={current.locked}
          className={`w-full rounded-2xl py-4 text-center transition active:scale-[0.98] ${
            current.locked
              ? "cursor-not-allowed bg-flow-border text-flow-muted"
              : "bg-flow-green text-black shadow-[0_0_30px_rgba(94,255,149,0.35)] hover:brightness-105"
          }`}
          style={{ fontFamily: "var(--font-pixel)", fontSize: "0.8rem", letterSpacing: "0.06em" }}
        >
          {current.locked ? "LOCKED" : "PLAY"}
        </button>
      </footer>
    </div>
  );
}

function Card({ character }: { character: Character }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-56 w-56 items-center justify-center rounded-3xl border border-flow-border bg-gradient-to-b from-white/[0.04] to-transparent sm:h-64 sm:w-64">
        <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_60px_rgba(94,255,149,0.12)]" />
        {character.locked ? (
          <div className="flex flex-col items-center gap-3 text-flow-muted">
            <LockGlyph />
            <span className="text-[2.5rem]" style={{ fontFamily: "var(--font-pixel)" }}>
              ?
            </span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={character.portrait}
            alt={character.name}
            draggable={false}
            className="h-[88%] w-auto select-none object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            style={{ imageRendering: "pixelated" }}
          />
        )}
      </div>
      <h2
        className="mt-6 text-flow-white"
        style={{ fontFamily: "var(--font-pixel)", fontSize: "0.95rem" }}
      >
        {character.name}
      </h2>
      <p className={`mt-3 text-sm ${character.locked ? "text-flow-muted" : "text-flow-green"}`}>
        {character.tagline}
      </p>
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      {dir === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  );
}

function LockGlyph() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
