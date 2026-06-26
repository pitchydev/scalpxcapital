import { FlowXVideoVisual } from "@/components/FlowXVideoVisual";
import { flowXImages } from "@/lib/images";
import { flowXMedia } from "@/lib/media";
import { Reveal } from "@/components/Reveal";

export function InfluencerIntelligence() {
  return (
    <section id="influencer-intelligence" className="mm-section scroll-mt-24 bg-flow-black">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="mm-eyebrow mb-5">Influencer intelligence</p>
            <h2 className="mm-section-title">
              Find the KOLs{" "}
              <span className="text-gradient-flow">worth paying.</span>
            </h2>
            <p className="mt-6 max-w-md text-lg text-flow-muted">
              Who&apos;s active, who&apos;s sponsored, and whether their audience actually engages.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <FlowXVideoVisual
              src={flowXMedia.sponsorshipRadarVideo.src}
              poster={flowXMedia.sponsorshipRadarVideo.poster}
              label={flowXImages.sponsorshipRadar.alt}
              fallback={<div className="aspect-video w-full bg-flow-graphite" />}
              aspect="video"
              fit="contain"
              glow
              className="w-full"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
