import { useState, useEffect, useCallback } from 'react';

interface PriceData {
  btc: number;
  eth: number;
  lastUpdated: Date;
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true';

export function useCryptoPrices() {
  const [prices, setPrices] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [changes, setChanges] = useState<{ btc: number; eth: number }>({ btc: 0, eth: 0 });

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch(COINGECKO_API);
      if (!res.ok) throw new Error('Failed to fetch prices');
      const data = await res.json();
      setPrices({
        btc: data.bitcoin.usd,
        eth: data.ethereum.usd,
        lastUpdated: new Date(),
      });
      setChanges({
        btc: data.bitcoin.usd_24h_change || 0,
        eth: data.ethereum.usd_24h_change || 0,
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Price fetch failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return { prices, loading, error, changes, refetch: fetchPrices };
}
