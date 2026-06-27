"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/site";
import { CharacterSelect } from "./CharacterSelect";
import { GameEngine, type EngineColors, type GameResult } from "./GameEngine";
import { loadSprites } from "./sprites";
import { useSound } from "./useSound";
import type { Character } from "./characters";

const COLORS: EngineColors = {
  green: "#5eff95",
  greenDim: "#35c46a",
  red: "#ff4d5e",
  black: "#060807",
  gold: "#d7b85a",
};

const SCORE_VAL = 50;
const COIN_VAL = 250;

const money = (n: number) => "+$" + n.toLocaleString("en-US");

/** Score tier / medal based on PnL. */
function tierFor(pnl: number): { name: string; color: string } {
  if (pnl >= 7000) return { name: "DIAMOND HANDS", color: "#8be9ff" };
  if (pnl >= 3500) return { name: "SCALPER", color: "#5eff95" };
  if (pnl >= 1500) return { name: "SWING TRADER", color: "#d7b85a" };
  if (pnl >= 500) return { name: "RETAIL", color: "#f0f0eb" };
  return { name: "PAPER HANDS", color: "#8a8a8a" };
}

function vibrate(pattern: number | number[]) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(pattern);
  } catch {}
}

type Phase = "select" | "play";
type Mode = "loading" | "ready" | "playing" | "dead";

export function FlappyGame() {
  const [phase, setPhase] = useState<Phase>("select");
  const [selected, setSelected] = useState<Character | null>(null);
  const [mode, setMode] = useState<Mode>("loading");
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [pulse, setPulse] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);

  const pnl = score * SCORE_VAL + coins * COIN_VAL;
  useEffect(() => {
    if (pnl > 0) setPulse((p) => p + 1);
  }, [pnl]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const sound = useSound();
  const playRef = useRef(sound.play);
  useEffect(() => {
    playRef.current = sound.play;
  }, [sound.play]);

  // ——— engine setup for the chosen character ———
  useEffect(() => {
    if (phase !== "play" || !selected?.frames) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let engine: GameEngine | null = null;
    let ro: ResizeObserver | null = null;

    setMode("loading");
    setScore(0);
    setCoins(0);
    setResult(null);

    loadSprites(selected.frames).then((frames) => {
      if (disposed) return;
      engine = new GameEngine(canvas, {
        frames,
        colors: COLORS,
        callbacks: {
          onScore: (s) => setScore(s),
          onCoin: (c) => {
            setCoins(c);
            playRef.current("coin");
            vibrate(12);
          },
          onStart: () => setMode("playing"),
          onGameOver: (r) => {
            setMode("dead");
            setResult(r);
            playRef.current("hit");
            vibrate([35, 25, 60]);
          },
        },
      });
      engineRef.current = engine;

      const wrap = canvas.parentElement!;
      const doResize = () => {
        const rect = wrap.getBoundingClientRect();
        engine!.resize(rect.width, rect.height, Math.min(2, window.devicePixelRatio || 1));
      };
      doResize();
      ro = new ResizeObserver(doResize);
      ro.observe(wrap);

      engine.start();
      setMode("ready");
    });

    const onVis = () => {
      if (!engine) return;
      if (document.hidden) engine.stop();
      else engine.start();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      disposed = true;
      ro?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      engine?.destroy();
      engineRef.current = null;
    };
  }, [phase, selected]);

  const flap = useCallback(() => {
    const e = engineRef.current;
    if (!e) return;
    if (e.getState().mode === "dead") return;
    e.flap();
    playRef.current("flap");
    vibrate(6);
  }, []);

  // keyboard flap
  useEffect(() => {
    if (phase !== "play") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        flap();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, flap]);

  const handleSelect = (c: Character) => {
    sound.play("select");
    setSelected(c);
    setPhase("play");
  };

  const playAgain = () => {
    engineRef.current?.reset();
    setScore(0);
    setCoins(0);
    setResult(null);
    setMode("ready");
  };

  const changeCharacter = () => {
    setPhase("select");
    setSelected(null);
    setMode("loading");
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-flow-black">
      {phase === "select" ? (
        <CharacterSelect onSelect={handleSelect} onNudge={() => sound.play("select")} />
      ) : (
        <div className="relative h-full w-full sm:aspect-[9/16] sm:w-auto sm:max-w-full sm:border-x sm:border-flow-border">
          <canvas
            ref={canvasRef}
            onPointerDown={(e) => {
              e.preventDefault();
              flap();
            }}
            className="absolute inset-0 h-full w-full touch-none"
            style={{ imageRendering: "pixelated" }}
          />

          {/* top HUD */}
          {(mode === "ready" || mode === "playing") && (
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-[max(env(safe-area-inset-top),0.9rem)] px-4">
              <div className="flex items-center gap-1.5 rounded-lg bg-black/35 px-2.5 py-1.5 backdrop-blur-sm">
                <CoinGlyph />
                <span style={{ fontFamily: "var(--font-pixel)", fontSize: "0.7rem" }} className="text-flow-gold">
                  {coins}
                </span>
              </div>
              <span
                key={pulse}
                style={{
                  fontFamily: "var(--font-pixel)",
                  fontSize: "1.1rem",
                  animation: "pixelPop 180ms ease-out",
                }}
                className="text-flow-green drop-shadow-[0_2px_0_rgba(0,0,0,0.6)]"
              >
                {money(pnl)}
              </span>
              <button
                onClick={() => sound.toggleMute()}
                className="pointer-events-auto rounded-lg bg-black/35 p-1.5 text-flow-white/80 backdrop-blur-sm"
                aria-label={sound.muted ? "Unmute" : "Mute"}
              >
                {sound.muted ? <MutedGlyph /> : <SoundGlyph />}
              </button>
            </div>
          )}

          {/* ready prompt */}
          {mode === "ready" && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
              <p
                className="animate-pulse text-flow-green"
                style={{ fontFamily: "var(--font-pixel)", fontSize: "1rem" }}
              >
                TAP TO START
              </p>
              <p className="text-xs uppercase tracking-[0.3em] text-flow-muted">
                Tap / Space / Click to flap
              </p>
            </div>
          )}

          {/* loading */}
          {mode === "loading" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="animate-pulse text-sm tracking-widest text-flow-green">LOADING…</span>
            </div>
          )}

          {/* game over */}
          {mode === "dead" && result && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-3xl border border-flow-border bg-flow-graphite/90 p-6 text-center shadow-[0_0_50px_rgba(0,0,0,0.6)]">
                <h2
                  className="leading-relaxed text-flow-red"
                  style={{ fontFamily: "var(--font-pixel)", fontSize: "0.92rem", lineHeight: 1.7 }}
                >
                  THE MARKET WIPED YOU OUT
                </h2>

                {/* final PnL + tier */}
                <div className="mt-5">
                  <div
                    style={{ fontFamily: "var(--font-pixel)", fontSize: "1.6rem" }}
                    className="text-flow-green drop-shadow-[0_2px_0_rgba(0,0,0,0.6)]"
                  >
                    {money(result.pnl)}
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <span
                      className="rounded-full px-3 py-1 text-[0.6rem] uppercase tracking-[0.14em]"
                      style={{
                        fontFamily: "var(--font-pixel)",
                        color: tierFor(result.pnl).color,
                        border: `1px solid ${tierFor(result.pnl).color}55`,
                        background: `${tierFor(result.pnl).color}14`,
                      }}
                    >
                      {tierFor(result.pnl).name}
                    </span>
                    {result.isBest && result.pnl > 0 && (
                      <span
                        className="animate-pulse rounded-full bg-flow-green px-3 py-1 text-[0.6rem] uppercase tracking-[0.14em] text-black"
                        style={{ fontFamily: "var(--font-pixel)" }}
                      >
                        NEW BEST
                      </span>
                    )}
                  </div>
                </div>

                <div className="my-6 grid grid-cols-3 gap-3">
                  <Stat label="Candles" value={result.score} accent="text-flow-white" />
                  <Stat label="Coins" value={result.coins} accent="text-flow-gold" />
                  <Stat label="Best" value={result.best} accent="text-flow-green" money />
                </div>

                <a
                  href={siteConfig.discordInvite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl bg-flow-green px-4 py-4 text-black shadow-[0_0_30px_rgba(94,255,149,0.35)] transition hover:brightness-105"
                  style={{ fontFamily: "var(--font-pixel)", fontSize: "0.66rem", lineHeight: 1.7 }}
                >
                  LEARN HOW TO BEAT THE MARKET HERE
                </a>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={playAgain}
                    className="flex-1 rounded-2xl border border-flow-green/40 bg-flow-green/10 py-3 text-sm font-semibold uppercase tracking-wider text-flow-green transition hover:bg-flow-green/20"
                  >
                    Play again
                  </button>
                  <button
                    onClick={changeCharacter}
                    className="flex-1 rounded-2xl border border-flow-border py-3 text-sm font-semibold uppercase tracking-wider text-flow-muted transition hover:text-flow-white"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  money: asMoney = false,
}: {
  label: string;
  value: number;
  accent: string;
  money?: boolean;
}) {
  return (
    <div className="rounded-xl border border-flow-border bg-black/30 py-3">
      <div
        className={`${accent}`}
        style={{ fontFamily: "var(--font-pixel)", fontSize: asMoney ? "0.8rem" : "1.05rem" }}
      >
        {asMoney ? "$" + value.toLocaleString("en-US") : value}
      </div>
      <div className="mt-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-flow-muted">{label}</div>
    </div>
  );
}

function CoinGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill="#d7b85a" />
      <circle cx="12" cy="12" r="6" fill="none" stroke="#5eff95" strokeWidth="2" />
    </svg>
  );
}

function SoundGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M16 8a5 5 0 0 1 0 8" />
    </svg>
  );
}

function MutedGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M22 9l-6 6M16 9l6 6" />
    </svg>
  );
}
