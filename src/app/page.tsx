import { CryptoHero } from "@/components/crypto-hero/CryptoHero";
import { MaskedStatement } from "@/components/MaskedStatement";
import { SplitSection } from "@/components/SplitSection";
import { StickyFlow } from "@/components/StickyFlow";
import { StatsSection } from "@/components/StatsSection";
import { WhyScalpX } from "@/components/WhyScalpX";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { EducationSection } from "@/components/EducationSection";
import { FinalCta } from "@/components/FinalCta";

export default function HomePage() {
  return (
    <>
      <CryptoHero />
      <MaskedStatement />
      <SplitSection />
      <StickyFlow />
      <StatsSection />
      <WhyScalpX />
      <TestimonialsSection />
      <EducationSection />
      <FinalCta />
    </>
  );
}
