import { Reveal } from "@/components/Reveal";

const TRACK = [
  "Competitor KOL deals",
  "Campaign frequency & timing",
  "Sponsored post detection",
  "Exchange partnerships",
  "Narrative shifts",
  "Token mention spikes",
  "Community activity",
  "Launch windows",
  "Content themes",
  "Social performance",
];

const WALL_CARDS = [
  { project: "Rival A", signal: "3 new KOL deals" },
  { project: "Rival B", signal: "Listing campaign live" },
  { project: "Rival C", signal: "Narrative shift detected" },
  { project: "Rival D", signal: "Exchange sponsor added" },
];

export function CompetitorMonitoring() {
  return (
    <section className="border-b border-flow-border py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="section-label">Market monitoring</p>
            <h2 className="font-display mt-4 text-3xl tracking-tight sm:text-4xl lg:text-5xl">
              See rival moves before they trend.
            </h2>
            <p className="mt-6 text-flow-muted">
              Public campaign signals across Web3: who rivals are hiring, what they&apos;re
              launching, and where their attention is coming from.
            </p>
            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              {TRACK.map((t) => (
                <li key={t} className="text-sm text-flow-muted">· {t}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={100}>
            <div className="glass-panel rounded-2xl p-5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-flow-red">
                Intelligence wall · LIVE
              </p>
              <div className="mt-4 space-y-3">
                {WALL_CARDS.map((c) => (
                  <div key={c.project} className="flex items-center justify-between rounded-lg border border-flow-border bg-flow-black/50 px-4 py-3">
                    <span className="text-sm font-medium">{c.project}</span>
                    <span className="text-xs text-flow-green">{c.signal}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[65, 82, 48, 91, 55, 73].map((h, i) => (
                  <div key={i} className="flex h-12 items-end rounded bg-flow-black/40 p-1">
                    <div className="w-full rounded-sm bg-flow-green/40" style={{ height: `${h}%` }} />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
