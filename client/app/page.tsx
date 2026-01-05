import HeroCarousel from '@/components/hero-carousel';
import ServicesSection from '@/components/services-section';
import FeaturesSection from '@/components/features-section';
import StatsSection from '@/components/stats-section';
import TestimonialsSection from '@/components/testimonials-section';
import CTASection from '@/components/cta-section';

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <ServicesSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
