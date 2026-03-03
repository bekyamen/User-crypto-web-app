'use client'

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState, useMemo } from 'react'
import { Search, HelpCircle, Settings, User, LogOut } from 'lucide-react'
import { useRouter, usePathname } from "next/navigation"
import { signOut } from 'next-auth/react'
import NotificationDropdown from '@/components/NotificationDropdown'


type Crypto = {
  symbol: string
  lastPrice: string
  priceChangePercent: string
  highPrice: string
  lowPrice: string
  volume: string
}

export default function MarketPage() {
  const pathname = usePathname()
  const router = useRouter()

  const linkClass = (path: string) =>
    `transition ${
      pathname === path
        ? "text-blue-400 font-semibold"
        : "text-slate-400 hover:text-white"
    }`

  // ---------------- Sign Out ----------------
  const handleSignOut = () => {
    signOut({ redirect: false })
    router.push('/login')
  }

  // ---------------- State ----------------
  const [cryptos, setCryptos] = useState<Crypto[]>([])
  const [filteredCryptos, setFilteredCryptos] = useState<Crypto[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ---------------- Fetch Market ----------------
  const fetchMarket = async () => {
    try {
      setError(null)
      const res = await fetch('/api/market/binance')
      const data = await res.json()

      if (res.ok && Array.isArray(data)) {
        setCryptos(data)
        setFilteredCryptos(data)
      } else {
        setCryptos([])
        setFilteredCryptos([])
        setError('Failed to load market data.')
      }
    } catch (err) {
      console.error('Market fetch error:', err)
      setCryptos([])
      setFilteredCryptos([])
      setError('Connection error.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMarket()
    const interval = setInterval(fetchMarket, 10000)
    return () => clearInterval(interval)
  }, [])

  // ---------------- Search ----------------
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    const filtered = cryptos.filter((coin) =>
      coin.symbol.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredCryptos(filtered)
  }

  // ---------------- Sorting ----------------
  const sortedByChange = useMemo(() => {
    if (!Array.isArray(cryptos)) return []
    return [...cryptos].sort(
      (a, b) =>
        parseFloat(b.priceChangePercent) -
        parseFloat(a.priceChangePercent)
    )
  }, [cryptos])

  const topGainers = sortedByChange.slice(0, 5)
  const topLosers = sortedByChange.slice(-5).reverse()

 return (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1e293b,_#020617_70%)] text-white py-10">
    <div className="w-full max-w-7xl mx-auto px-6">

      {/* Hero Title */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Live Crypto Market
        </h1>
        <p className="text-slate-400 mt-2">
          Real-time data powered by Binance
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-10">
        <Search className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
        <input
          type="text"
          placeholder="Search trading pair (e.g. BTCUSDT)"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
        />
      </div>

      {/* Top Movers Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">

        {/* Gainers */}
        <div className="bg-white/5 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-green-400 mb-6">
            🚀 Top Gainers
          </h2>
          <div className="space-y-4">
            {topGainers.map((coin) => (
              <div
                key={coin.symbol}
                className="flex justify-between items-center p-4 rounded-xl bg-white/5 hover:bg-green-500/10 transition"
              >
                <span className="font-medium">{coin.symbol}</span>
                <span className="text-green-400 font-semibold">
                  +{parseFloat(coin.priceChangePercent).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Losers */}
        <div className="bg-white/5 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-red-400 mb-6">
            🔻 Top Losers
          </h2>
          <div className="space-y-4">
            {topLosers.map((coin) => (
              <div
                key={coin.symbol}
                className="flex justify-between items-center p-4 rounded-xl bg-white/5 hover:bg-red-500/10 transition"
              >
                <span className="font-medium">{coin.symbol}</span>
                <span className="text-red-400 font-semibold">
                  {parseFloat(coin.priceChangePercent).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Table */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">

        {loading && (
          <p className="text-slate-400">Loading market data...</p>
        )}

        {error && (
          <p className="text-red-400">{error}</p>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-white/10">
                  <th className="py-4 text-left">Pair</th>
                  <th className="py-4 text-left">Price</th>
                  <th className="py-4 text-left">24h %</th>
                  <th className="py-4 text-left">High</th>
                  <th className="py-4 text-left">Low</th>
                  <th className="py-4 text-left">Volume</th>
                  <th className="py-4 text-left">Trade</th>
                </tr>
              </thead>
              <tbody>
                {filteredCryptos.slice(0, 50).map((coin) => {
                  const change = parseFloat(coin.priceChangePercent)
                  const isUp = change >= 0

                  return (
                    <tr
                      key={coin.symbol}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="py-4 font-medium">
                        {coin.symbol}
                      </td>

                      <td className="py-4">
                        ${parseFloat(coin.lastPrice).toFixed(4)}
                      </td>

                      <td
                        className={`py-4 font-semibold ${
                          isUp
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {isUp ? "+" : ""}
                        {change.toFixed(2)}%
                      </td>

                      <td className="py-4">
                        ${parseFloat(coin.highPrice).toFixed(4)}
                      </td>

                      <td className="py-4">
                        ${parseFloat(coin.lowPrice).toFixed(4)}
                      </td>

                      <td className="py-4">
                        {parseFloat(coin.volume).toLocaleString()}
                      </td>

                      <td className="py-4">
                        <button
                          onClick={() =>
                            router.push(`/trade?pair=${coin.symbol}`)
                          }
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition shadow-md"
                        >
                          Trade
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  </div>
)
}
