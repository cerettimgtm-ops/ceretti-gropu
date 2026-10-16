import { ConsultPopup } from "@/components/consult-popup";
import { Navbar } from "@/components/header";
import { ContentBannerSection } from "@/components/sections/content-banner-section";
import { CTA } from "@/components/sections/cta-section";
import { FAQ } from "@/components/sections/faq";
import { Footer } from "@/components/sections/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { Pricing } from "@/components/sections/pricing-section";
import { ProcessSection } from "@/components/sections/process-section";
import { PromoBannerSection } from "@/components/sections/promo-banner-section";
import { ServiceSection } from "@/components/sections/services-section";
import { WorkSection } from "@/components/sections/work-section";
import { StickyPlansCta } from "@/components/sticky-plans-cta";

export default function Home() {
  return (
    <div className="space-y-10">
      <Navbar />
      <HeroSection />
      <ServiceSection />
      <WorkSection />
      <ProcessSection />
      <PromoBannerSection />
      <FAQ />
      <ContentBannerSection />
      <Pricing />
      <CTA />
      <Footer />
      <StickyPlansCta />
      <ConsultPopup />
    </div>
  );
}
