'use client';

import { useEffect, useRef, useState } from 'react';
import {
  createChart,
  LineSeries,
  IChartApi,
  UTCTimestamp,
} from 'lightweight-charts';

type TF = '1min' | '5min' | '15min' | '1h' | '4h' | '1d';

type Candle = {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

interface ForexChartProps {
  pair: string; // Example: "EUR/USD"
  tf?: TF;
}

const TWELVE_DATA_WS = 'wss://ws.twelvedata.com/v1/quotes/forex';
const API_KEY = 'YOUR_TWELVE_DATA_API_KEY'; // replace with your Twelve Data key

export function ForexChart({ pair, tf = '1min' }: ForexChartProps) {
  const chartEl = useRef<HTMLDivElement>(null);
  const chart = useRef<IChartApi | null>(null);
  const candleSeries = useRef<any>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [price, setPrice] = useState<number>(0);
  const ws = useRef<WebSocket | null>(null);

  // =========================
  // Chart Initialization
  // =========================
  useEffect(() => {
    if (!chartEl.current) return;

    chart.current = createChart(chartEl.current, {
      layout: { background: { color: '#071225' }, textColor: '#b9c3d6' },
      grid: { vertLines: { color: 'rgba(255,255,255,0.06)' }, horzLines: { color: 'rgba(255,255,255,0.06)' } },
      rightPriceScale: { borderColor: 'rgba(255,255,255,0.1)' },
      timeScale: { borderColor: 'rgba(255,255,255,0.1)', timeVisible: true, secondsVisible: true },
    });

    candleSeries.current = chart.current.addSeries(LineSeries, {
      color: '#26a69a',
      lineWidth: 2,
    });

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
  // WebSocket for live forex
  // =========================
  useEffect(() => {
    const symbol = pair.replace('/', '').toUpperCase();

    ws.current?.close();
    ws.current = new WebSocket(TWELVE_DATA_WS);

    ws.current.onopen = () => {
      ws.current?.send(JSON.stringify({ action: 'subscribe', params: { symbol, interval: tf, apikey: API_KEY } }));
    };

    ws.current.onmessage = e => {
      const data = JSON.parse(e.data);

      // Ensure we have price data
      if (!data.close) return;

      const time = Math.floor(new Date(data.datetime).getTime() / 1000) as UTCTimestamp;
      const newCandle: Candle = {
        time,
        open: +data.open,
        high: +data.high,
        low: +data.low,
        close: +data.close,
        volume: +data.volume || 0,
      };

      setPrice(newCandle.close);

      setCandles(prev => {
        const last = prev[prev.length - 1];
        if (!last || last.time !== newCandle.time) {
          return [...prev, newCandle].slice(-100); // keep last 100 candles
        } else {
          last.close = newCandle.close;
          last.high = Math.max(last.high, newCandle.high);
          last.low = Math.min(last.low, newCandle.low);
          last.volume += newCandle.volume;
          return [...prev];
        }
      });
    };

    return () => ws.current?.close();
  }, [pair, tf]);

  // =========================
  // Render chart
  // =========================
  useEffect(() => {
    candleSeries.current?.setData(candles.map(c => ({ time: c.time, value: c.close })));
  }, [candles]);

  const isPositive = candles.length > 1 ? candles[candles.length - 1].close >= candles[0].close : true;

  // =========================
  // UI
  // =========================
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
      <div className="mb-6">
        <div className="flex items-end gap-4 mb-4">
          <div>
            <div className="text-white text-5xl font-bold">{price ? price.toFixed(5) : '--'}</div>
            <div className="text-slate-400 text-sm mt-1">USD</div>
          </div>
          <div className={`text-2xl font-semibold mb-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {price && candles.length > 1
              ? `${isPositive ? '+' : ''}${((candles[candles.length - 1].close - candles[0].close) / candles[0].close * 100).toFixed(2)}%`
              : '--'}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 pb-6 border-b border-slate-700">
        {(['1min', '5min', '15min', '1h', '4h', '1d'] as TF[]).map(time => (
          <button
            key={time}
            className={`px-4 py-2 rounded text-sm font-medium transition ${
              time === tf ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            onClick={() => setCandles([])}
          >
            {time}
          </button>
        ))}
      </div>

      <div ref={chartEl} className="h-96 w-full rounded bg-gradient-to-b from-slate-800 to-slate-900" />
    </div>
  );
}
