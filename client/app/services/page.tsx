import CTASection from "@/components/cta-section";

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Our Services</h1>
        <p className="text-muted-foreground mb-16">
          Services page coming soon...
        </p>
      </div>

      <CTASection
        title="Transform Your Ideas Into Reality"
        description="Explore our comprehensive printing services and see how we can help your business stand out."
        primaryButtonText="Explore Services"
        secondaryButtonText="Get Quote"
        badgeText="Premium Quality"
      />
    </div>
  );
}
