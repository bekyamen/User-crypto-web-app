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
    <div className="min-h-screen bg-slate-950 text-white py-8">
      <div className="w-full max-w-6xl mx-auto px-4">

       

        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-6">Live Market (Binance)</h1>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search pair (e.g. BTCUSDT)..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg"
          />
        </div>

        {/* Loading / Error / Table */}
        {loading && <p className="text-slate-400 mb-6">Loading market data...</p>}
        {error && <p className="text-red-400 mb-6">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto mb-12">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-3 text-left">Pair</th>
                  <th className="py-3 text-left">Price</th>
                  <th className="py-3 text-left">24h %</th>
                  <th className="py-3 text-left">High</th>
                  <th className="py-3 text-left">Low</th>
                  <th className="py-3 text-left">Volume</th>
                  <th className="py-3 text-left">Trade</th> {/* New column */}
                </tr>
              </thead>
              <tbody>
                {filteredCryptos.slice(0, 50).map((coin) => (
                  <tr
                    key={coin.symbol}
                    className="border-b border-slate-800 hover:bg-slate-900 transition"
                  >
                    <td className="py-3">{coin.symbol}</td>
                    <td className="py-3">${parseFloat(coin.lastPrice).toFixed(4)}</td>
                    <td className={`py-3 ${
                      parseFloat(coin.priceChangePercent) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {parseFloat(coin.priceChangePercent).toFixed(2)}%
                    </td>
                    <td className="py-3">${parseFloat(coin.highPrice).toFixed(4)}</td>
                    <td className="py-3">${parseFloat(coin.lowPrice).toFixed(4)}</td>
                    <td className="py-3">{parseFloat(coin.volume).toLocaleString()}</td>
                    {/* Trade Button */}
                    <td className="py-3">
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
        )}

        {/* Top Gainers */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-green-400 mb-4">Top Gainers</h2>
          {topGainers.map((coin) => (
            <div key={coin.symbol} className="flex justify-between py-2">
              <span>{coin.symbol}</span>
              <span className="text-green-400">{parseFloat(coin.priceChangePercent).toFixed(2)}%</span>
            </div>
          ))}
        </div>

        {/* Top Losers */}
        <div>
          <h2 className="text-xl font-bold text-red-400 mb-4">Top Losers</h2>
          {topLosers.map((coin) => (
            <div key={coin.symbol} className="flex justify-between py-2">
              <span>{coin.symbol}</span>
              <span className="text-red-400">{parseFloat(coin.priceChangePercent).toFixed(2)}%</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
