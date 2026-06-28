import type { Metadata } from "next";

// Server component wrapper for the (client) game page. Its only job is to set
// segment metadata: keep /game out of search indexes so the game stays an
// unlinked, direct-URL-only easter egg.
export const metadata: Metadata = {
  title: "Flappy Scalper - ScalpX",
  robots: { index: false, follow: false },
};

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return children;
}
