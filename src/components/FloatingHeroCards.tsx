const CARDS = [
  { title: "KOL detected", value: "@CryptoEdge", className: "left-[5%] top-[18%]" },
  { title: "Sponsor match", value: "CEX x creator", className: "right-[4%] top-[22%]" },
  { title: "Campaign pulse", value: "+42% reach", className: "bottom-[24%] left-[8%]" },
  { title: "ROI signal", value: "3.2x", className: "bottom-[20%] right-[10%]" },
];

export function FloatingHeroCards() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] hidden overflow-hidden lg:block" aria-hidden="true">
      {CARDS.map((card, index) => (
        <div
          key={card.title}
          className={`hero-float-card absolute w-48 rounded-3xl border border-white/10 bg-black/35 p-4 shadow-2xl backdrop-blur-md ${card.className}`}
          style={{ animationDelay: `${index * 0.6}s` }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-flow-green">
            {card.title}
          </p>
          <p className="mt-2 font-display text-xl font-semibold text-white">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
