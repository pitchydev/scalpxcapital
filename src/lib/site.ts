import { previewLinks } from "@/lib/links";

export const siteConfig = {
  name: "ScalpX",
  tagline: "Low-Latency Intelligence for Crypto Scalpers",
  description:
    "ScalpX delivers millisecond signal, live order-flow and execution built for scalpers, real-time clarity on every coin so you strike before the market makes a sound.",
  url: "https://scalpxcapital.com",
  contactEmail: "hello@scalpx.trade",
  formsEndpoint: "https://formsubmit.co/ajax/hello@scalpx.trade",
  /** Preview: scroll-to-join dummy. Live: real Discord invite */
  discordInvite: previewLinks.discordInvite,
  links: previewLinks,
  isPreview: previewLinks.isPreview,
} as const;
