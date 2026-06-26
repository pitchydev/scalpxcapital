import { HeroBackground } from "@/components/HeroBackground";

export function HeroSection() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden px-5 pt-20 text-center">
      <HeroBackground />

      <div className="hero-content-rise relative z-10 flex min-h-[calc(100svh-5rem)] flex-col justify-end pb-[calc(2.75rem+env(safe-area-inset-bottom))] lg:pb-14">
        <h1 className="font-display mx-auto mb-5 max-w-4xl text-[2rem] font-bold leading-[1.05] tracking-tight sm:mb-6 sm:text-5xl lg:mb-8 lg:text-[3.75rem]">
          Your home in <span className="text-gradient-flow">crypto growth.</span>
        </h1>

        <div
          className="pointer-events-none mx-auto flex flex-col items-center gap-2"
          aria-hidden="true"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-flow-white/40">Scroll</span>
          <div className="scroll-pulse h-10 w-px bg-gradient-to-b from-flow-green to-transparent sm:h-12" />
        </div>
      </div>
    </section>
  );
}
