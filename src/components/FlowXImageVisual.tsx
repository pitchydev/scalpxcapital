import Image from "next/image";
import { cn } from "@/lib/utils";

type FlowXImageVisualProps = {
  src: string;
  alt: string;
  mobileSrc?: string;
  className?: string;
  aspect?: "video" | "wide";
  priority?: boolean;
  objectPosition?: string;
  mobileObjectPosition?: string;
};

const aspectClass = {
  video: "aspect-[4/5] lg:aspect-video",
  wide: "aspect-[4/5] lg:aspect-[16/10]",
};

export function FlowXImageVisual({
  src,
  alt,
  mobileSrc,
  className,
  aspect = "video",
  priority = false,
  objectPosition = "center",
  mobileObjectPosition = "center",
}: FlowXImageVisualProps) {
  const frameClass = cn(
    "electric-frame relative overflow-hidden rounded-2xl border border-flow-green/20 bg-flow-black shadow-[0_0_80px_rgba(114,205,104,0.12)]",
    aspectClass[aspect],
    className,
  );

  return (
    <div className={frameClass}>
      {mobileSrc ? (
        <>
          <Image
            src={mobileSrc}
            alt={alt}
            fill
            priority={priority}
            sizes="100vw"
            className="object-cover lg:hidden"
            style={{ objectPosition: mobileObjectPosition }}
          />
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 56vw"
            className="hidden object-cover lg:block"
            style={{ objectPosition }}
          />
        </>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 56vw"
          className="object-cover"
          style={{ objectPosition: mobileObjectPosition }}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-flow-black/25 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
    </div>
  );
}
