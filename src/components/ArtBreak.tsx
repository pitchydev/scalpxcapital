import { FlowXVideoVisual } from "@/components/FlowXVideoVisual";
import { flowXMedia } from "@/lib/media";

export function ArtBreak() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-flow-black px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(114,205,104,0.12),transparent_58%)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center">
        <FlowXVideoVisual
          src={flowXMedia.heroVideo.src}
          poster={flowXMedia.heroVideo.poster}
          label="FlowX growth engine cinematic"
          fallback={<div className="h-[80vh] w-full rounded-[2rem] bg-flow-graphite" />}
          aspect="wide"
          fit="cover"
          glow
          className="w-full"
        />
      </div>
    </section>
  );
}
