import { UTCTimestamp } from 'lightweight-charts'

export interface GoldMarket {
  symbol: string
  name: string
  price: number
  change: number
}

export const SIMULATED_GOLD_MARKETS: GoldMarket[] = [
  { symbol: 'PAXG/USDT', name: 'PAXG', price: 5102.75, change: -0.04 },
  { symbol: 'PAXG/BTC', name: 'PAXGBTC', price: 0.0743, change: 5.00 },
  { symbol: 'PAXG/ETH', name: 'PAXGETH', price: 0, change: 0 },
  { symbol: 'PAX/USDT', name: 'PAX', price: 1941.00, change: -0.82 },
  { symbol: 'PAXG/BNB', name: 'PAXGBNB', price: 6.47, change: -19.78 },
//   { symbol: 'XAU/USDT', name: 'XAUUSDT', price: 2345.50, change: 0.82 },
//   { symbol: 'XAG/USDT', name: 'XAGUSDT', price: 29.45, change: -0.45 },
//   { symbol: 'GLD/USDT', name: 'GLDUSDT', price: 187.32, change: 0.34 },
//   { symbol: 'GOLD/USDT', name: 'GOLDUSDT', price: 1.24, change: -1.12 },
//   { symbol: 'XAU/EUR', name: 'XAUEUR', price: 2178.90, change: 0.56 },
//   { symbol: 'XAU/GBP', name: 'XAUGBP', price: 1876.40, change: 0.71 },
//   { symbol: 'PAXG/EUR', name: 'PAXGEUR', price: 4732.60, change: -0.23 },
//   { symbol: 'PAXG/GBP', name: 'PAXGGBP', price: 4078.80, change: 0.44 },
//   { symbol: 'PAXG/TRY', name: 'PAXGTRY', price: 163201.50, change: 0.18 },
]

export type GoldCandle = {
  time: UTCTimestamp
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export function generateGoldCandleData(basePrice: number, count = 200): GoldCandle[] {
  const candles: GoldCandle[] = []
  const now = Math.floor(Date.now() / 1000)
  let price = basePrice

  for (let i = count; i >= 0; i--) {
    const time = (now - i * 900) as UTCTimestamp
    const volatility = basePrice * 0.003
    const open = price
    const change = (Math.random() - 0.48) * volatility
    const close = open + change
    const high = Math.max(open, close) + Math.random() * volatility * 0.5
    const low = Math.min(open, close) - Math.random() * volatility * 0.5
    const volume = Math.random() * 500000 + 50000

    candles.push({ time, open, high, low, close, volume })
    price = close
  }

  return candles
}

export function generateGoldOrderBook(basePrice: number) {
  const bids: [string, string][] = []
  const asks: [string, string][] = []
  const decimals = basePrice < 10 ? 4 : 2

  for (let i = 0; i < 12; i++) {
    const spread = basePrice * 0.0002 * (i + 1)
    asks.unshift([
      (basePrice + spread).toFixed(decimals),
      (Math.random() * 10 + 0.5).toFixed(4),
    ])
    bids.push([
      (basePrice - spread).toFixed(decimals),
      (Math.random() * 10 + 0.5).toFixed(4),
    ])
  }

  return { bids, asks }
}
