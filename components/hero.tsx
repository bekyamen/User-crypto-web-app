'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, TrendingUp, Shield } from 'lucide-react'

export function Hero() {
  const [dots, setDots] = useState<any[]>([])

  // Generate orbit dots only on client
  useEffect(() => {
    const generatedDots = [...Array(8)].map((_, i) => ({
      id: i,
      angle: (i / 8) * 360,
      speed: 8 + Math.random() * 4, // orbit duration
      scaleMin: 0.8 + Math.random() * 0.2,
      scaleMax: 1.2 + Math.random() * 0.3,
      radiusX: 6 + Math.random() * 2,
      radiusY: 5 + Math.random() * 2,
      size: 0.75 + Math.random() * 0.25
    }))
    setDots(generatedDots)
  }, [])

  // Don't render until dots are ready to prevent SSR mismatch
  if (dots.length === 0) return null

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto text-center mb-12">
        {/* Trusted badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-6">
          <Zap className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-blue-400 font-medium">
            Trusted by 2M+ Traders Worldwide
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
          <span className="text-slate-100">Trade </span>
          <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
            Smarter
          </span>
          <span className="text-slate-100">, </span>
          <span className="text-slate-400">Not Harder</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
          Professional trading platform for cryptocurrencies, forex, and commodities with{' '}
          <span className="text-blue-400 font-semibold">institutional-grade tools</span> and{' '}
          <span className="text-orange-400 font-semibold">lightning-fast execution</span>.
        </p>

        {/* Hero Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link href="/register">
            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-6 text-lg">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/demo">
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-6 text-lg bg-transparent"
            >
              Try Demo Account
            </Button>
          </Link>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto mb-16">
          <div className="flex flex-col items-center">
            <Zap className="w-6 h-6 text-blue-400 mb-2" />
            <span className="text-xs text-slate-400">Low minimum deposit</span>
          </div>
          <div className="flex flex-col items-center">
            <TrendingUp className="w-6 h-6 text-orange-400 mb-2" />
            <span className="text-xs text-slate-400">Instant execution</span>
          </div>
          <div className="flex flex-col items-center">
            <Shield className="w-6 h-6 text-green-400 mb-2" />
            <span className="text-xs text-slate-400">24/7 support</span>
          </div>
          <div className="flex flex-col items-center">
            <TrendingUp className="w-6 h-6 text-purple-400 mb-2" />
            <span className="text-xs text-slate-400">Bank-level security</span>
          </div>
        </div>

        {/* Bitcoin Visualization */}
         <div className="relative max-w-4xl mx-auto flex items-center justify-center py-20">

  {/* Background Glow */}
  <div className="absolute w-[420px] h-[420px] bg-blue-600/20 blur-3xl rounded-full animate-pulse" />

  <div className="relative w-80 h-80 flex items-center justify-center">

    {/* Rotating Gradient Ring */}
    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 via-sky-400 to-indigo-500 p-[2px] animate-[spin_18s_linear_infinite]">
      <div className="w-full h-full bg-slate-950 rounded-full backdrop-blur-xl border border-slate-800" />
    </div>

    {/* Orbit Container */}
    <div className="absolute inset-0 animate-[spin_30s_linear_infinite]">

      {dots.map((dot, index) => (
        <div
          key={dot.id}
          className="absolute top-1/2 left-1/2 origin-center"
          style={{
            transform: `rotate(${index * (360 / dots.length)}deg) translate(150px)`
          }}
        >
          <div
            className="rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-500/40 animate-float"
            style={{
              width: `${dot.size * 0.8}rem`,
              height: `${dot.size * 0.8}rem`,
              animationDuration: `${dot.speed}s`
            }}
          />
        </div>
      ))}
    </div>

    {/* Center Coin */}
    <div className="relative z-10 flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-2xl shadow-yellow-500/40 animate-[spin_10s_linear_infinite]">
      <span className="text-5xl font-extrabold text-white drop-shadow-lg">
        ₿
      </span>
    </div>

    

    {/* Floating XRP Badge */}
    <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-2xl bg-gradient-to-br from-blue-400 to-sky-600 animate-bounce-slow">
      XRP
    </div>

  </div>
         </div>
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        ${dots
          .map(
            dot => `
          @keyframes orbit${dot.id} {
            0% { transform: rotate(${dot.angle}deg) translate(${dot.radiusX}rem, ${dot.radiusY}rem) rotate(-${dot.angle}deg); }
            100% { transform: rotate(${dot.angle + 360}deg) translate(${dot.radiusX}rem, ${dot.radiusY}rem) rotate(-${dot.angle + 360}deg); }
          }
          @keyframes pulse${dot.id} {
            0%,100% { transform: scale(${dot.scaleMin}); }
            50% { transform: scale(${dot.scaleMax}); }
          }
        `
          )
          .join('\n')}
      `}</style>
    </section>
  )
}
