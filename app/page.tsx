import HeroSection from "@/components/home/HeroSection";
import CalendarSection from "@/components/home/CalendarSection";
import PaymentSection from "@/components/home/PaymentSection";
import AboutSection from "@/components/home/AboutSection";
import PriceListSection from "@/components/home/PriceListSection";
import CtaSection from "@/components/home/CtaSection";
import PackagesSection from "@/components/home/PackagesSection";
import GallerySection from "@/components/home/GallerySection";
import ServiceAreaSection from "@/components/home/ServiceAreaSection";
import ContactSection from "@/components/home/ContactSection";
import NewsletterSection from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <div className="bg-white font-sans">
      <HeroSection />
      <PaymentSection />
      <AboutSection />
      <PriceListSection />
      <CtaSection />
      <PackagesSection />
      <GallerySection />
      <ServiceAreaSection />
      <ContactSection />
      <NewsletterSection />
    </div>
  );
}
