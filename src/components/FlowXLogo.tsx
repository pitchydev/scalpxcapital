import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type FlowXLogoProps = {
  className?: string;
  height?: number;
  href?: string;
};

export function FlowXLogo({ className, height = 28, href = "#top" }: FlowXLogoProps) {
  const logo = (
    <Image
      src="/brand/logo/scalpx-logo-primary.png"
      alt="SCALPX"
      width={Math.round(height * 6.85)}
      height={height}
      className={cn("h-auto w-auto", className)}
      style={{ height, width: "auto" }}
      priority
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center">
        {logo}
      </Link>
    );
  }

  return logo;
}

/** Text fallback matching logo: SCALP white, X mint */
export function FlowXWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display text-lg font-bold tracking-[0.08em]", className)}>
      SCALP<span className="text-flow-green">X</span>
    </span>
  );
}
