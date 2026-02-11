'use client'

import { useEffect, useState } from 'react'
import { getTopGainers, type TopGainer } from '@/lib/market-data'
import { TrendingUp } from 'lucide-react'

export function TopGainersSection() {
  const [gainers, setGainers] = useState<TopGainer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTopGainers()
        setGainers(data)
      } catch (error) {
        console.error('Failed to fetch top gainers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="border border-slate-700 rounded-lg bg-slate-900/50 p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-orange-400" />
        <h3 className="text-lg font-bold text-white">Top Gainers</h3>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-slate-800/30 rounded p-4 animate-pulse h-16" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {gainers.map((gainer) => (
            <div
              key={gainer.id}
              className="flex items-center justify-between p-4 bg-slate-800/30 rounded hover:bg-slate-800/50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center overflow-hidden">
                  <img
                    src={gainer.image || "/placeholder.svg"}
                    alt={gainer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-white">{gainer.symbol}</div>
                  <div className="text-xs text-slate-400">{gainer.price.toFixed(2)}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-semibold flex items-center justify-end gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {gainer.change24h.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
