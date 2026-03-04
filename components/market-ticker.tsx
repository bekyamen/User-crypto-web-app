'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface TickerData {
  symbol: string
  price: number
  change24h: number
}

const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'SOLUSDT']

const logoMap: Record<string, string> = {
  BTCUSDT: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
  ETHUSDT: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  BNBUSDT: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
  XRPUSDT: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
  SOLUSDT: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
}

export function MarketTicker() {
  const [data, setData] = useState<TickerData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr`
        )
        const all = await res.json()

        const filtered = all
          .filter((item: any) => SYMBOLS.includes(item.symbol))
          .map((item: any) => ({
            symbol: item.symbol,
            price: parseFloat(item.lastPrice),
            change24h: parseFloat(item.priceChangePercent),
          }))

        // Duplicate for seamless infinite loop
        setData([...filtered, ...filtered])
      } catch (err) {
        console.error('Binance ticker error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTickers()
    const interval = setInterval(fetchTickers, 20000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">

      {/* Fade Edges */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-slate-950 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-slate-950 to-transparent z-10" />

      <div className="flex whitespace-nowrap animate-ticker">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-8 py-3 animate-pulse"
              >
                <div className="h-6 w-6 bg-slate-700 rounded-full" />
                <div className="h-4 w-20 bg-slate-700 rounded" />
                <div className="h-4 w-12 bg-slate-700 rounded" />
              </div>
            ))
          : data.map((item, index) => {
              const isUp = item.change24h >= 0

              return (
                <div
                  key={index}
                  className="flex items-center gap-4 px-10 py-3 border-r border-slate-800/50"
                >
                  {/* Logo */}
                  <Image
                    src={logoMap[item.symbol]}
                    alt={item.symbol}
                    width={26}
                    height={26}
                  />

                  {/* Symbol */}
                  <span className="font-semibold text-white tracking-wide">
                    {item.symbol.replace('USDT', '')}
                  </span>

                  {/* Price */}
                  <span className="text-slate-300 font-medium">
                    $
                    {item.price.toLocaleString('en-US', {
                      maximumFractionDigits: item.price > 1000 ? 0 : 3,
                    })}
                  </span>

                  {/* Change */}
                  <span
                    className={`flex items-center gap-1 text-sm font-semibold ${
                      isUp ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isUp ? (
                      <TrendingUp size={14} />
                    ) : (
                      <TrendingDown size={14} />
                    )}
                    {Math.abs(item.change24h).toFixed(2)}%
                  </span>
                </div>
              )
            })}
      </div>

      {/* Animation Style */}
      <style jsx>{`
        .animate-ticker {
          animation: ticker-scroll 25s linear infinite;
        }

        @keyframes ticker-scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  )
}