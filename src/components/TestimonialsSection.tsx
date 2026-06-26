import { Quote } from "lucide-react";
import { SlideIn } from "@/components/ScrollAnim";
import { siteCopy } from "@/lib/content";

export function TestimonialsSection() {
  const { eyebrow, title, items, cta } = siteCopy.testimonials;
  const loop = [...items, ...items];

  return (
    <section id="testimonials" className="cv-auto mm-surface-light mm-section scroll-mt-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SlideIn className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mm-eyebrow-dark mb-4">{eyebrow}</p>
          <h2 className="mm-section-title-dark">{title}</h2>
        </SlideIn>
      </div>

      <div className="marquee-mask overflow-hidden py-2">
        <div className="marquee-cards flex w-max gap-5 px-5">
          {loop.map((item, i) => (
            <figure
              key={i}
              aria-hidden={i >= items.length}
              className="mm-card-light flex w-[290px] shrink-0 flex-col p-6 sm:w-[360px] lg:p-8"
            >
              <Quote className="mb-4 h-5 w-5 text-flow-green-dim" />
              <blockquote className="flex-1 text-base leading-relaxed text-flow-black/80">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-xs uppercase tracking-wider text-flow-black/45">
                {item.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SlideIn delay={120} className="mt-12 text-center">
          <a href="#join" className="text-sm font-semibold text-flow-green-dim underline-offset-4 hover:underline">
            {cta}
          </a>
        </SlideIn>
      </div>
    </section>
  );
}
