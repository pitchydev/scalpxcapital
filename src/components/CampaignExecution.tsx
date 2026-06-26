import { FlowXVisual } from "@/components/FlowXVisual";
import { flowXImages } from "@/lib/images";
import { Reveal } from "@/components/Reveal";

const CAMPAIGN_TYPES = [
  "Token launches",
  "Exchange listings",
  "KOL awareness",
  "Community growth",
  "Trading competitions",
  "Product launches",
  "Narrative pushes",
  "Sponsored content",
  "Ambassador programmes",
  "Affiliate campaigns",
];

const CHANNELS = ["X", "YouTube", "Telegram", "Discord", "CEX", "DEX", "Communities", "Partners"];

function CampaignNetworkFallback() {
  return (
    <div className="relative mx-auto max-w-3xl rounded-2xl border border-flow-border bg-flow-graphite/50 p-8 lg:p-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl border border-flow-green/30 bg-flow-green/10">
        <span className="font-display font-bold text-flow-green">PROJECT</span>
      </div>
      <div className="mt-8 grid grid-cols-4 gap-3">
        {CHANNELS.map((ch, i) => (
          <div key={ch} className="relative text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-flow-border bg-flow-black text-[10px] font-bold text-flow-muted">
              {ch}
            </div>
            <div
              className="absolute left-1/2 top-0 h-8 w-px -translate-x-1/2 -translate-y-full bg-gradient-to-t from-flow-green/40 to-transparent"
              style={{ opacity: 0.4 + (i % 3) * 0.2 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CampaignExecution() {
  return (
    <section id="campaigns" className="scroll-mt-24 border-b border-flow-border py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="section-label">Campaigns</p>
          <h2 className="font-display mt-4 text-3xl tracking-tight sm:text-4xl lg:text-5xl">
            Turn insight into distribution.
          </h2>
          <p className="mt-6 text-lg text-flow-muted">
            We don&apos;t stop at research. ScalpX activates: listings, launches, partnerships,
            token pushes and community growth with the channels and creators already in motion.
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-14">
          <FlowXVisual
            asset={flowXImages.campaignNetwork}
            fallback={<CampaignNetworkFallback />}
            aspect="wide"
            className="mx-auto w-full max-w-4xl"
          />
        </Reveal>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {CAMPAIGN_TYPES.map((t, i) => (
            <Reveal key={t} delay={i * 30}>
              <span className="rounded-full border border-flow-border bg-flow-graphite px-3 py-1.5 text-xs text-flow-muted">
                {t}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
