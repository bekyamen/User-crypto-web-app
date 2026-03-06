'use client'

import { ArrowRight, Zap, TrendingUp, Shield, Diamond, Users, DollarSign, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BitcoinOrbit } from '@/components/BitcoinOrbit';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function Hero() {
  const stats = [
    { icon: Users, value: '2M+', label: 'Active Traders', color: 'text-blue-400' },
    { icon: DollarSign, value: '$50B+', label: 'Trading Volume', color: 'text-orange-400' },
    { icon: CheckCircle, value: '99.9%', label: 'Uptime', color: 'text-green-400' },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_50%,rgba(30,41,59,0.6),transparent_70%)]" />
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[140px] opacity-40" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[160px] opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5" />
      </div>

      <div className="relative z-10  pt-24 pb-16 lg:pt-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          
          <div className="relative">

  {/* Blue Glow Background */}
  <div className="absolute -z-10 -left-20 top-10 w-[500px] h-[500px] 
  bg-blue-500/20 blur-[140px] rounded-full opacity-60" />

  <div className="space-y-8 animate-fade-in">

    <div className="flex flex-col items-start space-y-6">
      <div className="inline-flex items-center gap-2 badge-border rounded-full px-4 py-2">
        <span className="text-glow-blue text-lg">🔥</span>
        <span className="text-glow-blue text-sm font-medium">
          Trusted by 2M+ Traders Worldwide
        </span>
      </div>

      <div className="space-y-4">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
          <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-orange-500 bg-clip-text text-transparent animate-pulse">
            Trade
          </span>
          <br />
          <span
            className="bg-gradient-to-r from-yellow-300 via-orange-400 to-orange-500 bg-clip-text text-transparent animate-pulse"
            style={{ animationDelay: '0.3s' }}
          >
            Smarter
          </span>
          <span className="text-white">,</span>
          <br />
          <span className="text-white/80 italic font-light">
            Not Harder
          </span>
        </h1>
      </div>
    </div>

    <div className="w-40 h-1 rounded-full bg-primary" />

    <p className="text-muted-foreground text-lg max-w-lg leading-relaxed">
      Professional trading platform for cryptocurrencies, forex, and commodities with{' '}
      <span className="text-glow-blue font-medium">institutional-grade tools</span> and{' '}
      <span className="text-glow-blue font-medium">lightning-fast execution</span>.
    </p>

    <div className="flex flex-wrap gap-4">
      <Button
        size="lg"
        className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white font-semibold px-8 rounded-lg flex items-center gap-2"
      >
        Get Started Free
        <ArrowRight className="w-4 h-4" />
      </Button>

      <Link href="/demo">
        <Button
          size="lg"
          variant="outline"
          className="border-border text-foreground hover:bg-secondary/50 font-semibold px-8 rounded-lg"
        >
          Try Demo Account
        </Button>
      </Link>
    </div>

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
</div>

          {/* Right - Bitcoin Visualization */}
          <div className="flex flex-col lg:items-end gap-10">
            <div className="flex items-center justify-center lg:justify-end" style={{ animationDelay: '0.3s' }}>
              <BitcoinOrbit />
            </div>

            {/* Stats Cards */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ staggerChildren: 0.15 }}
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, translateY: -4 }}
                    className="flex flex-col items-start gap-3 p-6 bg-slate-900/70 border border-slate-700 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <Icon className={`w-10 h-10 ${stat.color}`} />
                    <div className={`text-3xl sm:text-4xl font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-slate-400 text-sm">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}