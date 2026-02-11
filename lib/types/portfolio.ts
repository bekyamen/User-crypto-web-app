// Portfolio and cryptocurrency data types

export interface CryptoPrice {
  usd: number;
  usd_market_cap: number;
  usd_24h_vol: number;
  usd_24h_change: number;
  last_updated_at: number;
}

export interface PriceResponse {
  [coinId: string]: CryptoPrice;
}

export interface PortfolioAsset {
  id: string;
  coin_id: string;
  symbol: string;
  name: string;
  amount: number;
  purchase_price?: number;
  purchase_date?: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioValue {
  asset_id: string;
  coin_id: string;
  symbol: string;
  name: string;
  amount: number;
  current_price: number;
  total_value: number;
  purchase_price?: number;
  pnl?: number;
  pnl_percentage?: number;
  price_change_24h: number;
  asset_change_24h: number;
}

export interface PortfolioSummary {
  total_value: number;
  total_value_24h_ago: number;
  portfolio_change_24h: number;
  portfolio_change_24h_percentage: number;
  assets: PortfolioValue[];
  allocation: AssetAllocation[];
  last_updated: number;
}

export interface AssetAllocation {
  coin_id: string;
  symbol: string;
  name: string;
  percentage: number;
  value: number;
}

export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap?: number;
  market_cap_rank?: number;
  total_volume?: number;
  high_24h?: number;
  low_24h?: number;
  price_change_24h?: number;
  price_change_percentage_24h?: number;
  market_cap_change_24h?: number;
  market_cap_change_percentage_24h?: number;
  circulating_supply?: number;
  total_supply?: number;
  max_supply?: number;
  ath?: number;
  atl?: number;
  sparkline?: number[];
}

export interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  market_cap_rank: number;
  sparkline: {
    price: number[];
  };
  data: {
    price: string;
    price_btc: string;
    price_change_percentage_24h: {
      usd: number;
    };
    market_cap: string;
    total_volume: string;
  };
}

export interface NFTCollection {
  id: string;
  name: string;
  symbol: string;
  image: string;
  floor_price?: {
    usd?: number;
    native_currency?: number;
  };
  floor_price_24h_percentage_change?: number;
  volume_24h?: {
    usd?: number;
  };
  market_cap?: {
    usd?: number;
  };
}

export interface CategoryData {
  id: string;
  name: string;
  market_cap: number;
  market_cap_change_24h?: number;
  volume_24h?: number;
  updated_at: number;
}

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}
