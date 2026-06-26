"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { FlowXLogo } from "@/components/FlowXLogo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "#platform", label: "Platform" },
  { href: "#influencer-intelligence", label: "Intelligence" },
  { href: "#what-we-do", label: "Features" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className={cn("nav-mm fixed inset-x-0 top-0 z-50", scrolled && "nav-mm-scrolled")}>
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-5 lg:h-[4.25rem] lg:px-8">
          <FlowXLogo height={22} />

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {NAV.map((l) => (
              <Link key={l.href} href={l.href} className="nav-mm-link">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/20 backdrop-blur lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 bg-flow-black/98 px-4 pt-20 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-2">
            {NAV.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-xl px-4 py-3 text-lg" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link href="#contact" className="btn-mm mt-4 w-full" onClick={() => setOpen(false)}>
              Talk to ScalpX
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
