'use client'

import { useEffect, useRef, useState } from 'react'
import {
  createChart,
  IChartApi,
  UTCTimestamp,
  CandlestickSeries,
} from 'lightweight-charts'

type TF = '1min' | '5min' | '15min' | '1h' | '4h'

interface Candle {
  time: UTCTimestamp
  open: number
  high: number
  low: number
  close: number
}

interface OrderLevel {
  price: number
  size: number
}

interface Trade {
  price: number
  size: number
  side: 'buy' | 'sell'
  time: string
}

type MarketSymbol = 'XAU/USD' | 'XAU/EUR' | 'XAU/GBP'

export default function GoldDashboard() {
  const API_KEY = 'a0438f8d465f4dc6a8c4689e9b84281c'

  const GOLD_SYMBOLS: MarketSymbol[] = ['XAU/USD', 'XAU/EUR', 'XAU/GBP']

  const [symbol, setSymbol] = useState<MarketSymbol>('XAU/USD')
  const [tf, setTf] = useState<TF>('1min')
  const [price, setPrice] = useState(0)
  const [change, setChange] = useState(0)
  const [high24, setHigh24] = useState(0)
  const [low24, setLow24] = useState(0)

  const [marketPrices, setMarketPrices] = useState<Record<MarketSymbol, number>>({
    'XAU/USD': 0,
    'XAU/EUR': 0,
    'XAU/GBP': 0,
  })

  const [orderBook, setOrderBook] = useState<{ bids: OrderLevel[]; asks: OrderLevel[] }>({
    bids: [],
    asks: [],
  })

  const [trades, setTrades] = useState<Trade[]>([])

  const chartRef = useRef<HTMLDivElement>(null)
  const chart = useRef<IChartApi | null>(null)
  const candleSeries = useRef<any>(null)
  const lastCandle = useRef<Candle | null>(null)

  /* ===================== INIT CHART ===================== */
  useEffect(() => {
    if (!chartRef.current) return

    chart.current = createChart(chartRef.current, {
      layout: { background: { color: '#0f172a' }, textColor: '#cbd5e1' },
      grid: { vertLines: { color: 'rgba(255,255,255,0.05)' }, horzLines: { color: 'rgba(255,255,255,0.05)' } },
      rightPriceScale: { borderColor: '#334155' },
      timeScale: { timeVisible: true },
    })

    candleSeries.current = chart.current.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      borderVisible: false,
    })

    return () => chart.current?.remove()
  }, [])

  /* ===================== LOAD HISTORY ===================== */
  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch(
          `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${tf}&outputsize=200&apikey=${API_KEY}`
        )
        const data = await res.json()
        if (!data.values) return

        const formatted: Candle[] = data.values
          .map((c: any) => ({
            time: Math.floor(new Date(c.datetime).getTime() / 1000) as UTCTimestamp,
            open: +c.open,
            high: +c.high,
            low: +c.low,
            close: +c.close,
          }))
          .reverse()

        candleSeries.current.setData(formatted)

        const last = formatted[formatted.length - 1]
        lastCandle.current = last

        setPrice(last.close)
        setHigh24(Math.max(...formatted.map(c => c.high)))
        setLow24(Math.min(...formatted.map(c => c.low)))

        const dayOpen = formatted[0].open
        setChange(((last.close - dayOpen) / dayOpen) * 100)
      } catch (err) {
        console.error('Failed to load history:', err)
      }
    }

    loadHistory()
  }, [symbol, tf])

  /* ===================== ORDER BOOK SIMULATION ===================== */
  const generateOrderBook = (mid: number) => {
    const depth = 12
    const spread = 0.3
    const bids: OrderLevel[] = []
    const asks: OrderLevel[] = []

    for (let i = 1; i <= depth; i++) {
      bids.push({ price: +(mid - spread - i * 0.1).toFixed(2), size: +(Math.random() * 20 + 1).toFixed(2) })
      asks.push({ price: +(mid + spread + i * 0.1).toFixed(2), size: +(Math.random() * 20 + 1).toFixed(2) })
    }

    return { bids, asks }
  }

  /* ===================== TRADE SIMULATION ===================== */
  const generateTrade = (price: number): Trade => ({
    price,
    size: +(Math.random() * 5 + 0.1).toFixed(2),
    side: Math.random() > 0.5 ? 'buy' : 'sell',
    time: new Date().toLocaleTimeString(),
  })

  /* ===================== LIVE PRICES FETCH ===================== */
  useEffect(() => {
    async function fetchLivePrices() {
      try {
        const res = await fetch(
          `https://api.twelvedata.com/price?symbol=${GOLD_SYMBOLS.join(',')}&apikey=${API_KEY}`
        )
        const data = await res.json()

        const updatedPrices: Record<MarketSymbol, number> = { ...marketPrices }

        GOLD_SYMBOLS.forEach(s => {
          if (data[s]?.price) {
            updatedPrices[s] = parseFloat(data[s].price)
          }
        })

        setMarketPrices(updatedPrices)

        // Update main chart price if currently selected
        if (lastCandle.current && updatedPrices[symbol]) {
          const livePrice = updatedPrices[symbol]
          setPrice(livePrice)

          const updated: Candle = {
            ...lastCandle.current,
            close: livePrice,
            high: Math.max(lastCandle.current.high, livePrice),
            low: Math.min(lastCandle.current.low, livePrice),
          }
          candleSeries.current.update(updated)
          lastCandle.current = updated

          setOrderBook(generateOrderBook(livePrice))
          setTrades(prev => [generateTrade(livePrice), ...prev.slice(0, 30)])
        }
      } catch (err) {
        console.error('Failed to fetch live prices', err)
      }
    }

    fetchLivePrices()
    const interval = setInterval(fetchLivePrices, 5000) // update every 5s
    return () => clearInterval(interval)
  }, [symbol])

  /* ===================== UI ===================== */
  return (
    <div className="flex h-screen bg-slate-950 text-white">

      {/* LEFT MARKET LIST */}
      <div className="w-64 border-r border-slate-800 p-4">
        <h2 className="font-bold mb-4 text-yellow-400">Gold Markets</h2>

        {GOLD_SYMBOLS.map(s => (
          <div
            key={s}
            onClick={() => setSymbol(s)}
            className={`flex justify-between py-2 px-3 rounded cursor-pointer ${symbol === s ? 'bg-yellow-600' : 'hover:bg-slate-800'}`}
          >
            <span>{s}</span>
            <span className="text-sm text-slate-400">{marketPrices[s]?.toFixed(2) ?? '--'}</span>
          </div>
        ))}
      </div>

      {/* CENTER CHART */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <div className="text-3xl font-bold text-yellow-400">
            {symbol} {price.toFixed(2)}
          </div>
          <div className={`text-sm font-semibold ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change >= 0 ? '▲' : '▼'} {change.toFixed(2)}%
          </div>
          <div className="text-sm text-slate-400 mt-2">
            24h High: {high24.toFixed(2)} | 24h Low: {low24.toFixed(2)}
          </div>
          <div className="flex gap-2 mt-3">
            {(['1min','5min','15min','1h','4h'] as TF[]).map(t => (
              <button key={t} onClick={() => setTf(t)} className={`px-3 py-1 rounded ${tf === t ? 'bg-yellow-600' : 'bg-slate-800'}`}>{t}</button>
            ))}
          </div>
        </div>
        <div ref={chartRef} className="flex-1" />
      </div>

      {/* RIGHT SIDE */}
      <div className="w-80 border-l border-slate-800 p-4 flex flex-col">
        <h2 className="font-bold mb-2">Order Book</h2>
        <div className="text-xs">
          {orderBook.asks.slice().reverse().map((a, i) => (
            <div key={i} className="flex justify-between text-red-400 py-0.5">
              <span>{a.price.toFixed(2)}</span>
              <span>{a.size.toFixed(2)}</span>
            </div>
          ))}
          <div className="text-center text-yellow-400 font-bold py-1">{price.toFixed(2)}</div>
          {orderBook.bids.map((b, i) => (
            <div key={i} className="flex justify-between text-green-400 py-0.5">
              <span>{b.price.toFixed(2)}</span>
              <span>{b.size.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <h2 className="font-bold mt-6 mb-2">Recent Trades</h2>
        <div className="flex-1 overflow-auto text-xs">
          {trades.map((t, i) => (
            <div key={i} className={`flex justify-between py-1 ${t.side === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
              <span>{t.time}</span>
              <span>{t.price.toFixed(2)}</span>
              <span>{t.size.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}