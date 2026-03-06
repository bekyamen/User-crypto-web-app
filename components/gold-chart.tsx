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
      layout: { background: { color: '#071225' }, textColor: '#b9c3d6' },
      grid: { vertLines: { color: 'rgba(255,255,255,0.06)' }, horzLines: { color: 'rgba(255,255,255,0.06)' } },
      rightPriceScale: { borderColor: '#334155' },
      timeScale: { timeVisible: true },
    })
    candleSeries.current = chart.current.addSeries(CandlestickSeries)
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
          if (data[s]?.price) updatedPrices[s] = parseFloat(data[s].price)
        })
        setMarketPrices(updatedPrices)
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
    const interval = setInterval(fetchLivePrices, 5000)
    return () => clearInterval(interval)
  }, [symbol])

  /* ===================== RESPONSIVE UI ===================== */
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">

      {/* ===== LEFT MARKETS ===== */}
      <div className="xl:col-span-3 order-2 xl:order-1">
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 xl:sticky xl:top-24">
          <input
            type="text"
            placeholder="Search pairs..."
            value={symbol}
            onChange={() => {}}
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white mb-4"
          />

          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {GOLD_SYMBOLS.map(s => (
              <button
                key={s}
                onClick={() => setSymbol(s)}
                className={`w-full px-3 py-2 rounded ${
                  symbol === s
                    ? 'bg-blue-500/20 border border-blue-500/50'
                    : 'hover:bg-slate-800'
                }`}
              >
                <div className="flex justify-between">
                  <span className="text-white text-sm font-medium">{s}</span>
                  <span className="text-slate-400 text-sm">{marketPrices[s]?.toFixed(2) ?? '--'}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== CENTER CHART ===== */}
      <div className="xl:col-span-6 order-1 xl:order-2 bg-slate-900 border border-slate-800 rounded-lg p-4 sm:p-6">
        <div className="mb-4">
          <div className="text-2xl sm:text-3xl lg:text-4xl text-white font-bold">{price.toFixed(2)}</div>
          <div className={`${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change >= 0 ? '▲' : '▼'} {change.toFixed(2)}%
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {(['1min','5min','15min','1h','4h'] as TF[]).map(t => (
            <button
              key={t}
              onClick={() => setTf(t)}
              className={`px-3 py-1 rounded text-sm ${
                tf === t ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div ref={chartRef} className="h-[350px] sm:h-[450px] lg:h-[600px] w-full" />
      </div>

      {/* ===== ORDER BOOK ===== */}
      <div className="xl:col-span-3 order-3 bg-slate-900 border border-slate-800 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-4">Order Book</h3>

        <div className="max-h-[350px] sm:max-h-[450px] lg:max-h-[600px] overflow-y-auto text-xs">
          {orderBook.asks.slice().reverse().map((a, i) => (
            <div key={i} className="flex justify-between text-red-400 py-[2px]">
              <span>{a.price.toFixed(2)}</span>
              <span>{a.size.toFixed(2)}</span>
            </div>
          ))}

          <div className="border-t border-slate-700 my-2"></div>

          {orderBook.bids.map((b, i) => (
            <div key={i} className="flex justify-between text-green-400 py-[2px]">
              <span>{b.price.toFixed(2)}</span>
              <span>{b.size.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}