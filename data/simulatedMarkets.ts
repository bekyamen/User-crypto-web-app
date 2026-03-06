import { UTCTimestamp } from 'lightweight-charts'

export interface Market {
  symbol: string
  name: string
  price: number
  change: number
}

export const SIMULATED_MARKETS: Market[] = [
  { symbol: 'EUR/USD', name: 'EURUSD', price: 1.16, change: -0.31 },
  { symbol: 'USD/JPY', name: 'USDJPY', price: 149.85, change: 0.12 },
  { symbol: 'GBP/USD', name: 'GBPUSD', price: 1.18, change: -0.59 },
  { symbol: 'AUD/USD', name: 'AUDUSD', price: 0.7252, change: -5.75 },
  { symbol: 'USD/CAD', name: 'USDCAD', price: 1.3542, change: 0.08 },
  { symbol: 'USD/CHF', name: 'USDCHF', price: 0.8834, change: 0.22 },
  { symbol: 'EUR/GBP', name: 'EURGBP', price: 0.8421, change: -0.14 },
  { symbol: 'EUR/JPY', name: 'EURJPY', price: 162.34, change: 0.45 },
  { symbol: 'GBP/JPY', name: 'GBPJPY', price: 187.22, change: 0.67 },
  { symbol: 'CAD/JPY', name: 'CADJPY', price: 110.56, change: -0.33 },
  { symbol: 'GBP/CAD', name: 'GBPCAD', price: 1.7123, change: 0.19 },
  { symbol: 'EUR/CAD', name: 'EURCAD', price: 1.4987, change: -0.07 },
  { symbol: 'USD/MXN', name: 'USDMXN', price: 17.234, change: 1.23 },
  { symbol: 'USD/SEK', name: 'USDSEK', price: 10.456, change: 0.34 },
]

export type Candle = {
  time: UTCTimestamp
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export function generateCandleData(basePrice: number, count = 200): Candle[] {
  const candles: Candle[] = []
  const now = Math.floor(Date.now() / 1000)
  let price = basePrice

  for (let i = count; i >= 0; i--) {
    const time = (now - i * 900) as UTCTimestamp // 15m candles
    const volatility = basePrice * 0.002
    const open = price
    const change = (Math.random() - 0.48) * volatility
    const close = open + change
    const high = Math.max(open, close) + Math.random() * volatility * 0.5
    const low = Math.min(open, close) - Math.random() * volatility * 0.5
    const volume = Math.random() * 1000000 + 100000

    candles.push({ time, open, high, low, close, volume })
    price = close
  }

  return candles
}

export function generateOrderBook(basePrice: number) {
  const bids: [string, string][] = []
  const asks: [string, string][] = []
  const decimals = basePrice < 10 ? 5 : 2

  for (let i = 0; i < 12; i++) {
    const spread = basePrice * 0.0001 * (i + 1)
    asks.unshift([
      (basePrice + spread).toFixed(decimals),
      (Math.random() * 5 + 0.1).toFixed(6),
    ])
    bids.push([
      (basePrice - spread).toFixed(decimals),
      (Math.random() * 5 + 0.1).toFixed(6),
    ])
  }

  return { bids, asks }
}
