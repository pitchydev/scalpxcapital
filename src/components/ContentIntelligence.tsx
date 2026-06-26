import { Reveal } from "@/components/Reveal";

const OUTPUTS = [
  "Viral post formats",
  "X thread angles",
  "YouTube hooks",
  "Telegram campaign copy",
  "Founder post drafts",
  "Launch narratives",
  "Meme & cultural angles",
  "Partner announcements",
  "Community prompts",
  "KOL briefs",
];

export function ContentIntelligence() {
  return (
    <section className="border-b border-flow-border bg-flow-graphite py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal delay={80} className="order-2 lg:order-1">
            <div className="relative rounded-2xl border border-flow-border bg-flow-black/50 p-6">
              <div className="flex flex-wrap gap-2">
                {["Viral X post", "YT hook", "TG push", "Launch thread"].map((tag) => (
                  <span key={tag} className="rounded-lg border border-flow-green/20 bg-flow-green/5 px-3 py-2 text-xs text-flow-green">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="my-6 flex justify-center">
                <div className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-flow-green/50 to-transparent" />
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {["Campaign brief", "KOL script", "Narrative doc", "Partner post"].map((out) => (
                  <div key={out} className="glass-panel rounded-lg p-3 text-center text-xs text-flow-muted">
                    {out}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal className="order-1 lg:order-2">
            <p className="section-label">Content intelligence</p>
            <h2 className="font-display mt-4 text-3xl tracking-tight sm:text-4xl lg:text-5xl">
              Create what the market already wants.
            </h2>
            <p className="mt-6 text-flow-muted">
              Trending narratives, viral formats and high-performing creator angles, surfaced
              so your team writes content that lands, not content that gets ignored.
            </p>
            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              {OUTPUTS.map((o) => (
                <li key={o} className="text-sm text-flow-muted">· {o}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
