import Image from "next/image";
import type { ReactNode } from "react";
import type { FlowXImageAsset } from "@/lib/images";
import { cn } from "@/lib/utils";

type FlowXVisualProps = {
  asset: FlowXImageAsset;
  fallback: ReactNode;
  className?: string;
  frameClassName?: string;
  priority?: boolean;
  aspect?: "square" | "video" | "hero" | "wide";
};

const aspectClass = {
  square: "aspect-square",
  video: "aspect-video",
  hero: "aspect-[4/3] lg:aspect-[4/5]",
  wide: "aspect-[16/10]",
};

export function FlowXVisual({
  asset,
  fallback,
  className,
  frameClassName,
  priority = false,
  aspect = "square",
}: FlowXVisualProps) {
  if (!asset.ready) {
    return <div className={className}>{fallback}</div>;
  }

  return (
    <div
      className={cn(
        "visual-frame relative overflow-hidden rounded-2xl border border-flow-border",
        "shadow-[0_0_0_1px_rgba(114,205,104,0.06)_inset,0_32px_64px_rgba(0,0,0,0.5)]",
        aspectClass[aspect],
        frameClassName,
        className,
      )}
    >
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 560px"
        className="object-cover object-center"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-flow-black/50 via-flow-black/5 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5"
        aria-hidden="true"
      />
    </div>
  );
}
