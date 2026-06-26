"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

/** Routes that render their own nav/footer and should skip the global chrome. */
const BARE_ROUTES = ["/crypto-hero"];
/** Routes whose hero provides its own top nav - skip the global Navbar only. */
const SELF_NAV_ROUTES = ["/"];

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const bare = BARE_ROUTES.some((r) => pathname === r || pathname?.startsWith(`${r}/`));
  const selfNav = SELF_NAV_ROUTES.some((r) => pathname === r);

  return (
    <>
      {!bare && !selfNav && <Navbar />}
      <main>{children}</main>
      {!bare && <Footer />}
    </>
  );
}
