import type { Metadata } from "next";
import { CryptoHero } from "@/components/crypto-hero/CryptoHero";

export const metadata: Metadata = {
  title: "Crypto Hero",
  description: "Scroll-driven cinematic chrome-coin hero.",
};

export default function CryptoHeroPage() {
  return (
    <>
      <CryptoHero />

      {/* Spacer section so the page continues past the pinned hero. */}
      <section className="relative bg-[#05070d] px-6 py-32 text-center">
        <p className="mx-auto max-w-xl text-sm uppercase tracking-[0.3em] text-white/40">
          Next section
        </p>
        <h2 className="font-display mx-auto mt-4 max-w-2xl text-3xl font-bold text-white sm:text-4xl">
          The rest of your page lives here.
        </h2>
      </section>
    </>
  );
}
