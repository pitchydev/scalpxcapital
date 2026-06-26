import { FlowXImageVisual } from "@/components/FlowXImageVisual";
import { Reveal } from "@/components/Reveal";

export function ProblemSection() {
  return (
    <section className="mm-section overflow-hidden bg-flow-black">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <Reveal className="order-2 lg:order-1">
          <FlowXImageVisual
            src="/images/flowx-command-center.png"
            alt="FlowX command center mapping KOLs, sponsors, campaigns, exchanges and communities"
            className="mx-auto w-full max-w-xl"
          />
        </Reveal>

        <Reveal delay={80} className="order-1 lg:order-2">
          <p className="mm-eyebrow mb-5">The problem</p>
          <h2 className="mm-section-title">
            Most teams buy attention{" "}
            <span className="text-flow-green">blind.</span>
          </h2>
          <p className="mt-6 max-w-md text-lg text-flow-muted">
            KOL spend, listings, campaigns: budgets go out every week. Few teams know what
            actually moved the needle.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
