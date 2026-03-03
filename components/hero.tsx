'use client'
import { ArrowRight, Zap, TrendingUp, Shield, Diamond } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BitcoinOrbit } from '@/components/BitcoinOrbit';
import Link from 'next/link'

export function Hero() {
  return (
    <section className="max-w-7xl mx-auto">
      {/* Background gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 20% 50%, hsl(222 47% 14% / 0.8) 0%, transparent 70%)'
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 50% at 80% 60%, hsl(28 100% 55% / 0.05) 0%, transparent 70%)'
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-24 pb-16 lg:pt-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 badge-border rounded-full px-4 py-2">
              <span className="text-glow-blue text-lg">🔥</span>
              <span className="text-glow-blue text-sm font-medium">
                Trusted by 2M+ Traders Worldwide
              </span>
            </div>

            {/* Title */}
              {/* Hero Text */}
      <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight text-center drop-shadow-[0_0_25px_rgba(255,204,0,0.8)]">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-gradient-x">
          Trade
        </span>{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-gradient-x delay-150">
          Smarter
        </span>
        <span className="text-foreground">,</span>
        <br />
        <span className="text-white italic font-extrabold drop-shadow-lg">
          Not Harder
        </span>
      </h1>

            {/* Orange underline */}
            <div className="w-40 h-1 rounded-full bg-primary" />

            {/* Subtitle */}
            <p className="text-muted-foreground text-lg max-w-lg leading-relaxed">
              Professional trading platform for cryptocurrencies, forex, and commodities with{' '}
              <span className="text-glow-blue font-medium">institutional-grade tools</span> and{' '}
              <span className="text-glow-blue font-medium">lightning-fast execution</span>.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 gap-2 rounded-lg">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
               <Link href="/demo"> 
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary/50 font-semibold px-8 rounded-lg">
                Try Demo Account
              </Button>
               </Link>
            </div>

            {/* Feature Chips */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="feature-chip">
                <Diamond className="w-4 h-4 text-primary" />
                Low minimum deposit
              </div>
              <div className="feature-chip">
                <Zap className="w-4 h-4 text-primary" />
                Instant execution
              </div>
              <div className="feature-chip">
                <TrendingUp className="w-4 h-4 text-primary" />
                24/7 support
              </div>
              <div className="feature-chip">
                <Shield className="w-4 h-4 text-primary" />
                Bank-level security
              </div>
            </div>
          </div>

          {/* Right - Bitcoin Visualization */}
          <div className="flex items-center justify-center lg:justify-end" style={{ animationDelay: '0.3s' }}>
            <BitcoinOrbit />
          </div>
        </div>
      </div>
    </section>
  );
}
