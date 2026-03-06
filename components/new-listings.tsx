'use client'

import { useEffect, useState } from 'react'
import { getNewListings, type NewListing } from '@/lib/market-data'
import { Zap, TrendingUp, TrendingDown } from 'lucide-react'

export function NewListingsSection() {

  const [listings, setListings] = useState<NewListing[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {

    const fetchData = async () => {

      try {
        const data = await getNewListings()
        setListings(data)
      } catch (error) {
        console.error('Failed to fetch new listings:', error)
      } finally {
        setIsLoading(false)
      }

    }

    fetchData()

  }, [])

  return (

    <div className="border border-blue-500/20 rounded-2xl bg-slate-900/60 backdrop-blur-xl shadow-[0_0_30px_rgba(59,130,246,0.15)] p-6">

      {/* Header */}

      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-bold text-white">
          New Listings
        </h3>
      </div>

      {/* Loading Skeleton */}

      {isLoading ? (

        <div className="space-y-4">

          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-800/40 rounded-lg h-16 animate-pulse"
            />
          ))}

        </div>

      ) : (

        <div className="space-y-3">

          {listings.map((listing) => {

            const positive = listing.change24h >= 0

            return (

              <div
                key={listing.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition"
              >

                {/* Left */}

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">

                    <img
  src={listing.image}
  alt={listing.symbol}
  className="w-7 h-7 object-contain"
  onError={(e) => {
    e.currentTarget.src =
      "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/generic.png"
  }}
/>

                  </div>

                  <div>

                    <div className="font-semibold text-white">
                      {listing.symbol}
                    </div>

                    <div className="text-xs text-slate-400">
                      ${listing.price.toFixed(4)}
                    </div>

                  </div>

                </div>

                {/* Change */}

                <div
                  className={`flex items-center gap-1 font-semibold ${
                    positive ? 'text-green-400' : 'text-red-400'
                  }`}
                >

                  {positive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}

                  {Math.abs(listing.change24h).toFixed(2)}%

                </div>

              </div>

            )

          })}

        </div>

      )}

    </div>

  )

}