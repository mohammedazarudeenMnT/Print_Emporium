import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, IndianRupee, Layers, Upload } from "lucide-react";
import { Service } from "@/lib/service-api";
import Link from "next/link";
import Image from "next/image";

interface ServicesSectionProps {
  services: Service[];
}

const ServiceCard = ({
  service,
  index,
}: {
  service: Service;
  index: number;
}) => {
  // Determine if service uses per-copy or per-page pricing
  const hasPerCopyPricing =
    service.printTypes?.some((pt) => (pt.pricePerCopy || 0) > 0) ||
    service.paperSizes?.some((ps) => (ps.pricePerCopy || 0) > 0);

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl bg-card backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2",
        "border border-border/50 hover:border-primary/50",
        "animate-fade-in-up"
      )}
      style={{
        animationDelay: `${index * 0.1}s`,
        animationFillMode: "both",
      }}
    >
      {/* Gradient Overlay Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden">
        {service.image ? (
          <Image
            src={typeof service.image === "string" ? service.image : ""}
            alt={service.name}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-2"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
            <Layers className="h-20 w-20 text-primary/20" />
          </div>
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Price Badge */}
        <div className="absolute top-4 right-4 px-3 py-2 rounded-xl bg-background/95 backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-1">
            <IndianRupee className="h-4 w-4 text-primary" />
            <span className="font-bold text-lg text-foreground">
              {service.basePricePerPage}
            </span>
            <span className="text-xs text-muted-foreground">
              /{hasPerCopyPricing ? "copy" : "page"}
            </span>
          </div>
        </div>

        {/* Star Effect */}
        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Star className="w-6 h-6 text-primary animate-pulse fill-primary" />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative flex flex-col flex-1 p-6 z-10">
        <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
          {service.name}
        </h3>

        {/* Service Details */}
        <div className="space-y-2 mb-6 flex-1">
          {service.printTypes && service.printTypes.length > 0 && (
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {service.printTypes.length}
              </span>{" "}
              print options available
            </p>
          )}
          {service.paperSizes && service.paperSizes.length > 0 && (
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {service.paperSizes.length}
              </span>{" "}
              paper sizes
            </p>
          )}
          {service.bindingOptions && service.bindingOptions.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Binding options available
            </p>
          )}
        </div>

        {/* CTA Button */}
        <Link href={`/order/${service._id}`} className="w-full">
          <Button
            className="w-full group/btn relative overflow-hidden rounded-xl font-semibold"
            variant="default"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Upload & Print{" "}
              <Upload className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
          </Button>
        </Link>
      </div>

      {/* Animated Border */}
      <div className="absolute left-0 bottom-0 h-1 w-0 bg-gradient-to-r from-primary to-primary/50 transition-all duration-500 group-hover:w-full" />

      {/* Corner Accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full transform scale-0 group-hover:scale-100 transition-transform duration-500" />
    </div>
  );
};

export default function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section className="w-full min-h-screen py-20 px-4 bg-base-50 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold backdrop-blur-sm border border-primary/20 animate-pulse">
            <Layers className="w-4 h-4" />
            Our Services
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
            Professional Printing Solutions
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From business essentials to large-format projects, we deliver
            exceptional quality and service for all your printing needs.
          </p>
        </div>

        {/* Services Grid */}
        {services.length === 0 ? (
          <div className="py-20 text-center">
            <Layers className="h-16 w-16 mx-auto mb-4 text-muted-foreground/20" />
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              Services Coming Soon
            </h3>
            <p className="text-muted-foreground">
              Our service catalog is being updated. Please check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.slice(0, 6).map((service, index) => (
              <ServiceCard key={service._id} service={service} index={index} />
            ))}
          </div>
        )}

        {/* View All Services Button */}
        {services.length > 6 && (
          <div className="text-center mb-16">
            <Link href="/services">
              <Button size="lg" variant="outline" className="group">
                View All Services
                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
              </Button>
            </Link>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center p-8 rounded-3xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20 backdrop-blur-sm">
          <p className="text-lg text-muted-foreground mb-6 font-medium">
            Need a custom solution? We&apos;re here to help with specialized
            printing services.
          </p>
          <Link href="/contact">
            <Button
              size="lg"
              variant="default"
              className="group shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Contact Us Today
              <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
