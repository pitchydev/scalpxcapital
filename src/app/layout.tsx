import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { SiteChrome } from "@/components/SiteChrome";
import { ScrollToTopOnLoad } from "@/components/ScrollToTopOnLoad";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#060807",
};

// The origin that serves this deployment. og:image / canonical URLs must resolve
// here, otherwise scrapers (WhatsApp, etc.) fetch them from a domain that doesn't
// host the assets. This must be a domain that is connected to this Vercel project
// and serving these files. Override via NEXT_PUBLIC_SITE_URL if needed.
const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://scalpxcapital.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "crypto scalping",
    "order flow",
    "low latency trading",
    "crypto signals",
    "whale alerts",
    "ScalpX",
  ],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteOrigin,
    siteName: siteConfig.name,
    locale: "en_GB",
    type: "website",
    images: [
      { url: "/scalpx-og.jpg?v=2", width: 1200, height: 630, alt: "ScalpX - The best place to be in Crypto." },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/scalpx-og.jpg?v=2"],
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/favicon.svg?v=2", type: "image/svg+xml" },
      { url: "/favicon-32.png?v=2", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png?v=2", sizes: "16x16", type: "image/png" },
      { url: "/scalpx-icon-192.png?v=2", sizes: "192x192", type: "image/png" },
      { url: "/scalpx-icon-512.png?v=2", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon-180.png?v=2",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        <SmoothScrollProvider>
          <ScrollToTopOnLoad />
          <SiteChrome>{children}</SiteChrome>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
