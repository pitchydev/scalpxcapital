import { Eye, Radar, Megaphone, LineChart } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const CAPS = [
  {
    icon: Eye,
    title: "Influencer discovery",
    desc: "Find the KOLs that actually move crypto attention.",
  },
  {
    icon: Radar,
    title: "Sponsor tracking",
    desc: "See who exchanges and protocols are paying, and who.",
  },
  {
    icon: Megaphone,
    title: "Campaign execution",
    desc: "Launch across X, YouTube, Telegram and partner networks.",
  },
  {
    icon: LineChart,
    title: "Performance & ROI",
    desc: "Track reach, conversions and prove what worked.",
  },
];

export function MmCapabilities() {
  return (
    <section id="what-we-do" className="mm-section scroll-mt-24 border-t border-flow-border bg-flow-black">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mm-eyebrow mb-4">What ScalpX does</p>
          <h2 className="mm-section-title">Get more out of crypto marketing.</h2>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2">
          {CAPS.map((c, i) => (
            <Reveal key={c.title} delay={i * 60}>
              <div className="mm-card group h-full p-8 lg:p-10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-flow-green/10">
                  <c.icon className="h-6 w-6 text-flow-green" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{c.title}</h3>
                <p className="mt-3 text-flow-muted">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
