/**
 * Preview / dummy links for sharing WIP builds.
 * Swap these for live URLs before launch.
 */
export const previewLinks = {
  /** Set false when going live and point CTAs at real destinations */
  isPreview: true,

  /** Share these while reviewing the build */
  share: {
    local: "http://localhost:3010",
    network: "http://192.168.1.167:3010",
  },

  /** Primary CTAs - scroll anchors keep reviewers on the preview site */
  joinCommunity: "#join",
  explorePlatform: "#platform",
  viewCommunity: "#community",
  viewEducation: "#education",
  viewTestimonials: "#testimonials",

  /** External destinations */
  discord: "https://discord.com/invite/scalp-x",
  discordInvite: "https://discord.com/invite/scalp-x",
  twitter: "https://x.com/scalpx",
  telegram: "https://t.me/scalpx",
  docs: "https://docs.scalpx.trade",
  app: "https://app.scalpx.trade",
  contact: "mailto:hello@scalpx.trade?subject=ScalpX%20Preview",
} as const;

export type PreviewLinkKey = keyof typeof previewLinks;
