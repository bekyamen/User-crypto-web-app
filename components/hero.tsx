'use client';
import { motion } from "framer-motion";
import Link from 'next/link';
import { ArrowRight, BarChart3, Shield, Zap, Headphones, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import CryptoOrbit from "@/components/CryptoOrbit";

const badges = [
  { icon: Shield, label: "Low minimum deposit" },
  { icon: Zap, label: "Instant execution" },
  { icon: Headphones, label: "24/7 support" },
  { icon: Shield, label: "Bank-level security" },
];

const stats = [
  { value: "2M+", label: "Active Traders" },
  { value: "$50B+", label: "Trading Volume" },
  { value: "99.9%", label: "Uptime" },
];

const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-32">
      {/* Ambient glow blobs */}
     

      <div className="container relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left Content */}


         <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Trust Badge */}
        <motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
  className="mb-8 inline-flex items-center gap-2 rounded-full  bg-primary/10 px-4 py-2 text-sm text-primary shadow-[0_0_20px_hsl(var(--primary)/0.15)]"
>
  {/* Rotating Shield Icon */}
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
    className="inline-flex items-center justify-center"
  >
    <Shield className="h-6 w-6 text-primary drop-shadow-[0_0_6px_hsl(var(--primary))]" />
  </motion.div>

  {/* Badge Text */}
  Trusted by 2M+ Traders Worldwide
</motion.div>

          {/* Heading */}
          <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            <span className="text-gradient-hero">Trade</span>
            <br />
            <span className="text-gradient-hero">Smarter,</span>
            <br />
            <span className="text-foreground">Not Harder</span>
          </h1>

          {/* Underline accent */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-6 h-1 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.6)]"
          />

          {/* Description */}
          <p className="mb-8 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Professional trading platform for cryptocurrencies, forex, and commodities with{" "}
            <span className="text-primary font-medium">institutional-grade tools</span> and{" "}
            <span className="text-accent font-medium">lightning-fast execution</span>.
          </p>

          {/* Feature Badges with glow */}
         <div className="mb-8 flex flex-wrap gap-3">
  {badges.map((badge, i) => (
    <motion.div
      key={badge.label}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + i * 0.1 }}
      className="badge-glow glass-card flex cursor-default items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground"
    >
      <badge.icon className="h-4 w-4 text-primary drop-shadow-[0_0_6px_hsl(217_91%_60%/0.6)]" />
      {badge.label}
    </motion.div>
  ))}
</div>

          {/* CTA Buttons */}
         <div className="mb-12 flex flex-wrap gap-4">
  {/* Primary Button */}
  <Link href="/register">
  <Button
    size="lg"
    className="px-12 py-6 text-lg bg-secondary hover:bg-secondary/90 
               text-secondary-foreground rounded-full shadow-[0_0_30px_rgba(249,115,22,0.4),0_0_60px_rgba(249,115,22,0.15)] transition-all duration-300"
  >
    Get Started Free <ArrowRight className="ml-2 h-6 w-6" />
  </Button>
  </Link>

  {/* Outline Button */}
   <Link href="/demo">
  <Button
    variant="outline"
    size="lg"
    className="px-12 py-6 text-lg border-blue-500 text-blue-500 
               hover:bg-blue-500/10 rounded-full transition-all duration-300"
  >
    <BarChart3 className="mr-2 h-6 w-6" /> Try Demo Account
  </Button>
   </Link>
</div>

          {/* Stats with glow */}
        <div className="flex gap-6 justify-between">
  {stats.map((stat, i) => (
    <motion.div
      key={stat.label}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + i * 0.15 }}
      className="flex-1 rounded-xl border border-transparent bg-card/60 px-10 py-8 text-center backdrop-blur-sm transition-all duration-300 stat-glow"
      style={{
        borderImage: "linear-gradient(90deg, #3b82f6, #a855f7) 1",
      }}
    >
      <div className="text-4xl font-bold text-primary drop-shadow-[0_0_14px_hsl(217_91%_60%/0.7)]">
        {stat.value}
      </div>
      <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
    </motion.div>
  ))}
</div>
        </motion.div>

        {/* Right — Crypto Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="hidden items-center justify-center lg:flex"
        >
          <CryptoOrbit />
        </motion.div>
      </div>
      
      
      {/* Scroll indicator */}
      <motion.a
  href="#next-section"
  onClick={(e) => {
    e.preventDefault();
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  }}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 1.5 }}
  className="absolute bottom-8 left-1/2 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-3 pt-4"
>
  <span className="text-sm text-muted-foreground">
    Scroll to explore
  </span>
  {/* Mouse scroll icon */}
  <motion.div
    animate={{ y: [0, 6, 0] }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    className="relative flex h-10 w-6 items-start justify-center rounded-full border-2 border-primary/40 p-1 shadow-[0_0_12px_hsl(var(--primary)/0.3),0_0_24px_hsl(var(--primary)/0.1)]"
  >
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.8),0_0_16px_hsl(var(--primary)/0.4)]"
    />
  </motion.div>
</motion.a>
    </section>
  );
};

export default HeroSection;
