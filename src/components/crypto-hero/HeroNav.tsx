"use client";

import Image from "next/image";
import { siteConfig } from "@/lib/site";

const LINKS = ["Community", "Platform", "Education", "Testimonials"];

export function HeroNav() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Wordmark logo */}
        <a href="#top" className="pointer-events-auto inline-flex items-center">
          <Image
            src="/brand/logo/scalpx-logo-primary.png"
            alt="ScalpX"
            width={150}
            height={22}
            priority
            className="h-[22px] w-auto"
          />
        </a>

        {/* Center links */}
        <nav className="pointer-events-auto hidden items-center gap-9 lg:flex" aria-label="Hero">
          {LINKS.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-sm font-medium text-white/65 transition-colors hover:text-white"
            >
              {l}
            </a>
          ))}
        </nav>

        {/* JOIN pill */}
        <a
          href={siteConfig.discordInvite}
          target="_blank"
          rel="noopener noreferrer"
          className="ch-join pointer-events-auto inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-bold text-black"
        >
          JOIN
        </a>
      </div>
    </header>
  );
}
