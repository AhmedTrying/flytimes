import { AnnounceTicker } from "@/components/AnnounceTicker";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/home/Hero";
import { PackagesStrip } from "@/components/home/PackagesStrip";
import { AboutSection } from "@/components/home/AboutSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { PackagesSection } from "@/components/home/PackagesSection";
import { WhySection } from "@/components/home/WhySection";
import { CtaSection } from "@/components/home/CtaSection";

export default function HomePage() {
  return (
    <>
      <AnnounceTicker />
      <Navbar />
      <main>
        <Hero />
        <PackagesStrip />
        <AboutSection />
        <ServicesSection />
        <PackagesSection />
        <WhySection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
