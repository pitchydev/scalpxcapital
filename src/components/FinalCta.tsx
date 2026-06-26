import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SlideIn } from "@/components/ScrollAnim";
import { siteCopy } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export function FinalCta() {
  const { title, body, primaryCta, secondaryCta } = siteCopy.finalCta;

  return (
    <section id="join" className="cv-auto mm-surface-light mm-section relative scroll-mt-24 overflow-hidden border-t border-black/5">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[620px] max-w-[120vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-flow-green/15 blur-[120px]"
        style={{ animation: "beam-pulse 5s ease-in-out infinite" }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-3xl px-5 text-center lg:px-8">
        <SlideIn>
          <h2 className="mm-section-title-dark">{title}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-flow-black/60">{body}</p>
        </SlideIn>

        <SlideIn delay={120}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={siteConfig.discordInvite}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-mm group"
            >
              {primaryCta}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href={siteConfig.discordInvite}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-mm-ghost !border-black/15 !text-flow-black hover:!border-flow-green-dim hover:!bg-flow-green/10"
            >
              {secondaryCta}
            </Link>
          </div>
        </SlideIn>
      </div>
    </section>
  );
}
