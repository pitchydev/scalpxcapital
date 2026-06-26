import {
  Eye,
  Link2,
  Lightbulb,
  Megaphone,
  Handshake,
  LineChart,
  Radar,
  Sparkles,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";

const SERVICES = [
  { icon: Eye, title: "Influencer Discovery", desc: "Surface high-value KOLs across X, YouTube, Telegram, Discord and beyond." },
  { icon: Link2, title: "Sponsor Tracking", desc: "See who exchanges, DEXs and protocols are paying, and who they're paying." },
  { icon: Lightbulb, title: "Campaign Strategy", desc: "Build plans around audience, narrative, timing and budget, not guesswork." },
  { icon: Megaphone, title: "KOL Activation", desc: "Coordinate posts, threads, videos, spaces and community pushes at scale." },
  { icon: Handshake, title: "Deal Flow", desc: "Spot partnership opportunities between exchanges, projects and creators." },
  { icon: LineChart, title: "Performance Tracking", desc: "Track reach, engagement, conversions, sentiment and campaign ROI." },
  { icon: Radar, title: "Competitor Monitoring", desc: "Watch rival launches, sponsor moves and narrative shifts in real time." },
  { icon: Sparkles, title: "Content Intelligence", desc: "Identify what's going viral and turn it into sharper campaign angles." },
];

export function ServicesGrid() {
  return (
    <section id="what-we-do" className="scroll-mt-24 border-b border-flow-border bg-flow-graphite py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="section-label">What we do</p>
          <h2 className="font-display mt-4 text-3xl tracking-tight sm:text-4xl lg:text-5xl">
            Intelligence and distribution. One stack.
          </h2>
          <p className="mt-6 text-lg text-flow-muted">
            From finding the right KOLs to proving campaign ROI, everything crypto growth teams
            need, without the disconnected spreadsheets and blind spend.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 40}>
              <div className="glass-panel glass-panel-hover h-full rounded-2xl p-5 transition-all">
                <s.icon className="h-5 w-5 text-flow-green" />
                <h3 className="mt-4 font-display text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-flow-muted">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
