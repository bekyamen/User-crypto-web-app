'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  IChartApi,
  UTCTimestamp,
} from 'lightweight-charts'

type TF = '1m' | '15m' | '1h' | '4h' | '1d'

type Candle = {
  time: UTCTimestamp
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface Market {
  symbol: string
  name: string
  price: number
  change: number
}

export function ForexDashboard() {
  const searchParams = useSearchParams()
  const initialPair = searchParams.get('pair') ?? 'EUR/USDT'
  const initialPrice = parseFloat(searchParams.get('price') ?? '0')

  const [selectedPair, setSelectedPair] = useState(initialPair)
  const [markets, setMarkets] = useState<Market[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [tf, setTf] = useState<TF>('15m')
  const [currentPrice, setCurrentPrice] = useState<number>(initialPrice)
  const [bids, setBids] = useState<[string, string][]>([])
  const [asks, setAsks] = useState<[string, string][]>([])

  const symbol = selectedPair.replace('/', '')
  const chartEl = useRef<HTMLDivElement>(null)
  const chart = useRef<IChartApi | null>(null)
  const candleSeries = useRef<any>(null)
  const volumeSeries = useRef<any>(null)
  const candles = useRef<Candle[]>([])
  const klineWs = useRef<WebSocket | null>(null)
  const depthWs = useRef<WebSocket | null>(null)

  const forexPairs = ['EURUSDT','GBPUSDT','AUDUSDT','NZDUSDT','USDJPY','EURGBP','GBPJPY']

  /* ================= LIVE MARKETS ================= */
  useEffect(() => {
    // Initialize markets with zero values
    setMarkets(forexPairs.map((s) => ({
      symbol: s.slice(0, -4) + '/USDT',
      name: s.slice(0, -4),
      price: 0,
      change: 0
    })))

    const socket = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr')
    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data) as any[]
      setMarkets((prev) => {
        const updated = [...prev]
        forexPairs.forEach((pair) => {
          const ticker = data.find((t) => t.s.toUpperCase() === pair)
          if (ticker) {
            const idx = updated.findIndex((m) => m.symbol === pair.slice(0, -4) + '/USDT')
            if (idx !== -1) {
              updated[idx] = {
                symbol: pair.slice(0, -4) + '/USDT',
                name: pair.slice(0, -4),
                price: parseFloat(ticker.c),
                change: parseFloat(ticker.P)
              }
              if (updated[idx].symbol === selectedPair) {
                setCurrentPrice(parseFloat(ticker.c))
              }
            }
          }
        })
        return updated
      })
    }

    return () => socket.close()
  }, [selectedPair])

  /* ================= FILTER ================= */
  const filteredMarkets = useMemo(() => {
    return markets.filter(
      (m) =>
        m.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [markets, searchQuery])

  const currentMarket = markets.find((m) => m.symbol === selectedPair)

  /* ================= CHART INIT ================= */
  useEffect(() => {
    if (!chartEl.current) return
    chart.current = createChart(chartEl.current, {
      layout: { background: { color: '#071225' }, textColor: '#b9c3d6' },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.06)' },
        horzLines: { color: 'rgba(255,255,255,0.06)' },
      },
    })
    candleSeries.current = chart.current.addSeries(CandlestickSeries)
    volumeSeries.current = chart.current.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: '',
    })
    return () => chart.current?.remove()
  }, [])

  /* ================= LOAD HISTORY ================= */
  useEffect(() => {
    loadHistory()
    connectKlineWS()
    connectDepthWS()
    return () => {
      klineWs.current?.close()
      depthWs.current?.close()
    }
  }, [selectedPair, tf])

  async function loadHistory() {
    const res = await fetch(`/api/binance/klines?symbol=${symbol}&interval=${tf}`)
    if (!res.ok) return
    const raw = await res.json()
    candles.current = raw.map((k: any) => ({
      time: Math.floor(k[0] / 1000) as UTCTimestamp,
      open: +k[1],
      high: +k[2],
      low: +k[3],
      close: +k[4],
      volume: +k[5],
    }))
    renderChart(true)
  }

  function connectKlineWS() {
    klineWs.current?.close()
    klineWs.current = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${tf}`)
    klineWs.current.onmessage = (e) => {
      const k = JSON.parse(e.data).k
      updateCandle({
        time: Math.floor(k.t / 1000) as UTCTimestamp,
        open: +k.o,
        high: +k.h,
        low: +k.l,
        close: +k.c,
        volume: +k.v,
      })
      setCurrentPrice(+k.c)
    }
  }

  function connectDepthWS() {
    depthWs.current?.close()
    depthWs.current = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth20@100ms`)
    depthWs.current.onmessage = (e) => {
      const data = JSON.parse(e.data)
      setBids(data.bids)
      setAsks(data.asks)
    }
  }

  function updateCandle(c: Candle) {
    const last = candles.current[candles.current.length - 1]
    if (last && last.time === c.time) Object.assign(last, c)
    else candles.current.push(c)
    renderChart(false)
  }

  function renderChart(fit = false) {
    candleSeries.current?.setData(candles.current)
    volumeSeries.current?.setData(candles.current.map((c) => ({ time: c.time, value: c.volume })))
    if (fit) chart.current?.timeScale().fitContent()
  }

  /* ================= UI ================= */
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">

      {/* ===== LEFT MARKETS ===== */}
      <div className="xl:col-span-3 order-2 xl:order-1">
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 xl:sticky xl:top-24">
          <input
            type="text"
            placeholder="Search Forex pairs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white mb-4"
          />

          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {filteredMarkets.map((m) => (
              <button
                key={m.symbol}
                onClick={() => {
                  setSelectedPair(m.symbol)
                  setCurrentPrice(0)
                }}
                className={`w-full px-3 py-2 rounded ${
                  selectedPair === m.symbol
                    ? 'bg-blue-500/20 border border-blue-500/50'
                    : 'hover:bg-slate-800'
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <div className="text-white text-sm font-medium">{m.name}</div>
                    <div className="text-slate-400 text-xs">{m.symbol}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-sm">{m.price.toFixed(4)}</div>
                    <div className={`text-xs ${m.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {m.change >= 0 ? '+' : ''}{m.change.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== CENTER CHART ===== */}
      <div className="xl:col-span-6 order-1 xl:order-2 bg-slate-900 border border-slate-800 rounded-lg p-4 sm:p-6">

        <div className="mb-4">
          <div className="text-2xl sm:text-3xl lg:text-4xl text-white font-bold">
            {currentPrice > 0 ? currentPrice.toFixed(4) : '--'}
          </div>
          <div className={`${(currentMarket?.change ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {currentMarket
              ? `${currentMarket.change >= 0 ? '+' : ''}${currentMarket.change.toFixed(2)}%`
              : '--'}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {(['1m', '15m', '1h', '4h', '1d'] as TF[]).map((x) => (
            <button
              key={x}
              onClick={() => setTf(x)}
              className={`px-3 py-1 rounded text-sm ${
                tf === x ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {x}
            </button>
          ))}
        </div>

        <div ref={chartEl} className="h-[350px] sm:h-[450px] lg:h-[600px] w-full" />
      </div>

      {/* ===== ORDER BOOK ===== */}
      <div className="xl:col-span-3 order-3 bg-slate-900 border border-slate-800 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-4">Order Book</h3>

        <div className="max-h-[350px] sm:max-h-[450px] lg:max-h-[600px] overflow-y-auto text-xs">
          {asks.map(([price, amount], i) => (
            <div key={i} className="flex justify-between text-red-400 py-[2px]">
              <span>{parseFloat(price).toFixed(4)}</span>
              <span>{parseFloat(amount).toFixed(6)}</span>
            </div>
          ))}

          <div className="border-t border-slate-700 my-2"></div>

          {bids.map(([price, amount], i) => (
            <div key={i} className="flex justify-between text-green-400 py-[2px]">
              <span>{parseFloat(price).toFixed(4)}</span>
              <span>{parseFloat(amount).toFixed(6)}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}