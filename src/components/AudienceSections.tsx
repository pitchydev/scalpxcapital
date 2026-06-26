import Link from "next/link";
import { Reveal } from "@/components/Reveal";

const SECTIONS = [
  {
    id: "for-exchanges",
    label: "For exchanges",
    title: "Better creators. Smarter spend. Clearer ROI.",
    copy: "Identify the KOLs, communities and partners worth sponsoring. Track what competitors are doing. Know your promo codes are working before the quarter ends.",
    benefits: [
      "Crypto-native creator sourcing",
      "Competitor sponsorship tracking",
      "Regional KOL campaign builds",
      "Promo code performance monitoring",
      "Trading campaign reach analysis",
      "Partnership pipeline development",
      "Pre-spend creator valuation",
    ],
    cta: "Talk to us",
  },
  {
    id: "for-projects",
    label: "For projects",
    title: "Launch with signal, not noise.",
    copy: "Build visibility through the right influencers, community activation and exchange partnerships, with a content strategy backed by what's actually trending.",
    benefits: [
      "Relevant KOL matching",
      "Launch campaign architecture",
      "Narrative momentum tracking",
      "Competitor move monitoring",
      "Campaign ROI reporting",
      "Partner network development",
      "Community growth activation",
    ],
    cta: "Talk to us",
  },
  {
    id: "for-creators",
    label: "For creators",
    title: "Better deals. Better briefs. Better fit.",
    copy: "Get matched with sponsors that align with your audience. Structured campaigns, clear briefs and proof of performance that opens doors to long-term partnerships.",
    benefits: [
      "Sponsor-brand matching",
      "Professional campaign briefs",
      "Active deal pipeline",
      "Performance reporting for brands",
      "Long-term partnership access",
    ],
    cta: "Talk to us",
  },
];

export function AudienceSections() {
  return (
    <>
      {SECTIONS.map((s, idx) => (
        <section
          key={s.id}
          id={s.id}
          className={`scroll-mt-24 border-b border-flow-border py-24 lg:py-32 ${idx % 2 === 1 ? "bg-flow-graphite" : ""}`}
        >
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className={`grid items-start gap-12 lg:grid-cols-2 ${idx % 2 === 1 ? "" : ""}`}>
              <Reveal>
                <p className="section-label">{s.label}</p>
                <h2 className="font-display mt-4 text-3xl tracking-tight sm:text-4xl">{s.title}</h2>
                <p className="mt-6 text-flow-muted">{s.copy}</p>
                <Link href="#contact" className="btn-secondary mt-8 inline-flex">{s.cta}</Link>
              </Reveal>
              <Reveal delay={100}>
                <ul className="glass-panel space-y-3 rounded-2xl p-6">
                  {s.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-flow-muted">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-flow-green" />
                      {b}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
