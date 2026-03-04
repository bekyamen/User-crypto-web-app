'use client'
import { ArrowRight, Zap, TrendingUp, Shield, Diamond } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BitcoinOrbit } from '@/components/BitcoinOrbit';
import Link from 'next/link'

export function Hero() {
  return (
    <section className="max-w-7xl mx-auto">
      {/* Background gradients */}
     
     {/* Background gradients */}
<div className="absolute inset-0 -z-10 overflow-hidden">

  {/* Base dark radial (keep depth) */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_50%,rgba(30,41,59,0.6),transparent_70%)]" />

  {/* Soft blue glow */}
  <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] 
    bg-blue-600/20 
    rounded-full 
    blur-[140px] 
    opacity-40" />

  {/* Soft purple glow */}
  <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] 
    bg-purple-600/20 
    rounded-full 
    blur-[160px] 
    opacity-30" />

  {/* Very subtle center blend */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5" />

</div>
      <div className="relative z-10 container mx-auto px-6 pt-24 pb-16 lg:pt-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
             <div className="flex flex-col items-start space-y-6">
  
  <div className="inline-flex items-center gap-2 badge-border rounded-full px-4 py-2">
    <span className="text-glow-blue text-lg">🔥</span>
    <span className="text-glow-blue text-sm font-medium">
      Trusted by 2M+ Traders Worldwide
    </span>
  </div>

 <h1 className="font-display
  text-5xl md:text-6xl lg:text-7xl xl:text-8xl
  font-extralight tracking-normal leading-[1.12] text-left">

  <span className="bg-clip-text text-transparent 
    bg-gradient-to-r from-yellow-300/80 via-orange-400/80 to-red-400/80
    animate-gradient-x">
    Trade
  </span>{' '}

  <span className="bg-clip-text text-transparent 
    bg-gradient-to-r from-yellow-300/80 via-orange-400/80 to-red-400/80
    animate-gradient-x delay-150">
    Smarter
  </span>

  <span className="text-white/60">,</span>

  <br />

  <span className="text-white/70 italic font-light">
    Not Harder
  </span>
</h1>

</div>     

            {/* Title */}
              {/* Hero Text */}
     

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
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white font-semibold px-8 rounded-lg">
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
