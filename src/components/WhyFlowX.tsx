import { Check, X } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const OLD = [
  "Random KOL spreadsheets",
  "Manual outreach with no data",
  "Zero sponsor visibility",
  "No way to prove ROI",
  "Campaigns launched blind",
  "Competitors ignored until too late",
  "Five tools, no single picture",
];

const NEW = [
  "Data-backed creator selection",
  "Live sponsor intelligence",
  "Structured campaign planning",
  "End-to-end performance tracking",
  "Competitor monitoring built in",
  "Deal flow you can actually see",
  "One growth system for Web3",
];

export function WhyFlowX() {
  return (
    <section className="border-b border-flow-border py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="section-label">Why ScalpX</p>
          <h2 className="font-display mt-4 text-3xl tracking-tight sm:text-4xl lg:text-5xl">
            Posting more isn&apos;t a strategy.
          </h2>
          <p className="mt-6 text-lg text-flow-muted">
            Winning in crypto means knowing where attention is moving, who controls it, who&apos;s
            paying for it, and getting there before the narrative shifts.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal delay={80}>
            <div className="rounded-2xl border border-flow-border bg-flow-black/40 p-6 lg:p-8">
              <h3 className="font-display text-lg text-flow-muted">Without ScalpX</h3>
              <ul className="mt-6 space-y-3">
                {OLD.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-flow-muted">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-flow-red/70" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="rounded-2xl border border-flow-green/25 bg-flow-green/5 p-6 lg:p-8">
              <h3 className="font-display text-lg text-flow-green">With ScalpX</h3>
              <ul className="mt-6 space-y-3">
                {NEW.map((item) => (
                  <li key={item} className="flex gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-flow-green" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
