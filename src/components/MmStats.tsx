import { FlowXImageVisual } from "@/components/FlowXImageVisual";
import { Reveal } from "@/components/Reveal";

const STATS = [
  { value: "100+", label: "Networks tracked" },
  { value: "24/7", label: "Sponsor monitoring" },
  { value: "Scout → Track", label: "Full growth loop" },
];

export function MmStats() {
  return (
    <section className="mm-surface-light mm-section border-y border-black/5">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="mm-eyebrow-dark mb-4">Built for Web3 teams</p>
            <h2 className="mm-section-title-dark">Market intelligence. Always on.</h2>
            <p className="mt-4 max-w-md text-flow-black/60">
              From KOL discovery to campaign ROI, one system for exchanges, projects and creators.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-3xl font-bold tracking-tight text-flow-black sm:text-4xl">
                    {s.value}
                  </p>
                  <p className="mt-2 text-sm text-flow-black/55">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-[2rem] bg-flow-black p-2 shadow-2xl">
              <FlowXImageVisual
                src="/images/flowx-market-monitoring.png"
                alt="FlowX market monitoring intelligence wall"
                className="w-full"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
