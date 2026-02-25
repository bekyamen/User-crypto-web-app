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
  Settings,
  Bell,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// Type for fetched Binance data
interface BinanceTicker {
  symbol: string
  lastPrice: string
  priceChangePercent: string
}

export default function HomePage() {
  const pathname = usePathname()
  const linkClass = (path: string) =>
    `transition ${
      pathname === path
        ? "text-blue-400 font-semibold"
        : "text-slate-400 hover:text-white"
    }`

    const [balance, setBalance] = useState<number | null>(null)

  const { data: session } = useSession()
  const router = useRouter()

  const [showBalance, setShowBalance] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const [tickers, setTickers] = useState<BinanceTicker[]>([])

  const carouselSlides = [
    { title: 'Secure & Fast Transactions', description: 'Deposit and withdraw funds instantly with bank-level security' },
    { title: '24/7 Market Access', description: 'Trade cryptocurrencies anytime with real-time market data' },
    { title: 'Advanced Trading Tools', description: 'Professional charts and analytics for informed decisions' },
  ]

  const notifications: { id: number; message: string }[] = [] // empty notifications

  const handleSignOut = () => {
    signOut({ redirect: false })
    router.push('/login')
  }

  // Close notifications panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])


  useEffect(() => {
  const fetchBalance = async () => {
    if (!session?.user) return
    try {
      const token = session?.accessToken // if you store JWT in session
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (data.success && data.data?.balance !== undefined) {
        setBalance(Number(data.data.balance))
      }
    } catch (err) {
      console.error('Failed to fetch balance:', err)
      setBalance(0)
    }
  }

  fetchBalance()
}, [session])



  // Fetch Binance tickers
  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/24hr')
        const data: BinanceTicker[] = await res.json()
        // Filter only USDT pairs for simplicity
        const usdtPairs = data.filter(t => t.symbol.endsWith('USDT'))
        setTickers(usdtPairs.slice(0, 20)) // limit to top 20
      } catch (err) {
        console.error('Error fetching Binance data:', err)
      }
    }

    fetchTickers()
    const interval = setInterval(fetchTickers, 60000) // refresh every 60s
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Carousel */}
        <div className="relative mb-12">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg border border-slate-700/50 p-8 min-h-[280px] flex flex-col justify-center items-center relative overflow-hidden">
            <button
              onClick={() => setCarouselIndex((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-700/50 rounded-lg transition"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <div className="text-center">
              <h2 className="text-3xl font-bold text-blue-400 mb-2">{carouselSlides[carouselIndex].title}</h2>
              <p className="text-slate-400">{carouselSlides[carouselIndex].description}</p>
            </div>

            <button
              onClick={() => setCarouselIndex((prev) => (prev + 1) % carouselSlides.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-700/50 rounded-lg transition"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            <div className="absolute bottom-4 flex gap-2">
              {carouselSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCarouselIndex(index)}
                  className={`w-2 h-2 rounded-full transition ${index === carouselIndex ? 'bg-blue-500' : 'bg-slate-600'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Balance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="w-[1220px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-slate-700/50 p-8">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <p className="text-slate-400 text-sm mb-2">AVAILABLE BALANCE</p>
                  <div className="flex items-baseline gap-2">
                   <h3 className="text-4xl font-bold text-white">
                    {showBalance
                     ? balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                      : '••••'}
                       </h3>

                    <span className="text-slate-400">USD</span>
                  </div>
                  <p className="text-blue-400 text-sm mt-2">Welcome back, {session?.user?.email ?? 'User'}</p>
                </div>
                <button onClick={() => setShowBalance(!showBalance)} className="p-2 hover:bg-slate-700/50 rounded-lg transition">
                  {showBalance ? <EyeOff className="w-5 h-5 text-slate-400" /> : <Eye className="w-5 h-5 text-slate-400" />}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-4 gap-4">
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

                <Link href="/demo" className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-slate-800/50 transition group">
                  <div className="w-12 h-12 rounded-full border-2 border-slate-600 flex items-center justify-center group-hover:border-blue-400 transition">
                    <MessageCircle className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
                  </div>
                  <span className="text-slate-400 text-xs">Demo</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Market Overview */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Market Overview</h2>
            <p className="text-slate-400">Real-time cryptocurrency prices and trends</p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-slate-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400">#</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400">NAME</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400">PRICE</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400">24H CHANGE</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {tickers.map((coin, index) => (
                    <tr key={coin.symbol} className="border-b border-slate-700/30 hover:bg-slate-800/50 transition">
                      <td className="px-6 py-4 text-slate-400 text-sm">{index + 1}</td>
                      <td className="px-6 py-4 text-white font-medium text-sm">{coin.symbol}</td>
                      <td className="px-6 py-4 text-white font-medium text-sm">${parseFloat(coin.lastPrice).toFixed(2)}</td>
                      <td className={`px-6 py-4 text-sm font-medium ${parseFloat(coin.priceChangePercent) >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                        {parseFloat(coin.priceChangePercent).toFixed(2)}%
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => router.push(`/trade?pair=${coin.symbol}`)}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm transition"
                        >
                          Trade
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
