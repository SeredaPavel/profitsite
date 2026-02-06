// src/app/page.tsx
import HeroSection from "../components/landing/HeroSection";
import WhyItWorksSection from "../components/landing/WhyItWorksSection";
import AudienceSection from "../components/landing/AudienceSection";
import ProofSection from "../components/landing/ProofSection";
import ResultSection from "../components/landing/ResultSection";
import PricingSection from "../components/landing/PricingSection";
import NextStepSection from "../components/landing/NextStepSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection />
      <WhyItWorksSection />
      <AudienceSection />
      <ProofSection />
      <ResultSection />
      <PricingSection />
      <NextStepSection />
    </main>
  );
}
