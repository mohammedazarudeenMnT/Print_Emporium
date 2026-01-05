"use client";

import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  HelpCircle,
  CheckCircle,
  ChevronDown,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CTASection from "@/components/cta-section";
import { motion, AnimatePresence } from "framer-motion";

interface ContactInfo {
  icon: React.ReactNode;
  title: string;
  details: string[];
  link?: string;
  action?: string;
}

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
      transition={{ delay: index * 0.1 }}
      className="border border-base-200 rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 hover:bg-white transition-colors flex items-center justify-between group"
      >
        <span className="font-semibold text-primary-900 text-lg group-hover:text-primary-700 transition-colors">
          {faq.question}
        </span>
        <div
          className={`w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center transition-all duration-300 ${
            isOpen ? "bg-primary-900 text-white rotate-180" : "text-primary-900"
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-base-600 leading-relaxed">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function RedesignedContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactInfo: ContactInfo[] = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Our Studio",
      details: ["Anna Nagar, Chennai", "Tamil Nadu, India, 600040"],
      link: "#map",
      action: "Get Directions",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Talk to Expert",
      details: ["+91 98765 43210", "+91 87654 32109"],
      link: "tel:+919876543210",
      action: "Call Now",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      details: ["hello@printemporium.com", "support@printemporium.com"],
      link: "mailto:hello@printemporium.com",
      action: "Write Email",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Working Hours",
      details: ["Mon - Sat: 9:00 AM - 8:00 PM", "Sunday: Closed"],
      action: "View Calendar",
    },
  ];

  const faqs: FAQ[] = [
    {
      question: "What printing services do you offer?",
      answer:
        "We offer a comprehensive range of printing services including business cards, brochures, banners, posters, custom packaging, large format printing, and more. Our state-of-the-art equipment ensures high-quality results for all your printing needs.",
    },
    {
      question: "What is your typical turnaround time?",
      answer:
        "Standard orders typically take 3-5 business days. We also offer rush services for urgent projects, with options for 24-hour and 48-hour turnaround times at an additional cost. Contact us for specific timeline requirements.",
    },
    {
      question: "Do you offer design services?",
      answer:
        "Yes! Our experienced design team can help bring your vision to life. We offer full design services, design consultations, and file preparation to ensure your prints look perfect. Design fees vary based on project complexity.",
    },
    {
      question: "What file formats do you accept?",
      answer:
        "We accept PDF, AI, EPS, PSD, and high-resolution JPG/PNG files. For best results, we recommend PDF files with embedded fonts and images at 300 DPI or higher. Our team can assist with file preparation if needed.",
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-base-50 overflow-hidden relative selection:bg-primary-100 selection:text-primary-900">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary-100/40 rounded-full blur-[120px] mix-blend-multiply animate-blob" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-violet-100/40 rounded-full blur-[120px] mix-blend-multiply animate-blob [animation-delay:2s]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 z-10">
        <div className="container mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-primary-200/50 backdrop-blur-sm shadow-sm mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary-600 fill-current" />
            <span className="text-sm font-semibold text-primary-900 tracking-wide uppercase">
              Here to help
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-primary-950 mb-8 leading-[1.1]"
          >
            Let&apos;s Start a <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-violet-600">
              Conversation
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-base-600 max-w-2xl mx-auto leading-relaxed"
          >
            Have a project in mind? We&apos;d love to hear about it. Send us a
            message and let&apos;s create something extraordinary together.
          </motion.p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group p-6 rounded-3xl bg-white/60 backdrop-blur-md border border-white/50 shadow-xl shadow-base-200/50 hover:shadow-2xl hover:shadow-primary-900/5 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-primary-100 flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                {info.icon}
              </div>
              <h3 className="font-bold text-lg text-primary-900 mb-2">
                {info.title}
              </h3>
              <div className="mb-4">
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-base-600 text-sm leading-6">
                    {detail}
                  </p>
                ))}
              </div>
              {info.link ? (
                <a
                  href={info.link}
                  className="text-primary-700 font-semibold text-sm inline-flex items-center gap-2 group-hover:translate-x-1 transition-transform"
                >
                  {info.action} <ArrowRight className="w-4 h-4" />
                </a>
              ) : (
                <span className="text-base-400 font-semibold text-sm cursor-default">
                  {info.action}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Form & Map Split Section */}
      <section
        className="container mx-auto px-6 py-12 md:py-24 relative z-10"
        id="map-section"
      >
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-primary-900/5 border border-base-200 p-8 md:p-12 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-primary-950 mb-4">
                    Send Us a Message
                  </h2>
                  <p className="text-base-500">
                    We usually respond within 24 hours.
                  </p>
                </div>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary-900 mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-base-500 max-w-sm">
                      Thank you for reaching out. A member of our team will be in touch shortly.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-primary-900 ml-1">
                          Your Name
                        </label>
                        <Input
                          name="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="h-12 rounded-xl bg-base-50 border-transparent focus:bg-white transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-primary-900 ml-1">
                          Email Address
                        </label>
                        <Input
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="h-12 rounded-xl bg-base-50 border-transparent focus:bg-white transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-primary-900 ml-1">
                          Phone (Optional)
                        </label>
                        <Input
                          name="phone"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="h-12 rounded-xl bg-base-50 border-transparent focus:bg-white transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-primary-900 ml-1">
                          Subject
                        </label>
                        <Input
                          name="subject"
                          placeholder="Project Inquiry"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="h-12 rounded-xl bg-base-50 border-transparent focus:bg-white transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-primary-900 ml-1">
                        Message
                      </label>
                      <Textarea
                        name="message"
                        placeholder="Tell us about your project details, timeline, and requirements..."
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="min-h-[150px] resize-none rounded-xl bg-base-50 border-transparent focus:bg-white transition-all duration-300"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 rounded-xl text-lg font-medium bg-primary-900 hover:bg-primary-800 text-white shadow-xl shadow-primary-900/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>

          {/* Map Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 flex flex-col h-full gap-8"
          >
            <div className="flex-1 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary-900/5 border border-white/50 relative group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.002446777647!2d80.2079089759247!3d13.098971987228222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526430b0555555%3A0x6b80585d8847050!2sAnna%20Nagar%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1710925761000!5m2!1sen!2sin"
                className="w-full h-full min-h-[400px] bg-base-200 grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="PrintEmporium Location"
              />
              
              {/* Overlay Card */}
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg border border-white/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary-900">PrintEmporium HQ</h4>
                    <p className="text-sm text-base-500">Chennai, Tamil Nadu</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Box */}
            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-primary-900 to-primary-800 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -ml-10 -mb-10" />
               
               <div className="relative z-10">
                 <h3 className="text-xl font-bold mb-2">Need Immediate Help?</h3>
                 <p className="text-primary-100 mb-6 text-sm">Our support team is available 24/7 to assist with urgent queries.</p>
                 <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary-900 border-none">
                    <Phone className="w-4 h-4 mr-2" /> Call Support
                 </Button>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-6 py-12 md:py-24 max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold mb-6"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Common Questions</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold text-primary-950 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-base-600 max-w-2xl mx-auto">
            Find answers to the most common questions about our services and process.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>
      </section>

      <CTASection
        title="Ready to Transform Your Ideas?"
        description="Join hundreds of satisfied businesses who trust PrintEmporium for their premium printing needs."
        primaryButtonText="Get a Custom Quote"
        secondaryButtonText="Schedule Consultation"
      />
    </div>
  );
}
