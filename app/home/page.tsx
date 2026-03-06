'use client'

import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from "next/navigation"

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  ArrowDown,
  ArrowUp,
  Zap,
  MessageCircle,
} from 'lucide-react'

// Type for fetched Binance data
interface BinanceTicker {
  symbol: string
  lastPrice: string
  priceChangePercent: string
}

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login')
  }, [status, router])

  if (status === 'loading' || !session) return null

  const [balance, setBalance] = useState<number | null>(null)
  const [showBalance, setShowBalance] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [tickers, setTickers] = useState<BinanceTicker[]>([])

  const carouselSlides = [
    { title: "Secure & Fast Transactions", description: "Deposit and withdraw funds instantly with bank-level security", image: "/sliderone.jpg" },
    { title: "24/7 Market Access", description: "Trade cryptocurrencies anytime with real-time market data", image: "/slidertwo.jpg" },
    { title: "Advanced Trading Tools", description: "Professional charts and analytics for informed decisions", image: "/sliderthree.jpg" },
  ]

  // Fetch user balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = session?.accessToken
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        setBalance(data?.data?.balance ?? 0)
      } catch { setBalance(0) }
    }
    fetchBalance()
  }, [session])

  // Fetch Binance tickers
  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/24hr')
        const data: BinanceTicker[] = await res.json()
        setTickers(data.filter(t => t.symbol.endsWith('USDT')).slice(0, 20))
      } catch {}
    }
    fetchTickers()
    const interval = setInterval(fetchTickers, 60000)
    return () => clearInterval(interval)
  }, [])

  // Carousel auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const prevSlide = () => setCarouselIndex((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)
  const nextSlide = () => setCarouselIndex((prev) => (prev + 1) % carouselSlides.length)
  const goToSlide = (index: number) => setCarouselIndex(index)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Carousel */}
        <div className="relative mb-12 overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-[#0b1220] to-[#0f1a2e]">
          <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${carouselIndex * 100}%)` }}>
            {carouselSlides.map((slide, index) => (
              <div key={index} className="min-w-full grid md:grid-cols-2 items-center">
                <div className="relative h-64 md:h-[320px]">
                  <img src={slide.image} alt="slide" className="w-full h-full object-cover md:rounded-l-2xl" />
                </div>
                <div className="p-6 md:p-10 text-left">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">{slide.title}</h2>
                  <p className="text-slate-400">{slide.description}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={prevSlide} className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md p-2 rounded-full hover:bg-black/60 transition">
            <ChevronLeft className="w-4 md:w-5 h-4 md:h-5 text-white" />
          </button>
          <button onClick={nextSlide} className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md p-2 rounded-full hover:bg-black/60 transition">
            <ChevronRight className="w-4 md:w-5 h-4 md:h-5 text-white" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {carouselSlides.map((_, idx) => (
              <button key={idx} onClick={() => goToSlide(idx)} className={`w-2.5 h-2.5 rounded-full transition ${idx === carouselIndex ? 'bg-blue-500 scale-110' : 'bg-slate-600'}`} />
            ))}
          </div>
        </div>

        {/* Balance Section */}
              {/* ===== Balance Card Section ===== */}
  <div className="lg:col-span-5 w-full max-w-md sm:max-w-lg lg:max-w-full mx-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-slate-700/50 p-6 sm:p-8">
    
    {/* Balance Header */}
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
      <div className="flex-1">
        <p className="text-slate-400 text-sm mb-1">AVAILABLE BALANCE</p>
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="text-3xl sm:text-4xl font-bold text-white">
            {showBalance ? balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '••••'}
          </h3>
          <span className="text-slate-400">USDT</span>
        </div>
        <p className="text-slate-400 text-sm mt-1 sm:mt-2">Welcome back, {session.user?.email ?? 'User'}</p>
      </div>

      <button 
        onClick={() => setShowBalance(!showBalance)} 
        className="mt-4 md:mt-0 p-2 hover:bg-slate-700/50 rounded-lg transition"
      >
        {showBalance ? <EyeOff className="w-5 h-5 text-slate-400" /> : <Eye className="w-5 h-5 text-slate-400" />}
      </button>
    </div>

    {/* Action Buttons */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <Link href="/assets/deposit" className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-slate-800/50 transition group">
        <div className="w-10 h-10 rounded-full border-2 border-slate-600 flex items-center justify-center group-hover:border-blue-400 transition">
          <ArrowDown className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
        </div>
        <span className="text-slate-400 text-xs text-center">Deposit</span>
      </Link>

      <Link href="/assets/transfer" className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-slate-800/50 transition group">
        <div className="w-10 h-10 rounded-full border-2 border-slate-600 flex items-center justify-center group-hover:border-blue-400 transition">
          <Zap className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
        </div>
        <span className="text-slate-400 text-xs text-center">Transfer</span>
      </Link>

      <Link href="/assets/withdraw" className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-slate-800/50 transition group">
        <div className="w-10 h-10 rounded-full border-2 border-slate-600 flex items-center justify-center group-hover:border-blue-400 transition">
          <ArrowUp className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
        </div>
        <span className="text-slate-400 text-xs text-center">Withdraw</span>
      </Link>

      <Link href="/demo" className="flex flex-col items-center gap-3 p-3 sm:p-4 rounded-lg hover:bg-slate-800/50 transition group">
        <div className="w-12 h-12 rounded-full border-2 border-slate-600 flex items-center justify-center group-hover:border-blue-400 transition">
          <MessageCircle className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
        </div>
        <span className="text-slate-400 text-xs text-center">Demo</span>
      </Link>
    </div>
  </div>



        {/* Market Overview */}
        <div className="overflow-x-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Market Overview</h2>
            <p className="text-slate-400">Real-time cryptocurrency prices and trends</p>
          </div>
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400">#</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400">NAME</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400">PRICE</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400">24H CHANGE</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {tickers.map((coin, index) => (
                <tr key={coin.symbol} className="border-b border-slate-700/30 hover:bg-slate-800/50 transition">
                  <td className="px-4 py-2 text-slate-400 text-sm">{index + 1}</td>
                  <td className="px-4 py-2 text-white font-medium text-sm">{coin.symbol}</td>
                  <td className="px-4 py-2 text-white font-medium text-sm">${parseFloat(coin.lastPrice).toFixed(2)}</td>
                  <td className={`px-4 py-2 text-sm font-medium ${parseFloat(coin.priceChangePercent) >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                    {parseFloat(coin.priceChangePercent).toFixed(2)}%
                  </td>
                  <td className="px-4 py-2">
                    <button onClick={() => router.push(`/trade?pair=${coin.symbol}`)} className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm transition">Trade</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  )
}