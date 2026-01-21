import { Footer } from "@/components/layouts/Footer";
import { CTASection, FeatureSection, HeroSection } from "@/components/ui/landing";
import { Navigation } from "@/components/ui/navigation";

export default function Home() {
  return (
    <>
      <Navigation />
      <HeroSection />
      <FeatureSection />
      <CTASection />
      <Footer />
    </>
  );
}
