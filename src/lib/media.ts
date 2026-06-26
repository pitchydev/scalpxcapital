export const flowXMedia = {
  heroVideo: {
    // Bump ?v= when replacing the file so browsers don't serve a stale cached MP4
    src: "/videos/hero.mp4?v=4",
    poster: "/images/hero-growth-engine.png",
  },
  sponsorshipRadarVideo: {
    src: "/videos/sponsorship-radar.mp4?v=1",
    poster: "/images/influencer-sponsorship-radar.png",
  },
  problemAttentionVideo: {
    src: "/videos/problem-attention.mp4?v=1",
    poster: "/images/problem-attention.png",
  },
} as const;

/** ScalpX community section imagery (trading lounge → traders → showcase → platform). */
export const scalpXImages = {
  lounge: {
    src: "/images/scalpx-trading-lounge.png?v=3",
    mobileSrc: "/images/scalpx-trading-lounge-mobile.png?v=4",
    alt: "ScalpX live trading lounge with charts, chat and community energy",
    objectPosition: "center",
    mobileObjectPosition: "center",
  },
  traders: {
    src: "/images/scalpx-trader-network.png?v=3",
    mobileSrc: "/images/scalpx-trader-network-mobile.png?v=4",
    alt: "ScalpX elite trader network with multiple styles connected in one ecosystem",
    objectPosition: "center",
    mobileObjectPosition: "center",
  },
  platform: {
    src: "/images/scalpx-execution-engine.png?v=3",
    mobileSrc: "/images/scalpx-execution-engine-mobile.png?v=4",
    alt: "ScalpX auto-trading execution engine connecting signals to live execution",
    objectPosition: "center",
    mobileObjectPosition: "center",
  },
  showcase: {
    src: "/images/scalpx-profit-showcase.png?v=3",
    mobileSrc: "/images/scalpx-profit-showcase-mobile.png?v=4",
    alt: "ScalpX profit showcase wall with journals, PnL cards and community reactions",
    objectPosition: "center",
    mobileObjectPosition: "center",
  },
} as const;

/** Sticky flow steps: live lounge → trader network → education journals → execution platform */
export const flowStepImages = [
  scalpXImages.lounge,
  scalpXImages.traders,
  scalpXImages.showcase,
  scalpXImages.platform,
] as const;
