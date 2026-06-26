import { Reveal } from "@/components/Reveal";

const METRICS = [
  "Reach",
  "Engagement",
  "Views",
  "Clicks",
  "Conversions",
  "Mentions",
  "Sentiment",
  "Community growth",
  "Trading activity",
  "Cost per result",
  "Influencer ROI",
  "Sponsor performance",
];

const CARDS = [
  { label: "Total Campaign Reach", value: "2.4M" },
  { label: "Best Performing KOL", value: "@CryptoEdge" },
  { label: "Sponsor ROI", value: "3.2x" },
  { label: "Mentions Growth", value: "+68%" },
  { label: "Community Growth", value: "+12.4K" },
  { label: "Top Narrative", value: "DeFi x AI" },
  { label: "Deal Pipeline Value", value: "$840K" },
];

export function ReportingSection() {
  return (
    <section className="border-b border-flow-border py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="section-label">Reporting & ROI</p>
          <h2 className="font-display mt-4 text-3xl tracking-tight sm:text-4xl lg:text-5xl">
            Proof beats promises.
          </h2>
          <p className="mt-6 text-lg text-flow-muted">
            Every campaign tracked end to end: what worked, what didn&apos;t, and where to
            put budget next quarter.
          </p>
        </Reveal>

        <Reveal delay={80} className="mt-14">
          <div className="dashboard-frame rounded-2xl border border-flow-border bg-flow-graphite/80 p-4 lg:p-6">
            <div className="flex items-center gap-2 border-b border-flow-border pb-3">
              <span className="pulse-dot h-2 w-2 rounded-full bg-flow-green" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-flow-muted">
                Campaign performance · Q2
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {CARDS.map((c) => (
                <div key={c.label} className="rounded-xl border border-flow-border bg-flow-black/50 p-4">
                  <p className="text-[10px] uppercase tracking-wider text-flow-muted">{c.label}</p>
                  <p className="mt-2 font-display text-xl font-bold text-flow-white">{c.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex h-20 items-end gap-1 rounded-xl border border-flow-border bg-flow-black/40 p-3">
              {[55, 72, 48, 88, 65, 92, 78, 85, 70, 95, 82, 90].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-gradient-to-t from-flow-green/30 to-flow-green"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {METRICS.map((m) => (
            <span key={m} className="rounded-full border border-flow-border px-3 py-1 text-xs text-flow-muted">
              {m}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
