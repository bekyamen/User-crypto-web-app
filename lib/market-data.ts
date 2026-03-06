const BINANCE_API = "https://api.binance.com/api/v3"

export interface CryptoAsset {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  volume24h: number
}

export interface NewListing {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  image?: string
}

export interface TopGainer {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  image: string
}




/* =========================
   Fetch Binance Market Data
========================= */

export async function getCryptos(): Promise<CryptoAsset[]> {

  const res = await fetch(`${BINANCE_API}/ticker/24hr`)

  if (!res.ok) throw new Error("Failed to fetch Binance market data")

  const data = await res.json()

  const filtered = data
    .filter((coin: any) => coin.symbol.endsWith("USDT"))
    .slice(0, 20)

  return filtered.map((coin: any) => ({
    id: coin.symbol,
    symbol: coin.symbol.replace("USDT", ""),
    name: coin.symbol.replace("USDT", ""),
    price: Number(coin.lastPrice),
    change24h: Number(coin.priceChangePercent),
    volume24h: Number(coin.quoteVolume)
  }))
}

/* =========================
   Sparkline Chart Data
========================= */



/* =========================
   Helpers
========================= */

export function formatPrice(price: number) {
  if (price > 1) return `$${price.toFixed(2)}`
  return `$${price.toFixed(4)}`
}

export function formatVolume(value: number) {
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`
  return value.toFixed(0)
}

export async function getNewListings(): Promise<NewListing[]> {

  const res = await fetch("https://api.binance.com/api/v3/ticker/24hr")

  if (!res.ok) throw new Error("Failed to fetch listings")

  const data = await res.json()

  const listings = data
    .filter((coin: any) => coin.symbol.endsWith("USDT"))
    .sort((a: any, b: any) => Number(a.count) - Number(b.count)) // newer pairs often have fewer trades
    .slice(0, 6)

  return listings.map((coin: any) => {

    const symbol = coin.symbol.replace("USDT", "")

    return {
      id: coin.symbol,
      symbol,
      name: symbol,
      price: Number(coin.lastPrice),
      change24h: Number(coin.priceChangePercent),
     image: `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/${symbol.toLowerCase()}.png`
    }

  })
}

export async function getTopGainers(): Promise<TopGainer[]> {

  const res = await fetch("https://api.binance.com/api/v3/ticker/24hr")

  if (!res.ok) throw new Error("Failed to fetch top gainers")

  const data = await res.json()

  const gainers = data
    .filter((coin: any) => coin.symbol.endsWith("USDT"))
    .sort((a: any, b: any) =>
      Number(b.priceChangePercent) - Number(a.priceChangePercent)
    )
    .slice(0, 6)

  return gainers.map((coin: any) => {

    const symbol = coin.symbol.replace("USDT", "")

    return {
      id: coin.symbol,
      symbol,
      name: symbol,
      price: Number(coin.lastPrice),
      change24h: Number(coin.priceChangePercent),
      image: `https://cryptoicons.org/api/icon/${symbol.toLowerCase()}/200`
    }

  })
}

export async function getSparkline(symbol: string) {

  const pair = `${symbol}USDT`

  const res = await fetch(
    `${BINANCE_API}/klines?symbol=${pair}&interval=5m&limit=30`
  )

  if (!res.ok) {
    console.error("Failed to load sparkline for", symbol)
    return []
  }

  const data = await res.json()

  return data.map((candle: any) => ({
    price: Number(candle[4]) // closing price
  }))
}