'use client'

import { useEffect, useState } from 'react'
import { getCryptos, formatPrice, formatMarketCap, type CryptoAsset } from '@/lib/market-data'
import Image from 'next/image'
import { TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'

export function CryptoTable() {
  const [cryptos, setCryptos] = useState<CryptoAsset[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCryptos()
        setCryptos(data)
      } catch (error) {
        console.error('Failed to fetch cryptos:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="border border-slate-700 rounded-lg bg-slate-900/50 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400">Loading market data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-slate-700 rounded-lg bg-slate-900/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">ASSET</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">PRICE</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">24H CHANGE</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">MARKET CAP</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">VOLUME (24H)</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">CHART</th>
            </tr>
          </thead>
          <tbody>
            {cryptos.map((crypto, index) => (
              <tr
                key={crypto.id}
                className={`border-b border-slate-700 hover:bg-slate-800/30 transition ${
                  index === cryptos.length - 1 ? 'border-b-0' : ''
                }`}
              >
                {/* Asset */}
                <td className="px-6 py-4">
                  <Link
                    href={`/market/${crypto.id}`}
                    className="flex items-center gap-3 hover:opacity-80 transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center overflow-hidden">
                      <img
                        src={crypto.image || "/placeholder.svg"}
                        alt={crypto.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{crypto.symbol}</div>
                      <div className="text-xs text-slate-400">{crypto.name}</div>
                    </div>
                  </Link>
                </td>

                {/* Price */}
                <td className="px-6 py-4 text-right">
                  <div className="font-semibold text-white">
                    {formatPrice(crypto.price)}
                  </div>
                </td>

                {/* 24H Change */}
                <td className="px-6 py-4 text-right">
                  <div className={`flex items-center justify-end gap-1 font-semibold ${
                    crypto.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {crypto.change24h >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {Math.abs(crypto.change24h).toFixed(2)}%
                  </div>
                </td>

                {/* Market Cap */}
                <td className="px-6 py-4 text-right">
                  <div className="text-slate-300 text-sm">
                    {formatMarketCap(crypto.marketCap)}
                  </div>
                </td>

                {/* Volume */}
                <td className="px-6 py-4 text-right">
                  <div className="text-slate-300 text-sm">
                    {formatMarketCap(crypto.volume24h)}
                  </div>
                </td>

                {/* Chart Placeholder */}
                <td className="px-6 py-4 text-right">
                  <div className="h-12 w-24 bg-slate-800/50 rounded flex items-center justify-center">
                    <div className={`text-xs ${crypto.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {crypto.change24h >= 0 ? '↗' : '↘'}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
