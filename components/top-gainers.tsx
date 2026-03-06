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

    <div className="border border-orange-500/20 rounded-2xl bg-slate-900/60 backdrop-blur-xl shadow-[0_0_30px_rgba(249,115,22,0.15)] p-6">

      {/* Header */}

      <div className="flex items-center gap-2 mb-6">

        <TrendingUp className="w-5 h-5 text-orange-400" />

        <h3 className="text-lg font-bold text-white">
          Top Gainers
        </h3>

      </div>

      {/* Loading */}

      {isLoading ? (

        <div className="space-y-3">

          {[...Array(4)].map((_, i) => (

            <div
              key={i}
              className="h-16 rounded-lg bg-slate-800/40 animate-pulse"
            />

          ))}

        </div>

      ) : (

        <div className="space-y-3">

          {gainers.map((gainer) => (

            <div
              key={gainer.id}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition"
            >

              {/* Left */}

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">

                  <img
  src={gainer.image}
  alt={gainer.symbol}
  className="w-7 h-7 object-contain"
  onError={(e) => {
    e.currentTarget.src =
      "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/generic.png"
  }}
/>

                </div>

                <div>

                  <div className="font-semibold text-white">
                    {gainer.symbol}
                  </div>

                  <div className="text-xs text-slate-400">
                    ${gainer.price.toFixed(4)}
                  </div>

                </div>

              </div>

              {/* Change */}

              <div className="text-green-400 font-semibold flex items-center gap-1">

                <TrendingUp className="w-4 h-4" />

                {gainer.change24h.toFixed(2)}%

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  )

}