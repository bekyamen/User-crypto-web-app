'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries, IChartApi, UTCTimestamp } from 'lightweight-charts';

type TF = '1min' | '5min' | '15min' | '1h' | '4h' | '1d';

type Candle = {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
};

interface ForexChartProps {
  pair: string;
  price?: number;
  change24h?: number;
  high24h?: number;
  low24h?: number;
}


const API_KEY = '210420b658cf4bceaac0150f3e2481ab';

export function ForexChart({ pair }: ForexChartProps) {
  const chartEl = useRef<HTMLDivElement>(null);
  const chart = useRef<IChartApi | null>(null);
  const series = useRef<any>(null);
  const ws = useRef<WebSocket | null>(null);

  const [tf, setTf] = useState<TF>('1min');
  const [price, setPrice] = useState<number | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);

  // =========================
  // Create chart
  // =========================
  useEffect(() => {
    if (!chartEl.current) return;

    chart.current = createChart(chartEl.current, {
      layout: { background: { color: '#071225' }, textColor: '#b9c3d6' },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.06)' },
        horzLines: { color: 'rgba(255,255,255,0.06)' },
      },
      rightPriceScale: { borderColor: 'rgba(255,255,255,0.1)' },
      timeScale: { timeVisible: true },
    });

    series.current = chart.current.addSeries(CandlestickSeries);

    const ro = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;
      chart.current?.applyOptions({ width });
    });

    ro.observe(chartEl.current);

    return () => {
      ro.disconnect();
      chart.current?.remove();
    };
  }, []);

  // =========================
  // Load historical candles
  // =========================
  useEffect(() => {
    const symbol = pair.replace('/', '').toUpperCase();

    async function loadHistory() {
      const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${tf}&outputsize=100&apikey=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.values) return;

      const formatted: Candle[] = data.values
        .map((c: any) => ({
          time: Math.floor(new Date(c.datetime).getTime() / 1000) as UTCTimestamp,
          open: +c.open,
          high: +c.high,
          low: +c.low,
          close: +c.close,
        }))
        .reverse();

      setCandles(formatted);
      series.current?.setData(formatted);
      setPrice(formatted[formatted.length - 1]?.close);
    }

    loadHistory();
  }, [pair, tf]);

  // =========================
  // WebSocket live updates
  // =========================
  useEffect(() => {
    const symbol = pair.replace('/', '').toUpperCase();

    ws.current?.close();
    ws.current = new WebSocket('wss://ws.twelvedata.com/v1/quotes/forex');

    ws.current.onopen = () => {
      ws.current?.send(
        JSON.stringify({
          action: 'subscribe',
          params: { symbol, interval: tf, apikey: API_KEY },
        })
      );
    };

    ws.current.onmessage = e => {
      const data = JSON.parse(e.data);
      if (!data.close) return;

      const time = Math.floor(new Date(data.datetime).getTime() / 1000) as UTCTimestamp;

      const candle: Candle = {
        time,
        open: +data.open,
        high: +data.high,
        low: +data.low,
        close: +data.close,
      };

      setPrice(candle.close);

      setCandles(prev => {
        const last = prev[prev.length - 1];

        if (!last || last.time !== candle.time) {
          const updated = [...prev, candle].slice(-100);
          series.current?.update(candle);
          return updated;
        } else {
          series.current?.update(candle);
          return prev;
        }
      });
    };

    return () => ws.current?.close();
  }, [pair, tf]);

  // =========================
  // UI
  // =========================
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
      <div className="flex items-end gap-4 mb-6">
        <div>
          <div className="text-white text-5xl font-bold">{price ? price.toFixed(5) : '--'}</div>
          <div className="text-slate-400 text-sm mt-1">USD</div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(['1min', '5min', '15min', '1h', '4h', '1d'] as TF[]).map(time => (
          <button
            key={time}
            onClick={() => setTf(time)}
            className={`px-4 py-2 rounded text-sm font-medium transition ${
              tf === time
                ? 'bg-orange-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {time}
          </button>
        ))}
      </div>

      <div ref={chartEl} className="h-96 w-full rounded" />
    </div>
  );
}
