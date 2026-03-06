'use client'

import { useEffect, useState, useRef } from 'react'
import { getCryptos, getSparkline, formatPrice, formatVolume, type CryptoAsset } from '@/lib/market-data'
import { TrendingUp, TrendingDown } from 'lucide-react'

/* =========================
   MiniSparkline Component
========================= */
interface MiniSparklineProps {
  symbol: string
  positive: boolean
}

function MiniSparkline({ symbol, positive }: MiniSparklineProps) {
  const [data, setData] = useState<number[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    const loadData = async () => {
      const chart = await getSparkline(symbol)
      setData(chart.map(c => c.price))
    }

    loadData()
    intervalRef.current = setInterval(loadData, 10000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [symbol])

  if (!data || data.length === 0)
    return <div className="w-[80px] h-[30px] bg-slate-800/20 rounded" />

  const max = Math.max(...data)
  const min = Math.min(...data)
  const height = 30
  const width = 80
  const points = data
    .map((price, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((price - min) / (max - min || 1)) * height
      return `${x},${y}`
    })
    .join(' ')

  const strokeColor = positive ? '#22c55e' : '#ef4444'

  return (
    <svg width={width} height={height}>
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* =========================
   CryptoBadge Component
========================= */
interface CryptoBadgeProps {
  change24h: number
}

function CryptoBadge({ change24h }: CryptoBadgeProps) {
  const positive = change24h >= 0
  const textColor = positive ? 'text-green-400' : 'text-red-400'
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${textColor} font-semibold text-sm`}>
      {positive ? <TrendingUp className={`w-4 h-4 ${textColor}`} /> : <TrendingDown className={`w-4 h-4 ${textColor}`} />}
      <span>{Math.abs(change24h).toFixed(2)}%</span>
    </div>
  )
}

/* =========================
   CryptoTable Component
========================= */
export function CryptoTable() {
  const [cryptos, setCryptos] = useState<CryptoAsset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const coins = await getCryptos()
        // Add image URL for each coin
        const coinsWithImages = coins.map((coin) => ({
          ...coin,
          image: `https://cryptoicons.org/api/icon/${coin.symbol.toLowerCase()}/200`
        }))
        setCryptos(coinsWithImages)
      } catch (err) {
        console.error('Failed loading market:', err)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="border border-slate-700 rounded-2xl bg-slate-900/60 p-10 text-center text-slate-400 shadow-inner">
        Loading market data...
      </div>
    )
  }

  return (
    <div className="border border-blue-500/20 rounded-2xl bg-slate-900/60 backdrop-blur-xl shadow-[0_0_40px_rgba(59,130,246,0.15)] overflow-x-auto relative z-10 container mx-auto px-6 pt-24 pb-16 lg:pt-32">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b border-slate-800 text-sm text-slate-400 uppercase tracking-wide">
            <th className="px-6 py-4 text-left">ASSET</th>
            <th className="px-6 py-4 text-right">PRICE</th>
            <th className="px-6 py-4 text-right">24H CHANGE</th>
            <th className="px-6 py-4 text-right">VOLUME</th>
            <th className="px-6 py-4 text-right">TREND</th>
          </tr>
        </thead>
        <tbody>
          {cryptos.map((coin) => {
            const positive = coin.change24h >= 0

            return (
              <tr
                key={coin.id}
                className="border-b border-slate-800 hover:bg-slate-800/30 transition-all duration-200"
              >
                {/* ASSET */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                      <img
                        src={coin.image}
                        alt={coin.symbol}
                        className="w-7 h-7 object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/generic.png"
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-white font-semibold">{coin.symbol}</div>
                      <div className="text-xs text-slate-400">/USDT</div>
                    </div>
                  </div>
                </td>

                {/* PRICE */}
                <td className="px-6 py-4 text-right font-semibold text-white">
                  {formatPrice(coin.price)}
                </td>

                {/* 24H CHANGE */}
                <td className="px-6 py-4 text-right font-semibold">
                  <CryptoBadge change24h={coin.change24h} />
                </td>

                {/* VOLUME */}
                <td className="px-6 py-4 text-right text-slate-400">
                  {formatVolume(coin.volume24h)}
                </td>

                {/* TREND SPARKLINE */}
                <td className="px-6 py-4 flex justify-end">
                  <MiniSparkline symbol={coin.symbol} positive={positive} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}