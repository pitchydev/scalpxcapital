import { FlowXImageVisual } from "@/components/FlowXImageVisual";
import { ClipReveal, SlideIn, StatNumber } from "@/components/ScrollAnim";
import { siteCopy } from "@/lib/content";
import { scalpXImages } from "@/lib/media";

export function StatsSection() {
  const { eyebrow, title, body, items } = siteCopy.stats;

  return (
    <section id="community" className="cv-auto mm-surface-light mm-section scroll-mt-24 border-y border-black/5">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <SlideIn from="left">
            <p className="mm-eyebrow-dark mb-4">{eyebrow}</p>
            <h2 className="mm-section-title-dark">{title}</h2>
            <p className="mt-4 max-w-md text-flow-black/60">{body}</p>

            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8">
              {items.map((s) => (
                <div key={s.label}>
                  <StatNumber
                    value={s.value}
                    className="block font-display text-2xl font-bold tracking-tight text-flow-black sm:text-3xl lg:text-4xl"
                  />
                  <p className="mt-2 text-sm text-flow-black/55">{s.label}</p>
                </div>
              ))}
            </div>
          </SlideIn>

          <ClipReveal delay={120} className="rounded-[2rem] bg-flow-black p-2 shadow-2xl">
            <FlowXImageVisual
              src={scalpXImages.showcase.src}
              mobileSrc={scalpXImages.showcase.mobileSrc}
              alt={scalpXImages.showcase.alt}
              objectPosition={scalpXImages.showcase.objectPosition}
              mobileObjectPosition={scalpXImages.showcase.mobileObjectPosition}
              className="w-full rounded-[1.75rem]"
            />
          </ClipReveal>
        </div>
      </div>
    </section>
  );
}
