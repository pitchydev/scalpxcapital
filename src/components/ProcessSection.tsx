import { Reveal } from "@/components/Reveal";

const STEPS = [
  { n: "01", title: "Map the market", desc: "Scan creators, exchanges, projects, sponsors and live campaigns across crypto social." },
  { n: "02", title: "Find the gap", desc: "Identify who's relevant, who's spending, and where the opportunity sits." },
  { n: "03", title: "Build the plan", desc: "Strategy, creator list, campaign angles and execution timeline, locked in." },
  { n: "04", title: "Go live", desc: "Coordinate KOLs, communities, partners and content across every channel." },
  { n: "05", title: "Measure & iterate", desc: "Track performance and feed results straight into the next move." },
];

export function ProcessSection() {
  return (
    <section className="border-b border-flow-border bg-flow-graphite py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="section-label">Process</p>
          <h2 className="font-display mt-4 text-3xl tracking-tight sm:text-4xl lg:text-5xl">
            From signal to campaign in five steps.
          </h2>
        </Reveal>

        <div className="mt-14 space-y-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 60}>
              <div className="glass-panel flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:gap-8 lg:p-6">
                <span className="font-display text-3xl font-bold text-flow-green/40">{s.n}</span>
                <div>
                  <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-flow-muted">{s.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
