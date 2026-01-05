"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileText, CreditCard, Image, BookOpen, Printer, Maximize, ArrowRight, Sparkles } from "lucide-react";

interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  gradient: string;
}

const services: Service[] = [
  {
    title: "Document Printing",
    description: "High-quality document printing for all your business and personal needs. Fast turnaround with professional results.",
    icon: <FileText className="w-8 h-8" />,
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "Business Cards",
    description: "Premium business cards that make a lasting impression. Multiple finishes and paper stocks available.",
    icon: <CreditCard className="w-8 h-8" />,
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "Banners & Signage",
    description: "Eye-catching banners and signage for events, promotions, and storefronts. Weather-resistant materials.",
    icon: <Maximize className="w-8 h-8" />,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80",
    gradient: "from-orange-500/20 to-red-500/20",
  },
  {
    title: "Photo Printing",
    description: "Professional photo printing services with vibrant colors and sharp details. Various sizes available.",
    icon: <Image className="w-8 h-8" />,
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&auto=format&fit=crop&q=80",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
  {
    title: "Binding Services",
    description: "Professional binding solutions including spiral, comb, and perfect binding for documents and presentations.",
    icon: <BookOpen className="w-8 h-8" />,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
    gradient: "from-indigo-500/20 to-violet-500/20",
  },
  {
    title: "Large Format Printing",
    description: "Wide-format printing for posters, blueprints, and architectural drawings. Precision and quality guaranteed.",
    icon: <Printer className="w-8 h-8" />,
    image: "https://images.unsplash.com/photo-1612521564730-62fc7691cd85?w=800&auto=format&fit=crop&q=80",
    gradient: "from-teal-500/20 to-cyan-500/20",
  },
];

const ServiceCard = ({ service, index }: { service: Service; index: number }) => {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl bg-card backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2",
        "border border-border/50 hover:border-primary/50"
      )}
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
      }}
    >
      {/* Gradient Overlay Background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        service.gradient
      )} />

      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-2"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        
        {/* Floating Icon */}
        <div className="absolute top-4 right-4 p-3 rounded-2xl bg-background/90 backdrop-blur-md text-primary shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
          {service.icon}
        </div>

        {/* Sparkle Effect */}
        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Sparkles className="w-6 h-6 text-primary animate-pulse" />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative flex flex-col flex-1 p-6 z-10">
        <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
          {service.title}
        </h3>
        <p className="text-muted-foreground mb-6 flex-1 leading-relaxed text-sm">
          {service.description}
        </p>

        {/* CTA Button */}
        <Button className="w-full group/btn relative overflow-hidden rounded-xl font-semibold" variant="default">
          <span className="relative z-10 flex items-center justify-center gap-2">
            Get Quote
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
        </Button>
      </div>

      {/* Animated Border */}
      <div className="absolute left-0 bottom-0 h-1 w-0 bg-gradient-to-r from-primary to-primary/50 transition-all duration-500 group-hover:w-full" />

      {/* Corner Accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full transform scale-0 group-hover:scale-100 transition-transform duration-500" />
    </div>
  );
};

export default function ServicesSection() {
  return (
    <section className="w-full min-h-screen py-20 px-4 bg-base-50 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold backdrop-blur-sm border border-primary/20 animate-pulse">
            <Sparkles className="w-4 h-4" />
            Our Services
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
            Professional Printing Solutions
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From business essentials to large-format projects, we deliver exceptional quality and service for all your printing needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center p-8 rounded-3xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20 backdrop-blur-sm">
          <p className="text-lg text-muted-foreground mb-6 font-medium">
            Need a custom solution? We&apos;re here to help with specialized printing services.
          </p>
          <Button size="lg" variant="default" className="group shadow-lg hover:shadow-xl transition-all duration-300">
            Contact Us Today
            <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
