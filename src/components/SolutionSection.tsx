import { Crosshair, Rocket, BarChart3 } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const PILLARS = [
  {
    icon: Crosshair,
    title: "Scout",
    description: "Find the creators and sponsors that matter.",
  },
  {
    icon: Rocket,
    title: "Execute",
    description: "Launch campaigns with a plan behind them.",
  },
  {
    icon: BarChart3,
    title: "Track",
    description: "Measure ROI. Repeat what works.",
  },
];

export function SolutionSection() {
  return (
    <section id="platform" className="mm-surface-light mm-section scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mm-eyebrow-dark mb-4">The platform</p>
          <h2 className="mm-section-title-dark">
            Influence, spend and momentum, mapped.
          </h2>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 70}>
              <div className="mm-card-light h-full p-8 text-center lg:p-10">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-flow-green/15">
                  <p.icon className="h-7 w-7 text-flow-green-dim" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-2xl font-semibold text-flow-black">{p.title}</h3>
                <p className="mt-3 text-flow-black/60">{p.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
