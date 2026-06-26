import { BookOpen, Bot, LineChart, MessageCircle, Trophy, Users } from "lucide-react";
import { SlideIn, TiltCard } from "@/components/ScrollAnim";
import { siteCopy } from "@/lib/content";

const ICONS = [LineChart, Users, BookOpen, MessageCircle, Trophy, Bot];

export function WhyScalpX() {
  const { eyebrow, title, items } = siteCopy.different;

  return (
    <section className="cv-auto mm-section border-t border-flow-border bg-flow-black">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SlideIn className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mm-eyebrow mb-4">{eyebrow}</p>
          <h2 className="mm-section-title">{title}</h2>
        </SlideIn>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <TiltCard key={item.title} delay={(i % 3) * 90} className="h-full">
                <div className="mm-card group h-full p-8 transition-transform duration-300 hover:-translate-y-1.5">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-flow-green/10 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6 text-flow-green" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-display text-xl font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-3 text-flow-muted">{item.desc}</p>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
