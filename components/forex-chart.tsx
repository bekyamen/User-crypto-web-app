'use client'

import { useEffect, useRef, useState } from 'react'
import {
  createChart,
  IChartApi,
  UTCTimestamp,
  CandlestickSeries,
} from 'lightweight-charts'

type TF = '1min' | '5min' | '15min' | '1h'

interface Candle {
  time: UTCTimestamp
  open: number
  high: number
  low: number
  close: number
}

interface Market {
  symbol: string
  price: number
  change: number
}

interface Trade {
  price: number
  size: number
  side: 'buy' | 'sell'
  time: string
}

export default function ForexDashboard() {
  const API_KEY = '210420b658cf4bceaac0150f3e2481ab'

  const [symbol, setSymbol] = useState('EUR/USD')
  const [tf, setTf] = useState<TF>('1min')

  const [markets, setMarkets] = useState<Market[]>([])
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([])
  const [price, setPrice] = useState(0)
  const [change, setChange] = useState(0)
  const [high24, setHigh24] = useState(0)
  const [low24, setLow24] = useState(0)

  const [trades, setTrades] = useState<Trade[]>([])
  const [orderBook, setOrderBook] = useState<any[]>([])

  const chartRef = useRef<HTMLDivElement>(null)
  const chart = useRef<IChartApi | null>(null)
  const candleSeries = useRef<CandlestickSeries | null>(null)
  const ws = useRef<WebSocket | null>(null)
  const lastCandle = useRef<Candle | null>(null)
  const dayOpen = useRef<number>(0)

  /* ================= INIT CHART ================= */
  useEffect(() => {
    if (!chartRef.current) return

    chart.current = createChart(chartRef.current, {
      layout: { background: { color: '#0f172a' }, textColor: '#cbd5e1' },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.05)' },
        horzLines: { color: 'rgba(255,255,255,0.05)' },
      },
      rightPriceScale: { borderColor: '#334155' },
      timeScale: { timeVisible: true },
    })

    candleSeries.current = chart.current.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    })

    return () => chart.current?.remove()
  }, [])

  /* ================= LOAD HISTORY ================= */
  useEffect(() => {
    async function load() {
      const res = await fetch(
        `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${tf}&outputsize=300&apikey=${API_KEY}`
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

      candleSeries.current?.setData(formatted)

      const first = formatted[0]
      const last = formatted[formatted.length - 1]

      lastCandle.current = last
      dayOpen.current = first.open

      setPrice(last.close)
      setHigh24(Math.max(...formatted.map(c => c.high)))
      setLow24(Math.min(...formatted.map(c => c.low)))

      setChange(((last.close - first.open) / first.open) * 100)
    }

    load()
  }, [symbol, tf])

  /* ================= FETCH ALL MARKETS ================= */
  useEffect(() => {
    async function fetchMarkets() {
      const res = await fetch(
        `https://api.twelvedata.com/forex_pairs?apikey=${API_KEY}`
      )
      const data = await res.json()
      if (!data.data) return

      const initialMarkets = data.data.map((pair: any) => ({
        symbol: pair.symbol,
        price: 0,
        change: 0,
      }))

      setMarkets(initialMarkets)
      setFilteredMarkets(initialMarkets)
    }

    fetchMarkets()
  }, [])

  /* ================= LIVE STREAM ================= */
  useEffect(() => {
    if (ws.current) ws.current.close()
    if (markets.length === 0) return

    ws.current = new WebSocket(`wss://ws.twelvedata.com/v1/quotes/price?apikey=${API_KEY}`)

    ws.current.onopen = () => {
      ws.current?.send(
        JSON.stringify({
          action: 'subscribe',
          params: { symbols: markets.map(m => m.symbol).join(',') },
        })
      )
    }

    ws.current.onmessage = event => {
      const data = JSON.parse(event.data)
      if (!data.price || !data.symbol) return

      const livePrice = parseFloat(data.price)

      // Update Market List
      setMarkets(prev => {
        const copy = [...prev]
        const i = copy.findIndex(m => m.symbol === data.symbol)
        if (i >= 0) {
          const prevPrice = copy[i].price || livePrice
          copy[i] = {
            symbol: data.symbol,
            price: livePrice,
            change: ((livePrice - prevPrice) / prevPrice) * 100,
          }
        }
        return copy
      })

      // Update filtered list too
      setFilteredMarkets(prev => {
        const copy = [...prev]
        const i = copy.findIndex(m => m.symbol === data.symbol)
        if (i >= 0) copy[i].price = livePrice
        return copy
      })

      // Update selected symbol chart
      if (data.symbol === symbol && lastCandle.current) {
        setPrice(livePrice)
        const updated = {
          ...lastCandle.current,
          close: livePrice,
          high: Math.max(lastCandle.current.high, livePrice),
          low: Math.min(lastCandle.current.low, livePrice),
        }
        candleSeries.current?.update(updated)
        lastCandle.current = updated
        setChange(((livePrice - dayOpen.current) / dayOpen.current) * 100)

        // Synthetic order book & trades
        const spread = 0.0002
        setOrderBook([
          { bid: livePrice - spread, ask: 0, size: Math.random() * 5 },
          { bid: livePrice - spread / 2, ask: 0, size: Math.random() * 4 },
          { bid: 0, ask: livePrice + spread / 2, size: Math.random() * 4 },
          { bid: 0, ask: livePrice + spread, size: Math.random() * 5 },
        ])
        setTrades(prev => [
          { price: livePrice, size: Math.random() * 2, side: Math.random() > 0.5 ? 'buy' : 'sell', time: new Date().toLocaleTimeString() },
          ...prev.slice(0, 25),
        ])
      }
    }

    return () => ws.current?.close()
  }, [symbol, markets])

  /* ================= FILTER ================= */
  const handleSearch = (query: string) => {
    setFilteredMarkets(
      markets.filter(m => m.symbol.toLowerCase().includes(query.toLowerCase()))
    )
  }

  /* ================= RENDER ================= */
  return (
    <div className="flex h-screen bg-slate-950 text-white">

      {/* LEFT MARKET LIST */}
      <div className="w-72 border-r border-slate-800 p-3 flex flex-col">
        <h2 className="font-bold mb-3">Markets</h2>
        <input
          type="text"
          placeholder="Search..."
          className="mb-2 px-2 py-1 rounded bg-slate-800 text-white"
          onChange={e => handleSearch(e.target.value)}
        />
        <div className="overflow-y-auto flex-1">
          {filteredMarkets.map(m => (
            <div
              key={m.symbol}
              onClick={() => setSymbol(m.symbol)}
              className="flex justify-between py-2 cursor-pointer hover:bg-slate-800 px-2 rounded"
            >
              <span>{m.symbol}</span>
              <div className="text-right">
                <div>{m.price?.toFixed(5)}</div>
                <div className={`text-xs ${m.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {m.change.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CENTER CHART */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <div className="text-3xl font-bold text-orange-400">{price.toFixed(5)}</div>
          <div className={`text-sm font-semibold ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change >= 0 ? '▲' : '▼'} {change.toFixed(2)}%
          </div>
          <div className="text-sm text-slate-400 mt-1">
            24h High: {high24.toFixed(5)} | 24h Low: {low24.toFixed(5)}
          </div>
          <div className="flex gap-2 mt-3">
            {(['1min','5min','15min','1h'] as TF[]).map(t => (
              <button
                key={t}
                onClick={() => setTf(t)}
                className={`px-3 py-1 rounded ${tf === t ? 'bg-orange-500' : 'bg-slate-800'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div ref={chartRef} className="flex-1" />
      </div>

      {/* RIGHT SIDE */}
      <div className="w-72 border-l border-slate-800 p-3 flex flex-col">
        <h2 className="font-bold mb-2">Order Book</h2>
        {orderBook.map((o, i) => (
          <div key={i} className="flex justify-between text-sm py-1">
            <span className="text-green-400">{o.bid ? o.bid.toFixed(5) : ''}</span>
            <span className="text-red-400">{o.ask ? o.ask.toFixed(5) : ''}</span>
            <span>{o.size.toFixed(2)}</span>
          </div>
        ))}

        <h2 className="font-bold mt-4 mb-2">Recent Trades</h2>
        <div className="flex-1 overflow-auto">
          {trades.map((t, i) => (
            <div
              key={i}
              className={`flex justify-between text-xs py-1 ${t.side === 'buy' ? 'text-green-400' : 'text-red-400'}`}
            >
              <span>{t.time}</span>
              <span>{t.price.toFixed(5)}</span>
              <span>{t.size.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}