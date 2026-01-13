"use client";

import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  HelpCircle,
  CheckCircle,
  ChevronDown,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Zap,
  Globe,
  Loader2,
  Headphones,
  Settings,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useCompanySettings } from "@/hooks/use-company-settings";
import { createLead } from "@/lib/lead-api";
import { toast } from "sonner";
import ContactHero from "@/components/contact-hero";
import CTASection from "@/components/cta-section";

interface FAQ {
  question: string;
  answer: string;
}

function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <div className={cn(
        "absolute inset-0 bg-primary/10 blur-2xl rounded-3xl transition-opacity duration-500",
        isOpen ? "opacity-100" : "opacity-0"
      )} />
      
      <div className="relative border border-white/10 rounded-3xl overflow-hidden bg-slate-900/40 backdrop-blur-3xl hover:bg-slate-900/60 transition-all duration-500 shadow-2xl">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left p-8 flex items-center justify-between group"
        >
          <span className="font-bold text-slate-100 text-xl group-hover:text-primary transition-colors">
            {faq.question}
          </span>
          <div
            className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center transition-all duration-500 ${
              isOpen ? "bg-primary text-white rotate-180 scale-110 shadow-lg shadow-primary/40" : "text-primary group-hover:bg-primary/10"
            }`}
          >
            <ChevronDown className="w-5 h-5" />
          </div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="px-8 pb-8 text-slate-400 text-lg leading-relaxed border-t border-white/5 pt-6">
                {faq.answer}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

export default function RedesignedContactPage() {
  const { settings, loading } = useCompanySettings();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const faqs: FAQ[] = [
    {
      question: "What is your typical turnaround for bulk orders?",
      answer: "Bulk orders are our specialty. Typically, orders of 500+ units take 5-7 business days, though we offer 'Flash Service' for 48-hour delivery on select materials.",
    },
    {
      question: "Can I request a physical sample before printing?",
      answer: "Absolutely! We recommend physical proofs for large-scale projects. Sample kits are available starting at ₹499, which is fully refundable upon order confirmation.",
    },
    {
      question: "Do you provide design assistance for blueprints?",
      answer: "Yes, we have specialized CAD-prep experts who ensure your blueprints and technical drawings are perfectly scaled and legible before they ever touch the printer.",
    },
    {
      question: "What sustainable printing options do you have?",
      answer: "We offer 100% recycled paper stocks, soy-based inks, and plastic-free packaging options for brands committed to carbon neutrality.",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
         const newErrors = { ...prev };
         delete newErrors[name];
         return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Validation failed. Check your inputs.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createLead(formData);
      if (response.success) {
        setIsSubmitted(true);
        toast.success("Lead captured successfully!");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        toast.error(response.message || "Failed to submit lead.");
      }
    } catch (error: any) {
      console.error("Lead submission error:", error);
      toast.error(error.response?.data?.message || "Internal server error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const BentoCard = ({ icon, title, desc, className }: { icon: any, title: string, desc: string, className?: string }) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className={cn("p-8 rounded-[2.5rem] bg-white/90 backdrop-blur-3xl border border-slate-200 shadow-2xl group transition-all duration-500 hover:bg-white hover:border-primary/30", className || "")}
    >
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="text-xl font-bold text-slate-900 mb-2">{title}</h4>
      <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50 overflow-hidden selection:bg-primary/20 selection:text-primary">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-primary/8 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/6 rounded-full blur-[150px] animate-pulse [animation-delay:2s]" />
      </div>

      <ContactHero />

      {/* Main Split Content */}
      <section className="container mx-auto px-6 py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-stretch">
          
          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex flex-col"
          >
            <div className="mb-12">
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary-700 font-bold tracking-widest bg-primary/10 px-4 py-1.5 uppercase text-[10px] shadow-sm">
                Initiate Project
              </Badge>
              <h2 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-none">
                Bring Your <br />
                <span className="text-primary italic">Ambition</span> to Life.
              </h2>
              <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
                Fill out the secure form below. Our high-priority lead capture system ensures an expert reviews your inquiry within 120 minutes.
              </p>
            </div>

            <div className="flex-1 bg-white/90 backdrop-blur-3xl border border-slate-200 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
               
               {isSubmitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center fill-mode-forwards">
                  <div className="w-32 h-32 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-10 relative">
                    <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-primary/30 rounded-full" />
                    <CheckCircle className="w-16 h-16 text-primary relative z-10" />
                  </div>
                  <h3 className="text-4xl font-bold text-slate-900 mb-6">Submission Sent!</h3>
                  <p className="text-slate-600 text-xl max-w-sm mb-12">
                    Our lead management system has assigned your inquiry. We'll reach out to <span className="text-primary font-bold">{formData.email}</span> shortly.
                  </p>
                  <Button variant="outline" className="px-10 h-14 rounded-2xl border-slate-300 text-slate-900 hover:bg-slate-900 hover:text-white transition-all" onClick={() => setIsSubmitted(false)}>
                    New Inquiry
                  </Button>
                </motion.div>
               ) : (
                <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-600 ml-2">Full Name</label>
                      <Input name="name" value={formData.name} onChange={handleInputChange} className={cn("h-16 rounded-2xl bg-slate-50 border-slate-200 text-slate-900 text-lg focus:ring-primary/20 focus:border-primary/50 transition-all", errors.name ? "border-red-500/50 bg-red-50" : "")} placeholder="Alexander Knight" />
                      {errors.name && <p className="text-red-600 text-[10px] ml-2 font-bold uppercase tracking-widest">{errors.name}</p>}
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-600 ml-2">Email Address</label>
                      <Input name="email" value={formData.email} onChange={handleInputChange} className={cn("h-16 rounded-2xl bg-slate-50 border-slate-200 text-slate-900 text-lg focus:ring-primary/20 focus:border-primary/50 transition-all", errors.email ? "border-red-500/50 bg-red-50" : "")} placeholder="alex@industry.com" />
                      {errors.email && <p className="text-red-600 text-[10px] ml-2 font-bold uppercase tracking-widest">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-600 ml-2">Project Subject</label>
                      <Input name="subject" value={formData.subject} onChange={handleInputChange} className={cn("h-16 rounded-2xl bg-slate-50 border-slate-200 text-slate-900 text-lg focus:ring-primary/20 focus:border-primary/50 transition-all", errors.subject ? "border-red-500/50 bg-red-50" : "")} placeholder="Large Format Campaign" />
                      {errors.subject && <p className="text-red-600 text-[10px] ml-2 font-bold uppercase tracking-widest">{errors.subject}</p>}
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-600 ml-2">Phone (Express Line)</label>
                      <Input name="phone" value={formData.phone} onChange={handleInputChange} className="h-16 rounded-2xl bg-slate-50 border-slate-200 text-slate-900 text-lg focus:ring-primary/20 focus:border-primary/50 transition-all" placeholder="+91 0000 000 000" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-600 ml-2">Detailed Requirements</label>
                    <Textarea name="message" value={formData.message} onChange={handleInputChange} className={cn("min-h-[200px] rounded-3xl bg-slate-50 border-slate-200 text-slate-900 text-lg focus:ring-primary/20 focus:border-primary/50 transition-all resize-none p-6", errors.message ? "border-red-500/50 bg-red-50" : "")} placeholder="Tell us about dimensions, material preferences, and delivery timeline..." />
                    {errors.message && <p className="text-red-600 text-[10px] ml-2 font-bold uppercase tracking-widest">{errors.message}</p>}
                  </div>

                  <Button disabled={isSubmitting} className="w-full h-20 rounded-3xl bg-primary hover:bg-primary/90 text-white text-2xl font-black tracking-tighter shadow-2xl shadow-primary/20 group transition-all hover:scale-[1.01] active:scale-[0.98]">
                    <div className="flex items-center gap-4">
                      {isSubmitting ? (
                        <Loader2 className="w-10 h-10 animate-spin" />
                      ) : (
                        <>
                          <span>Deploy Submission</span>
                          <Send className="w-8 h-8 group-hover:rotate-12 group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </div>
                  </Button>
                  <p className="text-center text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-primary" /> Encrypted & Secure Lead Processing
                  </p>
                </form>
               )}
            </div>
          </motion.div>

          {/* Info Side - Bento Style */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex flex-col gap-8 justify-center"
          >
            <div className="grid sm:grid-cols-2 gap-8">
              <BentoCard icon={<Zap className="w-6 h-6"/>} title="Flash Turnaround" desc="Need it yesterday? Our rapid-response unit handles extreme deadlines with Zero-Error precision." />
              <BentoCard icon={<Globe className="w-6 h-6"/>} title="Pan-India Logistics" desc="Advanced tracking and secure handling for all high-value print assets nationwide." />
              <BentoCard icon={<ShieldCheck className="w-6 h-6"/>} title="Enterprise SLA" desc="Guaranteed up-times and quality audits for corporate partners and bulk contracts." />
              <BentoCard icon={<Headphones className="w-6 h-6"/>} title="Design War-Room" desc="Collaborate directly with our master printers via visual consultation sessions." />
            </div>

            <div className="flex-1 rounded-[3rem] overflow-hidden border border-white/10 group relative h-[400px]">
               <iframe
                src={settings?.googleMapEmbed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.002446777647!2d80.2079089759247!3d13.098971987228222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526430b0555555%3A0x6b80585d8847050!2sAnna%20Nagar%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1710925761000!5m2!1sen!2sin"}
                className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-1000 border-none"
                allowFullScreen
                loading="lazy"
                title="Office Location"
              />
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200 flex items-center justify-between shadow-xl">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">HQ Distribution Center</h4>
                  <p className="text-slate-600 text-xs">{settings?.city || "Chennai, India"}</p>
                </div>
                <Button size="icon" className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90" asChild>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings?.companyAddress || "")}`} target="_blank">
                    <ArrowRight className="w-6 h-6" />
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="container mx-auto px-6 py-32 relative z-10 border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <Badge className="bg-primary/10 text-primary-700 border-primary/20 mb-6 uppercase tracking-widest text-[10px] shadow-sm">Information Hub</Badge>
          <h2 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-none">Frequently Asked <span className="text-primary">Questions</span></h2>
          <p className="text-xl text-slate-600">Everything you need to know about our high-performance printing cycle.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>
      </section>

      <CTASection
        title="Ready to Elevate Your Global Brand Presence?"
        description={`Join our ecosystem of 2,800+ businesses who leverage ${settings?.companyName || "PrintEmporium"} for high-authority physical collateral.`}
        primaryButtonText="Trigger Project Quote"
        secondaryButtonText="Explore Dynamic Services"
      />
    </div>
  );
}
