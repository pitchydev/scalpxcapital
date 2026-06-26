import { PopIn, SlideIn } from "@/components/ScrollAnim";
import { siteCopy } from "@/lib/content";

export function EducationSection() {
  const { eyebrow, title, body, topics } = siteCopy.education;

  return (
    <section id="education" className="cv-auto mm-section scroll-mt-24 bg-flow-black">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SlideIn className="mx-auto max-w-3xl text-center">
          <p className="mm-eyebrow mb-4">{eyebrow}</p>
          <h2 className="mm-section-title">{title}</h2>
          <p className="mt-6 text-lg text-flow-muted">{body}</p>
        </SlideIn>

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {topics.map((topic, i) => (
            <PopIn
              key={topic}
              delay={i * 55}
              className="rounded-full border border-flow-green/20 bg-flow-green/5 px-4 py-2.5 text-sm text-flow-white/90 transition-colors duration-300 hover:border-flow-green/50 hover:bg-flow-green/10"
            >
              {topic}
            </PopIn>
          ))}
        </div>
      </div>
    </section>
  );
}
