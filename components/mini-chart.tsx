'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatPrice, formatVolume } from '@/lib/market-data'

interface CryptoBadgeProps {
  price: number
  change24h: number
}

function CryptoBadge({ price, change24h }: CryptoBadgeProps) {
  const positive = change24h >= 0
  const bgColor = positive ? 'bg-green-900/20' : 'bg-red-900/20'
  const textColor = positive ? 'text-green-400' : 'text-red-400'

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${bgColor} font-semibold text-sm`}>
      {positive ? <TrendingUp className={`w-4 h-4 ${textColor}`} /> : <TrendingDown className={`w-4 h-4 ${textColor}`} />}
      <span className={textColor}>{formatPrice(price)}</span>
    </div>
  )
}