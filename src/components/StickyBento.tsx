"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BarChart3, Crosshair, Megaphone, Radar } from "lucide-react";
import { FlowXImageVisual } from "@/components/FlowXImageVisual";
import { FlowXVideoVisual } from "@/components/FlowXVideoVisual";
import { useScrollProgress } from "@/hooks/useScrollProgress";

const STEPS = [
  {
    icon: Crosshair,
    visual: "video",
    eyebrow: "Scout",
    title: "Find the creators worth paying.",
    copy: "Surface KOLs by audience quality, sponsor history, platform fit and current momentum.",
    bullets: ["KOL discovery", "Audience quality", "Rate benchmarking"],
    src: "/videos/generated/flowx-scout.mp4",
    image: "/images/flowx-kol-radar-generated.png",
    aspect: "video" as const,
    fit: "contain" as const,
  },
  {
    icon: Radar,
    visual: "video",
    eyebrow: "Monitor",
    title: "See where sponsor money is moving.",
    copy: "Track exchange, protocol and project campaigns before the same plays hit your feed.",
    bullets: ["Sponsor detection", "Competitor moves", "Narrative shifts"],
    src: "/videos/generated/flowx-monitor.mp4",
    image: "/images/flowx-sponsor-money-map.png",
    aspect: "video" as const,
    fit: "contain" as const,
  },
  {
    icon: Megaphone,
    visual: "video",
    eyebrow: "Activate",
    title: "Turn signal into distribution.",
    copy: "Build creator lists, campaign angles and launch plans around what the market is already reacting to.",
    bullets: ["KOL activation", "Launch campaigns", "Community pushes"],
    src: "/videos/generated/flowx-activate.mp4",
    image: "/images/flowx-campaign-activation.png",
    aspect: "wide" as const,
    fit: "cover" as const,
  },
  {
    icon: BarChart3,
    visual: "video",
    eyebrow: "Track",
    title: "Know what actually worked.",
    copy: "Follow reach, engagement, conversions and sponsor ROI so the next campaign is sharper than the last.",
    bullets: ["Campaign ROI", "Creator value", "Next best move"],
    src: "/videos/generated/flowx-track.mp4",
    image: "/images/flowx-roi-dashboard.png",
    aspect: "video" as const,
    fit: "contain" as const,
  },
];

function CampaignNetworkPanel() {
  const channels = ["X", "YT", "TG", "DC", "CEX", "DEX", "KOL", "DAO"];

  return (
    <div className="electric-frame relative aspect-video overflow-hidden rounded-2xl border border-flow-green/20 bg-flow-black p-4 shadow-[0_0_80px_rgba(114,205,104,0.12)] sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(114,205,104,0.18),transparent_42%)]" />
      <div className="absolute inset-0 bg-flow-grid opacity-20" />
      <div className="relative flex h-full items-center justify-center">
        <div className="campaign-core relative flex h-16 w-16 items-center justify-center rounded-full border border-flow-green/40 bg-flow-green/10 sm:h-24 sm:w-24">
          <span className="font-display text-[10px] font-bold text-flow-green sm:text-sm">SCALPX</span>
        </div>

        {channels.map((channel, index) => {
          const angle = (index / channels.length) * Math.PI * 2;
          const x = 50 + Math.cos(angle) * 38;
          const y = 50 + Math.sin(angle) * 34;

          return (
            <div
              key={channel}
              className="campaign-node absolute flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[10px] font-semibold text-flow-white backdrop-blur sm:h-12 sm:w-12 sm:rounded-2xl sm:text-xs"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
                animationDelay: `${index * 0.15}s`,
              }}
            >
              {channel}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RoiDashboardPanel() {
  const bars = [58, 82, 46, 92, 74, 88, 64, 96];

  return (
    <div className="electric-frame relative aspect-video overflow-hidden rounded-2xl border border-flow-green/20 bg-flow-black p-4 shadow-[0_0_80px_rgba(114,205,104,0.12)] sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(114,205,104,0.16),transparent_35%)]" />
      <div className="relative grid h-full grid-rows-[auto_1fr_auto] gap-3 sm:gap-5">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-flow-green">Campaign ROI</p>
          <span className="rounded-full bg-flow-green px-3 py-1 text-xs font-bold text-black">LIVE</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            ["Reach", "2.4M"],
            ["Sponsor ROI", "3.2x"],
            ["Mentions", "+68%"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 sm:rounded-2xl sm:p-4">
              <p className="text-[8px] uppercase tracking-wider text-flow-muted sm:text-[10px]">{label}</p>
              <p className="mt-1 font-display text-lg font-bold text-flow-white sm:mt-2 sm:text-2xl">{value}</p>
            </div>
          ))}
        </div>

        <div className="flex h-16 items-end gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:h-28 sm:gap-2 sm:rounded-2xl sm:p-4">
          {bars.map((height, index) => (
            <div
              key={index}
              className="roi-bar flex-1 rounded-t bg-gradient-to-t from-flow-green/30 to-flow-green"
              style={{ height: `${height}%`, animationDelay: `${index * 0.08}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StepVisual({ step }: { step: (typeof STEPS)[number] }) {
  if (step.visual === "video") {
    return (
      <FlowXVideoVisual
        src={step.src}
        poster={step.image}
        label={step.title}
        fallback={
          <FlowXImageVisual
            src={step.image}
            alt={step.title}
            aspect={step.aspect === "wide" ? "wide" : "video"}
          />
        }
        aspect={step.aspect}
        fit={step.fit}
        glow
        className="mx-auto w-full max-w-2xl"
      />
    );
  }

  if (step.visual === "image") {
    return (
      <FlowXImageVisual
        src={step.image}
        alt={step.title}
        aspect={step.aspect === "wide" ? "wide" : "video"}
        className="mx-auto w-full max-w-2xl"
      />
    );
  }
  if (step.visual === "campaign") return <CampaignNetworkPanel />;
  if (step.visual === "roi") return <RoiDashboardPanel />;
  return null;
}

export function StickyBento() {
  const ref = useRef<HTMLElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const progress = useScrollProgress(ref);
  const active = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length));
  const item = STEPS[active];

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);

    update();
    mq.addEventListener("change", update);

    return () => mq.removeEventListener("change", update);
  }, []);

  const localProgress = useMemo(() => {
    const raw = progress * STEPS.length - active;
    return Math.min(1, Math.max(0, raw));
  }, [active, progress]);

  return (
    <section id="platform" ref={ref} className="relative h-[340svh] bg-flow-black lg:h-[380vh]">
      {!isDesktop && (
      <div className="sticky top-0 min-h-[100svh] overflow-hidden">
        <div className="electric-ambient absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="bg-flow-grid absolute inset-0 opacity-10" aria-hidden="true" />

        <div className="relative flex min-h-[100svh] flex-col px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-20">
          <div className="min-h-[18rem]">
            <p className="mm-eyebrow mb-5">The ScalpX loop</p>
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === active;

              return (
                <div
                  key={step.title}
                  className="absolute left-4 right-4 top-28 transition-all duration-500"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: `translateY(${isActive ? 0 : 22}px)`,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-flow-green/10">
                    <Icon className="h-6 w-6 text-flow-green" strokeWidth={1.75} />
                  </div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-flow-green">
                    0{index + 1} · {step.eyebrow}
                  </p>
                  <h2 className="mt-3 font-display text-[2rem] font-bold leading-[1.04] tracking-tight">
                    {step.title}
                  </h2>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-flow-muted">{step.copy}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-auto">
            <div className="mb-5 grid gap-2">
              {STEPS.map((step, index) => (
                <div key={step.eyebrow} className="flex items-center gap-3">
                  <span className={`w-5 font-mono text-[10px] ${index === active ? "text-flow-green" : "text-flow-muted"}`}>
                    0{index + 1}
                  </span>
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-flow-green transition-all duration-200"
                      style={{
                        width:
                          index < active
                            ? "100%"
                            : index === active
                              ? `${Math.max(12, localProgress * 100)}%`
                              : "0%",
                      }}
                    />
                  </div>
                  <span className={`w-16 text-right text-[10px] uppercase tracking-wider ${index === active ? "text-flow-white" : "text-flow-muted"}`}>
                    {step.eyebrow}
                  </span>
                </div>
              ))}
            </div>

            <div className="relative transition-all duration-500" style={{ transform: `scale(${0.98 + localProgress * 0.02})` }}>
              <StepVisual key={item.title} step={item} />
            </div>
          </div>
        </div>
      </div>
      )}

      {isDesktop && (
      <div className="sticky top-0 min-h-screen overflow-hidden">
        <div className="electric-ambient absolute inset-0 opacity-80" aria-hidden="true" />
        <div className="bg-flow-grid absolute inset-0 opacity-15" aria-hidden="true" />

        <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-5 py-24 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
          <div>
            <p className="mm-eyebrow mb-5">The ScalpX loop</p>
            <div className="relative min-h-[340px]">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === active;

                return (
                  <div
                    key={step.title}
                    className="absolute inset-0 transition-all duration-500"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: `translateY(${isActive ? 0 : 28}px)`,
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                  >
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-flow-green/10">
                      <Icon className="h-7 w-7 text-flow-green" strokeWidth={1.75} />
                    </div>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-flow-green">
                      {step.eyebrow}
                    </p>
                    <h2 className="mm-section-title mt-4 max-w-xl">{step.title}</h2>
                    <p className="mt-6 max-w-lg text-lg text-flow-muted">{step.copy}</p>
                    <div className="mt-8 flex flex-wrap gap-2">
                      {step.bullets.map((bullet) => (
                        <span key={bullet} className="rounded-full border border-white/10 px-4 py-2 text-sm text-flow-white/80">
                          {bullet}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 grid gap-3">
              {STEPS.map((step, index) => (
                <div key={step.eyebrow} className="flex items-center gap-4">
                  <span className={`font-mono text-xs ${index === active ? "text-flow-green" : "text-flow-muted"}`}>
                    0{index + 1}
                  </span>
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-flow-green transition-all duration-200"
                      style={{
                        width:
                          index < active
                            ? "100%"
                            : index === active
                              ? `${Math.max(12, localProgress * 100)}%`
                              : "0%",
                      }}
                    />
                  </div>
                  <span className={`w-20 text-right text-xs uppercase tracking-wider ${index === active ? "text-flow-white" : "text-flow-muted"}`}>
                    {step.eyebrow}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 rounded-[3rem] bg-flow-green/10 blur-3xl" aria-hidden="true" />
            <div className="relative transition-all duration-500" style={{ transform: `scale(${0.98 + localProgress * 0.02})` }}>
              <StepVisual key={item.title} step={item} />
            </div>
          </div>
        </div>
      </div>
      )}
    </section>
  );
}
