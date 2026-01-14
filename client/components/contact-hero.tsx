"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Headphones,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCompanySettings } from "@/hooks/use-company-settings";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function ContactHero() {
  const { settings, loading } = useCompanySettings();
  const [particles, setParticles] = useState<
    Array<{ left: number; top: number; duration: number; delay: number }>
  >([]);

  useEffect(() => {
    // Generate particles only on the client side to avoid hydration mismatch
    const generatedParticles = [...Array(12)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 5 + Math.random() * 5,
      delay: Math.random() * 10,
    }));
    setParticles(generatedParticles);
  }, []);

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Global Support",
      description: "Email our expert team for quotes",
      value: loading
        ? "Loading..."
        : settings?.companyEmail || "hello@printemporium.com",
      link: `mailto:${settings?.companyEmail || "hello@printemporium.com"}`,
      color: "from-blue-500/20 to-indigo-500/20",
      iconColor: "text-blue-400",
      delay: 0.1,
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Direct Connect",
      description: "Immediate assistance during hours",
      value: loading
        ? "Loading..."
        : settings?.companyPhone || "+91 98765 43210",
      link: `tel:${(settings?.companyPhone || "").replace(/\s/g, "")}`,
      color: "from-violet-500/20 to-purple-500/20",
      iconColor: "text-purple-400",
      delay: 0.2,
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Design Studio",
      description: "Visit us for physical consultations",
      value: loading ? "Loading..." : settings?.companyAddress || "Chennai, India",
      link: "#map-section",
      color: "from-fuchsia-500/20 to-rose-500/20",
      iconColor: "text-rose-400",
      delay: 0.3,
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50">
      {/* Magic Background Layers */}
      <div className="absolute inset-0 z-0">
        {/* Light Gradient Base */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#f8fafc_0%,#ffffff_80%)]" />

        {/* Animated Mesh Gradients */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] mix-blend-multiply"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
            x: [0, -40, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-20%] left-[-10%] w-[900px] h-[900px] bg-indigo-500/8 rounded-full blur-[150px] mix-blend-multiply"
        />

        {/* Noise & Grid Textures */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        {/* Floating Particles */}
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.3, 0],
              y: [0, -100],
              x: Math.sin(i) * 50,
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
            className="absolute w-1 h-1 bg-primary/40 rounded-full blur-sm"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="relative group mb-10"
          >
            <div className="absolute inset-0 bg-primary/10 blur-xl group-hover:bg-primary/20 transition-all duration-500 rounded-full" />
            <Badge className="relative px-6 py-2 bg-white/90 backdrop-blur-3xl border border-primary/20 text-primary-700 rounded-full gap-2 font-bold tracking-widest uppercase text-xs hover:border-primary/40 transition-colors shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Elite Printing Solutions
            </Badge>
          </motion.div>

          {/* High-Impact Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter text-slate-900 mb-10 leading-[0.85] select-none"
          >
            Connect With <br />
            <span className="relative inline-block mt-4">
              <span className="bg-gradient-to-r from-primary via-blue-600 to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x">
                Excellence
              </span>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, delay: 0.8 }}
                className="absolute -bottom-4 left-0 h-2 bg-gradient-to-r from-primary to-transparent rounded-full opacity-30"
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xl sm:text-3xl text-slate-600 font-medium leading-relaxed max-w-3xl mb-16"
          >
            From complex blueprints to vibrant brand assets, we bring your most
            ambitious projects to life with surgical precision.
          </motion.p>

          {/* Social Proof & Metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-12 mb-24"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5, zIndex: 10 }}
                    className="w-14 h-14 rounded-full border-4 border-white bg-slate-100 shadow-xl"
                  >
                    <Image
                      src={`https://i.pravatar.cc/150?u=print${i}`}
                      alt="user"
                      width={56}
                      height={56}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-slate-600 font-bold tracking-wide">
                  4.9/5 from 2,800+ clients
                </span>
              </div>
            </div>

            <div className="h-12 w-px bg-slate-200 hidden sm:block" />

            <div className="flex gap-10">
              <div className="text-center group">
                <div className="text-primary-600 font-black text-3xl mb-1 group-hover:scale-110 transition-transform">
                  99.9%
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">
                  Accuracy Rate
                </div>
              </div>
              <div className="text-center group">
                <div className="text-primary-600 font-black text-3xl mb-1 group-hover:scale-110 transition-transform">
                  2hr
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">
                  Avg. Response
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.link}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 + method.delay }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group relative"
              >
                {/* Holographic Glow Effect */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-700 blur-2xl rounded-[2.5rem]",
                    method.color
                  )}
                />

                <div className="relative h-full bg-white/80 backdrop-blur-3xl border border-slate-200 group-hover:border-primary/40 p-10 rounded-[2.5rem] flex flex-col items-center text-center shadow-2xl transition-all duration-700">
                  <div
                    className={cn(
                      "w-20 h-20 rounded-[1.5rem] bg-slate-50 flex items-center justify-center mb-8 border border-slate-200 group-hover:border-primary/50 shadow-inner group-hover:scale-110 transition-all duration-500",
                      method.iconColor
                    )}
                  >
                    {method.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                    {method.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    {method.description}
                  </p>
                  <div className="w-full h-px bg-slate-200 mb-6" />
                  <p className="text-slate-800 font-bold text-lg group-hover:text-slate-900 transition-colors underline decoration-primary/20">
                    {method.value}
                  </p>

                  {/* Invisible Hover Reveal */}
                  <div className="mt-4 flex items-center gap-2 text-primary font-bold text-xs opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    Reach Out <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
