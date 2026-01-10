"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, FileText, Maximize2, CheckCircle2, ArrowRight, Zap, Star } from "lucide-react";
import Link from "next/link";

export default function ServicesHero() {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Floating Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl"
      />

      <div className="container relative mx-auto px-6 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge
                variant="outline"
                className="mb-6 gap-2 border-primary/20 text-primary px-4 py-2 font-semibold"
              >
                <Star className="h-4 w-4 fill-primary" />
                Premium Quality Printing
                <ArrowRight className="h-3 w-3" />
              </Badge>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
            >
              <span className="block text-foreground">Professional</span>
              <span className="block bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                Printing Services
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="max-w-xl text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed mx-auto lg:mx-0"
            >
              Transform your ideas into reality with our high-quality printing
              solutions. From business documents to premium marketing
              materials, we deliver excellence every time.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center lg:items-start lg:justify-start justify-center gap-4 mb-8"
            >
              <Button
                size="lg"
                className="h-12 px-8 text-base font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-1 group"
                asChild
              >
                <a href="#services">
                  <Zap className="mr-2 h-4 w-4" />
                  Browse Services
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base font-semibold rounded-xl border-2 hover:bg-primary/5 transition-all"
                >
                  Get Free Quote
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Quality Guaranteed</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative"
          >
            {/* Main Image Container */}
            <div className="relative bg-accent/5 rounded-2xl p-8 border border-border/50 backdrop-blur-sm">
              {/* Mockup Grid */}
              <div className="grid grid-cols-2 gap-6">
                {/* Large Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="bg-card rounded-xl aspect-[4/3] border border-border/50 shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
                >
                  <div className="text-center">
                    <Printer className="h-12 w-12 mx-auto mb-3 text-primary" />
                    <p className="text-sm font-medium text-foreground">
                      Digital Printing
                    </p>
                  </div>
                </motion.div>

                {/* Tall Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="bg-card rounded-xl row-span-2 border border-border/50 shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
                >
                  <div className="text-center">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-accent" />
                    <p className="text-sm font-medium text-foreground mb-2">
                      Document
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      Binding
                    </p>
                  </div>
                </motion.div>

                {/* Small Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="bg-card rounded-xl aspect-[4/3] border border-border/50 shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
                >
                  <div className="text-center">
                    <Maximize2 className="h-12 w-12 mx-auto mb-3 text-secondary" />
                    <p className="text-sm font-medium text-foreground">
                      Large Format
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Floating Stats */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-xl shadow-lg"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-xs opacity-90">Happy Clients</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="absolute -bottom-4 -left-4 bg-accent text-accent-foreground px-4 py-2 rounded-xl shadow-lg"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold">24h</div>
                  <div className="text-xs opacity-90">Quick Delivery</div>
                </div>
              </motion.div>
            </div>

            {/* Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
              <div className="absolute left-1/2 -translate-x-1/2 w-[60%] h-[256px] bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/.3)_10%,transparent_60%)] blur-3xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
