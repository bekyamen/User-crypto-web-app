import { useEffect, useRef, useState, useMemo } from 'react'
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  IChartApi,
} from 'lightweight-charts'
import {
  SIMULATED_MARKETS,
  generateCandleData,
  generateOrderBook,
  Candle,
  Market,
} from '@/data/simulatedMarkets'

type TF = '1m' | '15m' | '1h' | '4h' | '1d'

export function ForexDashboard() {
  const [selectedPair, setSelectedPair] = useState('EUR/USD')
  const [searchQuery, setSearchQuery] = useState('')
  const [tf, setTf] = useState<TF>('15m')
  const [markets, setMarkets] = useState<Market[]>(SIMULATED_MARKETS)
  const [bids, setBids] = useState<[string, string][]>([])
  const [asks, setAsks] = useState<[string, string][]>([])

  const chartEl = useRef<HTMLDivElement>(null)
  const chart = useRef<IChartApi | null>(null)
  const candleSeries = useRef<any>(null)
  const volumeSeries = useRef<any>(null)

  const currentMarket = markets.find((m) => m.symbol === selectedPair)
  const currentPrice = currentMarket?.price ?? 0

  const filteredMarkets = useMemo(() => {
    return markets.filter(
      (m) =>
        m.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [markets, searchQuery])

  // Simulate price ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets((prev) =>
        prev.map((m) => {
          const tick = m.price * (Math.random() - 0.5) * 0.0004
          return {
            ...m,
            price: m.price + tick,
            change: m.change + (Math.random() - 0.5) * 0.01,
          }
        })
      )
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Update order book on pair change
  useEffect(() => {
    const updateBook = () => {
      const { bids: b, asks: a } = generateOrderBook(currentPrice || 1)
      setBids(b)
      setAsks(a)
    }
    updateBook()
    const interval = setInterval(updateBook, 1500)
    return () => clearInterval(interval)
  }, [selectedPair, currentPrice])

  // Chart init
  useEffect(() => {
    if (!chartEl.current) return

    chart.current = createChart(chartEl.current, {
      layout: {
        background: { color: 'hsl(222, 45%, 9%)' },
        textColor: 'hsl(215, 25%, 55%)',
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.04)' },
        horzLines: { color: 'rgba(255,255,255,0.04)' },
      },
      crosshair: {
        vertLine: { color: 'hsl(25, 95%, 55%)', width: 1, style: 2 },
        horzLine: { color: 'hsl(25, 95%, 55%)', width: 1, style: 2 },
      },
      rightPriceScale: { borderColor: 'hsl(215, 25%, 18%)' },
      timeScale: { borderColor: 'hsl(215, 25%, 18%)' },
    })

    candleSeries.current = chart.current.addSeries(CandlestickSeries, {
      upColor: 'hsl(145, 65%, 45%)',
      downColor: 'hsl(0, 72%, 55%)',
      borderUpColor: 'hsl(145, 65%, 45%)',
      borderDownColor: 'hsl(0, 72%, 55%)',
      wickUpColor: 'hsl(145, 65%, 45%)',
      wickDownColor: 'hsl(0, 72%, 55%)',
    })

    volumeSeries.current = chart.current.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: '',
    })

    volumeSeries.current.priceScale().applyOptions({
      scaleMargins: { top: 0.85, bottom: 0 },
    })

    return () => chart.current?.remove()
  }, [])

  // Load simulated data on pair/tf change
  useEffect(() => {
    if (!candleSeries.current || !volumeSeries.current) return

    const basePrice = currentMarket?.price ?? 1
    const data = generateCandleData(basePrice)

    candleSeries.current.setData(data)
    volumeSeries.current.setData(
      data.map((c: Candle) => ({
        time: c.time,
        value: c.volume,
        color: c.close >= c.open ? 'rgba(56,176,120,0.3)' : 'rgba(220,80,80,0.3)',
      }))
    )
    chart.current?.timeScale().fitContent()
  }, [selectedPair, tf])

  // Resize
  useEffect(() => {
    const handleResize = () => {
      if (chart.current && chartEl.current) {
        chart.current.applyOptions({
          width: chartEl.current.clientWidth,
          height: chartEl.current.clientHeight,
        })
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const decimals = currentPrice < 10 ? 5 : 2

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* LEFT: Market List */}
      <div className="w-64 flex-shrink-0 border-r border-border bg-card flex flex-col">
        <div className="p-3 border-b border-border">
          <input
            placeholder="Search pairs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredMarkets.map((m, idx) => (
            <button
              key={m.symbol}
              onClick={() => setSelectedPair(m.symbol)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                selectedPair === m.symbol
                  ? 'bg-accent/20 border-l-2 border-l-primary'
                  : 'hover:bg-secondary border-l-2 border-l-transparent'
              }`}
            >
              <span className="text-muted-foreground text-xs w-5 text-right">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {m.name}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-foreground">
                  {m.price.toFixed(decimals < 3 ? 2 : 4)}
                </div>
                {m.change !== 0 && (
                  <div
                    className={`text-xs font-medium ${
                      m.change >= 0 ? 'text-success' : 'text-destructive'
                    }`}
                  >
                    {m.change >= 0 ? '+' : ''}
                    {m.change.toFixed(2)}%
                  </div>
                )}
              </div>
              {selectedPair === m.symbol && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CENTER: Chart */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-foreground">{selectedPair}</h2>
            <span className="text-xl font-mono text-foreground">
              {currentPrice > 0 ? currentPrice.toFixed(decimals) : '--'}
            </span>
            <span
              className={`text-sm font-medium ${
                (currentMarket?.change ?? 0) >= 0
                  ? 'text-success'
                  : 'text-destructive'
              }`}
            >
              {currentMarket
                ? `${currentMarket.change >= 0 ? '+' : ''}${currentMarket.change.toFixed(2)}%`
                : '--'}
            </span>
          </div>

          <div className="flex gap-1">
            {(['1m', '15m', '1h', '4h', '1d'] as TF[]).map((x) => (
              <button
                key={x}
                onClick={() => setTf(x)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  tf === x
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {x}
              </button>
            ))}
          </div>
        </div>

        <div ref={chartEl} className="flex-1" />
      </div>

      {/* RIGHT: Order Book */}
      <div className="w-56 flex-shrink-0 border-l border-border bg-card flex flex-col">
        <div className="px-3 py-3 border-b border-border">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Order Book
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto text-xs font-mono">
          <div className="px-3 py-1 flex justify-between text-muted-foreground border-b border-border">
            <span>Price</span>
            <span>Amount</span>
          </div>

          {/* Asks */}
          {asks.map(([price, amount], i) => (
            <div key={`a-${i}`} className="px-3 py-0.5 flex justify-between">
              <span className="text-destructive">{price}</span>
              <span className="text-muted-foreground">{parseFloat(amount).toFixed(4)}</span>
            </div>
          ))}

          {/* Spread */}
          <div className="px-3 py-1.5 text-center font-bold text-foreground bg-secondary/50">
            {currentPrice.toFixed(decimals)}
          </div>

          {/* Bids */}
          {bids.map(([price, amount], i) => (
            <div key={`b-${i}`} className="px-3 py-0.5 flex justify-between">
              <span className="text-success">{price}</span>
              <span className="text-muted-foreground">{parseFloat(amount).toFixed(4)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ForexDashboard
