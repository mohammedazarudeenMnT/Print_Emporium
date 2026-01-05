"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Printer, CreditCard, Image as ImageIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface PrintingService {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  features: string[];
}

const services: PrintingService[] = [
  {
    id: "document-printing",
    title: "Document Printing",
    description: "Professional document printing services with fast turnaround times. Perfect for business reports, presentations, and everyday printing needs.",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&auto=format&fit=crop&q=80",
    icon: <FileText className="w-8 h-8" />,
    features: ["Same-day service", "Color & B/W options", "Multiple paper types"]
  },
  {
    id: "business-cards",
    title: "Business Cards",
    description: "Make a lasting impression with premium business cards. High-quality printing on various card stocks with custom finishes available.",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&auto=format&fit=crop&q=80",
    icon: <CreditCard className="w-8 h-8" />,
    features: ["Premium card stock", "Matte or glossy finish", "Custom designs"]
  },
  {
    id: "banners",
    title: "Banners & Signage",
    description: "Eye-catching banners and signs for events, promotions, and advertising. Durable materials suitable for indoor and outdoor use.",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&auto=format&fit=crop&q=80",
    icon: <Printer className="w-8 h-8" />,
    features: ["Large format printing", "Weather-resistant", "Custom sizes"]
  },
  {
    id: "photo-printing",
    title: "Photo Printing",
    description: "Preserve your memories with professional photo printing. From standard prints to canvas and metal, we bring your photos to life.",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&auto=format&fit=crop&q=80",
    icon: <ImageIcon className="w-8 h-8" />,
    features: ["High-resolution prints", "Multiple formats", "Professional quality"]
  }
];

export default function HeroCarousel() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!carouselApi) return;

    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };

    updateSelection();
    carouselApi.on("select", updateSelection);

    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi) return;

    const interval = setInterval(() => {
      if (carouselApi.canScrollNext()) {
        carouselApi.scrollNext();
      } else {
        carouselApi.scrollTo(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselApi]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-primary-50 via-base-50 to-primary-100">
      {/* Soft primary color overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(147,51,234,0.08),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.06),transparent_50%)]" />
      
      {/* Animated gradient orbs with primary colors */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl animate-pulse [animation-duration:5s]" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-primary-300/25 rounded-full blur-3xl animate-pulse [animation-duration:7s] [animation-delay:1.5s]" />
      </div>
      
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          {/* <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100/80 border border-primary-200 backdrop-blur-sm mb-6"
          >
            <Printer className="w-4 h-4 text-primary-700" />
            <span className="text-sm text-primary-900 font-medium">Premium Printing Solutions</span>
          </motion.div> */}

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-900 mb-4 tracking-tight">
            Professional Printing Services
          </h1>
          <p className="text-lg md:text-xl text-base-700 max-w-2xl mx-auto">
            Quality printing solutions for all your business and personal needs in Chennai
          </p>
        </motion.div>

        <div className="relative">
          <Carousel
            setApi={setCarouselApi}
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {services.map((service, index) => (
                <CarouselItem key={service.id} className="md:basis-4/5 lg:basis-3/4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden group"
                  >
                    <div className="absolute inset-0">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-800/60 to-transparent" />
                    </div>

                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-4 text-white/90"
                      >
                        {service.icon}
                      </motion.div>

                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl md:text-5xl font-bold text-white mb-4"
                      >
                        {service.title}
                      </motion.h2>

                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg text-white/80 mb-6 max-w-2xl"
                      >
                        {service.description}
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-wrap gap-3 mb-6"
                      >
                        {service.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-white"
                          >
                            {feature}
                          </span>
                        ))}
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex flex-col sm:flex-row gap-4"
                      >
                        <Button
                          size="lg"
                          className="bg-white text-black hover:bg-white/90 font-semibold"
                        >
                          Get Started
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          className="border-white/30 text-white hover:bg-white/10"
                        >
                          Learn More
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none z-20">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="pointer-events-auto bg-white/90 backdrop-blur-sm border border-primary-300 text-primary-900 hover:bg-primary-50 hover:border-primary-400 disabled:opacity-30 rounded-full h-12 w-12 shadow-lg"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
              className="pointer-events-auto bg-white/90 backdrop-blur-sm border border-primary-300 text-primary-900 hover:bg-primary-50 hover:border-primary-400 disabled:opacity-30 rounded-full h-12 w-12 shadow-lg"
            >
              <ArrowRight className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {services.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "w-8 bg-primary-700"
                    : "w-2 bg-base-400 hover:bg-primary-500"
                }`}
                onClick={() => carouselApi?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
