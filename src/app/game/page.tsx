"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { pixelFont } from "@/components/game/pixelFont";

// Client-only: the game owns a canvas + window/localStorage and should never
// be server-rendered.
const FlappyGame = dynamic(
  () => import("@/components/game/FlappyGame").then((m) => m.FlappyGame),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-flow-green">
        <span className="animate-pulse text-sm tracking-widest">LOADING…</span>
      </div>
    ),
  },
);

export default function GamePage() {
  useEffect(() => {
    document.title = "Flappy Scalper - ScalpX";
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    const prevOverscroll = body.style.overscrollBehavior;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      body.style.overscrollBehavior = prevOverscroll;
    };
  }, []);

  return (
    <div
      className={`${pixelFont.variable} relative h-[100dvh] w-full overflow-hidden bg-flow-black`}
      style={{ touchAction: "none" }}
    >
      <FlappyGame />
    </div>
  );
}
