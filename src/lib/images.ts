/**
 * Flow X 3D asset paths - drop files into /public/images/ and set ready: true.
 *
 * Expected filenames:
 * 1. hero-growth-engine.png          - homepage hero (Marketing Growth Engine)
 * 2. influencer-sponsorship-radar.png - Influencer Intelligence + Sponsorship Scout
 * 3. campaign-network-map.png      - Campaign Execution
 * 4. sponsorship-deal-pipeline.png - optional: partnerships / process / BD
 */

export type FlowXImageAsset = {
  src: string;
  alt: string;
  /** Flip to true once the file exists in public/images/ */
  ready: boolean;
};

export const flowXImages = {
  hero: {
    src: "/images/hero-growth-engine.png",
    alt: "Flow X growth engine - crypto marketing command network connecting social platforms, KOLs, exchanges and Web3 communities",
    ready: true,
  },
  sponsorshipRadar: {
    src: "/images/influencer-sponsorship-radar.png",
    alt: "Flow X influencer sponsorship radar scanning KOL activity, exchange campaigns and promo signals across crypto",
    ready: true,
  },
  campaignNetwork: {
    src: "/images/campaign-network-map.png",
    alt: "Flow X crypto campaign distribution network spreading reach across influencers, communities and partner channels",
    ready: false,
  },
  dealPipeline: {
    src: "/images/sponsorship-deal-pipeline.png",
    alt: "Flow X sponsorship deal pipeline from scout through live campaign to performance and renewal",
    ready: false,
  },
} as const satisfies Record<string, FlowXImageAsset>;
