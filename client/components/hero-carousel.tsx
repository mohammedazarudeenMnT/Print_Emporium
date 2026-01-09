"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Printer,
  CreditCard,
  Image as ImageIcon,
  FileText,
  Loader2,
  ChevronRight,
  Globe,
  Truck,
  Palette,
  Layers,
  ShieldCheck,
  Clock,
  Gift,
  Scan,
  BookOpen,
  Tags,
  ShoppingBag,
  Zap,
  Star,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { getAllHeroSlides, HeroSlide } from "@/lib/hero-slide-api";
import Link from "next/link";
import Image from "next/image";

const IconMap: Record<string, LucideIcon> = {
  Printer,
  CreditCard,
  Image: ImageIcon,
  FileText,
  Globe,
  Truck,
  Palette,
  Layers,
  ShieldCheck,
  Clock,
  Gift,
  Scan,
  BookOpen,
  Tags,
  ShoppingBag,
  Zap,
  Star,
};

export default function HeroCarousel() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await getAllHeroSlides(true);
        if (res.success) {
          setSlides(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch hero slides:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (!carouselApi || slides.length === 0) return;

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
  }, [carouselApi, slides]);

  useEffect(() => {
    if (!carouselApi || slides.length === 0) return;

    const interval = setInterval(() => {
      if (carouselApi.canScrollNext()) {
        carouselApi.scrollNext();
      } else {
        carouselApi.scrollTo(0);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [carouselApi, slides]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-linear-to-br from-primary-50 via-base-50 to-primary-100">
        <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
      </div>
    );
  }

  if (slides.length === 0) return null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-primary-50 via-base-50 to-primary-100">
      {/* Soft primary color overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(147,51,234,0.08),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.06),transparent_50%)]" />

      {/* Animated gradient orbs with primary colors */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl animate-pulse animation-duration-[5s]" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-primary-300/25 rounded-full blur-3xl animate-pulse animation-duration-[7s] [animation-delay:1.5s]" />
      </div>

      {/* Subtle dot pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-size-[32px_32px]" />

      <div className="relative z-10 container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-10"
        >
          <h1 className="text-2xl min-[480px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-900 mb-2 sm:mb-3 md:mb-4 tracking-tight leading-tight px-2">
            Professional Printing Services
          </h1>
          <p className="text-sm min-[480px]:text-base sm:text-lg md:text-xl text-base-700 max-w-2xl mx-auto leading-relaxed px-4">
            Quality printing solutions for all your business and personal needs
            in Chennai
          </p>
        </motion.div>

        <div className="relative max-w-7xl mx-auto">
          <Carousel
            setApi={setCarouselApi}
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 sm:-ml-3 md:-ml-4">
              {slides.map((slide, index) => {
                const Icon = slide.iconName
                  ? IconMap[slide.iconName] || Printer
                  : Printer;
                return (
                  <CarouselItem
                    key={slide._id}
                    className="pl-2 sm:pl-3 md:pl-4 basis-[95%] min-[480px]:basis-[92%] sm:basis-11/12 md:basis-4/5 lg:basis-3/4 xl:basis-2/3"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative h-[380px] min-[480px]:h-[420px] sm:h-[480px] md:h-[540px] lg:h-[600px] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden group border border-white/20 shadow-2xl"
                    >
                      <div className="absolute inset-0">
                        <Image
                          src={
                            typeof slide.image === "string" ? slide.image : ""
                          }
                          alt={slide.title}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                          sizes="(max-width: 480px) 95vw, (max-width: 640px) 92vw, (max-width: 1024px) 85vw, 75vw"
                          priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-900/95 via-slate-800/60 to-transparent" />
                      </div>

                      <div className="absolute inset-0 flex flex-col justify-end p-4 min-[480px]:p-5 sm:p-6 md:p-10 lg:p-14">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="mb-2 min-[480px]:mb-3 sm:mb-4 md:mb-5"
                        >
                          <div className="w-10 h-10 min-[480px]:w-11 min-[480px]:h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                            <Icon className="w-5 h-5 min-[480px]:w-5.5 min-[480px]:h-5.5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                          </div>
                        </motion.div>

                        <motion.h2
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="text-xl min-[480px]:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 min-[480px]:mb-2.5 sm:mb-3 md:mb-4 tracking-tight leading-tight"
                        >
                          {slide.title}
                        </motion.h2>

                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="text-xs min-[480px]:text-sm sm:text-base md:text-lg text-white/90 mb-3 min-[480px]:mb-3.5 sm:mb-4 md:mb-6 max-w-2xl leading-relaxed font-medium line-clamp-2 sm:line-clamp-3"
                        >
                          {slide.subtitle}
                        </motion.p>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          className="flex flex-wrap gap-1.5 min-[480px]:gap-2 sm:gap-2.5 md:gap-3 mb-3 min-[480px]:mb-4 sm:mb-5 md:mb-7"
                        >
                          {slide.features.slice(0, 3).map((feature, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 min-[480px]:px-2.5 min-[480px]:py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] min-[480px]:text-xs sm:text-sm font-semibold text-white uppercase tracking-wide"
                            >
                              {feature}
                            </span>
                          ))}
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                          className="flex flex-col min-[480px]:flex-row gap-2 min-[480px]:gap-2.5 sm:gap-3 md:gap-4"
                        >
                          <Link href={slide.ctaLink || "/services"} className="w-full min-[480px]:w-auto">
                            <Button
                              size="lg"
                              className="w-full min-[480px]:w-auto h-10 min-[480px]:h-11 sm:h-12 md:h-14 px-4 min-[480px]:px-5 sm:px-6 md:px-10 rounded-lg sm:rounded-xl md:rounded-2xl bg-white text-black hover:bg-white/90 font-bold text-xs min-[480px]:text-sm sm:text-base shadow-xl shadow-white/10 transition-all hover:scale-105 active:scale-95 group"
                            >
                              {slide.ctaText || "Get Started"}
                              <ChevronRight className="ml-1 min-[480px]:ml-1.5 sm:ml-2 h-3 w-3 min-[480px]:h-3.5 min-[480px]:w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                          </Link>
                          {slide.secondaryCtaText && (
                            <Link href={slide.secondaryCtaLink || "/about"} className="w-full min-[480px]:w-auto">
                              <Button
                                size="lg"
                                variant="outline"
                                className="w-full min-[480px]:w-auto h-10 min-[480px]:h-11 sm:h-12 md:h-14 px-4 min-[480px]:px-5 sm:px-6 md:px-10 rounded-lg sm:rounded-xl md:rounded-2xl border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 font-semibold text-xs min-[480px]:text-sm sm:text-base transition-all hover:scale-105 active:scale-95"
                              >
                                {slide.secondaryCtaText}
                              </Button>
                            </Link>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>

          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none z-20 px-1 min-[480px]:px-2 sm:px-3 md:px-4 lg:px-6">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="pointer-events-auto bg-white/90 backdrop-blur-sm border border-primary-300 text-primary-900 hover:bg-primary-50 hover:border-primary-400 disabled:opacity-30 rounded-full h-8 w-8 min-[480px]:h-9 min-[480px]:w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 shadow-xl transition-all hover:scale-110 active:scale-90"
            >
              <ArrowLeft className="h-3 w-3 min-[480px]:h-4 min-[480px]:w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
              className="pointer-events-auto bg-white/90 backdrop-blur-sm border border-primary-300 text-primary-900 hover:bg-primary-50 hover:border-primary-400 disabled:opacity-30 rounded-full h-8 w-8 min-[480px]:h-9 min-[480px]:w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 shadow-xl transition-all hover:scale-110 active:scale-90"
            >
              <ArrowRight className="h-3 w-3 min-[480px]:h-4 min-[480px]:w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </Button>
          </div>

          <div className="flex justify-center gap-1.5 min-[480px]:gap-2 sm:gap-2.5 md:gap-3 mt-4 min-[480px]:mt-5 sm:mt-6 md:mt-10">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`h-1.5 min-[480px]:h-2 sm:h-2 md:h-2.5 rounded-full transition-all duration-500 ${
                  currentSlide === index
                    ? "w-6 min-[480px]:w-7 sm:w-8 md:w-12 bg-primary-700 shadow-lg shadow-primary-200"
                    : "w-1.5 min-[480px]:w-2 sm:w-2 md:w-2.5 bg-base-400/50 hover:bg-primary-500/50"
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
