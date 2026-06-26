import { FlowXImageVisual } from "@/components/FlowXImageVisual";
import { ClipReveal, SlideIn } from "@/components/ScrollAnim";
import { siteCopy } from "@/lib/content";
import { scalpXImages } from "@/lib/media";

export function SplitSection() {
  const { eyebrow, title, titleAccent, body } = siteCopy.split;

  return (
    <section className="cv-auto mm-section overflow-hidden bg-flow-black">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <ClipReveal className="order-2 lg:order-1">
          <FlowXImageVisual
            src={scalpXImages.lounge.src}
            mobileSrc={scalpXImages.lounge.mobileSrc}
            alt={scalpXImages.lounge.alt}
            objectPosition={scalpXImages.lounge.objectPosition}
            mobileObjectPosition={scalpXImages.lounge.mobileObjectPosition}
            className="mx-auto w-full max-w-xl"
          />
        </ClipReveal>

        <div className="order-1 lg:order-2">
          <SlideIn from="right">
            <p className="mm-eyebrow mb-5">{eyebrow}</p>
          </SlideIn>
          <SlideIn from="right" delay={90}>
            <h2 className="mm-section-title">
              {title}{" "}
              <span className="text-flow-green">{titleAccent}</span>
            </h2>
          </SlideIn>
          <SlideIn from="right" delay={180}>
            <p className="mt-6 max-w-md text-lg text-flow-muted">{body}</p>
          </SlideIn>
        </div>
      </div>
    </section>
  );
}
