import localFont from "next/font/local";

/**
 * 8-bit display font for the game HUD and titles. Self-hosted (woff2 committed
 * to the repo) so the build never depends on fetching Google Fonts at build
 * time. Exposed as a CSS variable scoped to the game shell - the rest of the
 * site keeps Inter.
 */
export const pixelFont = localFont({
  src: "./fonts/press-start-2p.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-pixel",
});
