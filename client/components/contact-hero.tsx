"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Headphones, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const contactMethods = [
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email Support",
    description: "Our team responds in real time",
    contact: "support@printemporium.com",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Call Us Directly",
    description: "Available during working hours",
    contact: "+91 (044) 1234-5678",
    color: "from-green-500 to-green-600",
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Visit Our Office",
    description: "T. Nagar, Chennai",
    contact: "85, Gandhi Road, Chennai - 600017",
    color: "from-purple-500 to-purple-600",
  },
];

export default function ContactHero() {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Animated Blobs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
      />

      <div className="container relative mx-auto px-6 z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant="outline"
              className="mb-6 gap-2 border-primary/20 text-primary px-4 py-2 font-semibold"
            >
              <Headphones className="h-4 w-4" />
              We&apos;re Here to Help
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
          >
            <span className="block text-foreground">Let&apos;s Connect</span>
            <span className="block bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
              Get in Touch
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed"
          >
            Have questions about our printing services? We&apos;re here to help and answer any questions you might have. We look forward to hearing from you!
          </motion.p>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className="group relative"
            >
              <div className="relative bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl h-full">
                {/* Icon Container */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white bg-gradient-to-br ${method.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {method.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {method.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {method.description}
                </p>
                <p className="text-base font-semibold text-primary">
                  {method.contact}
                </p>

                {/* Corner Accent */}
                <div className={`absolute bottom-0 right-0 w-24 h-24 rounded-tl-full bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-8 px-8 py-4 rounded-2xl bg-muted/50 border border-border">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">Working Hours</p>
                <p className="text-xs text-muted-foreground">Mon - Sat: 9:00 AM - 7:00 PM</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-border" />
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">Response Time</p>
                <p className="text-xs text-muted-foreground">Within 24 hours</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
