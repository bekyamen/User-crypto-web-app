import axios from 'axios';
import NodeCache from 'node-cache';

import type {
  PriceResponse,
  CoinMarketData,
  TrendingCoin,
  NFTCollection,
  CategoryData,
} from '@/lib/types/portfolio';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
const API_KEY = 'CG-CWaa2GFJKQsotejdezBSvBaN';

// Initialize in-memory cache with 60-second TTL
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

// Axios instance with rate limiting
const axiosInstance = axios.create({
  baseURL: COINGECKO_BASE_URL,
  timeout: 10000,
});

// Rate limiting: max 10 requests per second
let requestCount = 0;
let lastResetTime = Date.now();

const rateLimitMiddleware = async () => {
  const now = Date.now();
  if (now - lastResetTime > 1000) {
    requestCount = 0;
    lastResetTime = now;
  }

  if (requestCount >= 10) {
    const waitTime = 1000 - (now - lastResetTime);
    if (waitTime > 0) {
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  requestCount++;
};

/**
 * Get live prices for multiple cryptocurrencies
 * @param coinIds - Array of coin IDs (e.g., ['bitcoin', 'ethereum'])
 * @returns Price data with market info
 */
export async function getLivePrice(
  coinIds: string | string[]
): Promise<PriceResponse> {
  const cacheKey = `price_${JSON.stringify(coinIds)}`;
  const cached = cache.get<PriceResponse>(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    await rateLimitMiddleware();

    const ids = Array.isArray(coinIds) ? coinIds.join(',') : coinIds;
    const response = await axiosInstance.get<PriceResponse>('/simple/price', {
      params: {
        ids,
        vs_currencies: 'usd',
        include_market_cap: true,
        include_24hr_vol: true,
        include_24hr_change: true,
        include_last_updated_at: true,
        x_cg_demo_api_key: API_KEY,
      },
    });

    cache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching live prices:', error);
    throw new Error('Failed to fetch crypto prices');
  }
}

/**
 * Get detailed market data for cryptocurrencies
 * @param coinIds - Array of coin IDs
 * @returns Detailed market data
 */
export async function getMarketData(
  coinIds: string[]
): Promise<CoinMarketData[]> {
  const cacheKey = `market_${JSON.stringify(coinIds)}`;
  const cached = cache.get<CoinMarketData[]>(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    await rateLimitMiddleware();

    const response = await axiosInstance.get('/coins/markets', {
      params: {
        ids: coinIds.join(','),
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 250,
        sparkline: true,
        x_cg_demo_api_key: API_KEY,
      },
    });

    const data = response.data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
      total_volume: coin.total_volume,
      high_24h: coin.high_24h,
      low_24h: coin.low_24h,
      price_change_24h: coin.price_change_24h,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap_change_24h: coin.market_cap_change_24h,
      market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h,
      circulating_supply: coin.circulating_supply,
      total_supply: coin.total_supply,
      max_supply: coin.max_supply,
      ath: coin.ath,
      atl: coin.atl,
      sparkline: coin.sparkline?.price || [],
    }));

    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw new Error('Failed to fetch market data');
  }
}

/**
 * Get trending cryptocurrencies
 * @returns Trending coins data
 */
export async function getTrendingCoins(): Promise<TrendingCoin[]> {
  const cacheKey = 'trending_coins';
  const cached = cache.get<TrendingCoin[]>(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    await rateLimitMiddleware();

    const response = await axiosInstance.get('/search/trending', {
      params: {
        x_cg_demo_api_key: API_KEY,
      },
    });

    const data = response.data.coins.map((coin: any) => ({
      id: coin.item.id,
      name: coin.item.name,
      symbol: coin.item.symbol.toUpperCase(),
      image: coin.item.image,
      market_cap_rank: coin.item.market_cap_rank,
      sparkline: coin.item.sparkline,
      data: {
        price: coin.item.data?.price || '0',
        price_btc: coin.item.data?.price_btc || '0',
        price_change_percentage_24h: coin.item.data?.price_change_percentage_24h || { usd: 0 },
        market_cap: coin.item.data?.market_cap || '0',
        total_volume: coin.item.data?.total_volume || '0',
      },
    }));

    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    throw new Error('Failed to fetch trending coins');
  }
}

/**
 * Get NFT floor price data
 * @param nftIds - Array of NFT collection IDs
 * @returns NFT collection data
 */
export async function getNFTData(nftIds: string[]): Promise<NFTCollection[]> {
  const cacheKey = `nft_${JSON.stringify(nftIds)}`;
  const cached = cache.get<NFTCollection[]>(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    await rateLimitMiddleware();

    const response = await axiosInstance.get('/nfts/list', {
      params: {
        x_cg_demo_api_key: API_KEY,
      },
    });

    const data = response.data
      .filter((nft: any) => nftIds.includes(nft.id))
      .map((nft: any) => ({
        id: nft.id,
        name: nft.name,
        symbol: nft.symbol || '',
        image: nft.image?.small || '',
        floor_price: nft.floor_price,
        floor_price_24h_percentage_change: nft.floor_price_24h_percentage_change,
        volume_24h: nft.volume_24h,
        market_cap: nft.market_cap,
      }));

    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching NFT data:', error);
    throw new Error('Failed to fetch NFT data');
  }
}

/**
 * Get market data by category
 * @returns Category market data
 */
export async function getCategoryData(): Promise<CategoryData[]> {
  const cacheKey = 'category_data';
  const cached = cache.get<CategoryData[]>(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    await rateLimitMiddleware();

    const response = await axiosInstance.get('/coins/categories', {
      params: {
        order: 'market_cap_desc',
        x_cg_demo_api_key: API_KEY,
      },
    });

    const data = response.data.map((category: any) => ({
      id: category.id,
      name: category.name,
      market_cap: category.market_cap || 0,
      market_cap_change_24h: category.market_cap_change_24h,
      volume_24h: category.volume_24h,
      updated_at: Date.now(),
    }));

    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching category data:', error);
    throw new Error('Failed to fetch category data');
  }
}

/**
 * Get historical price data
 * @param coinId - Coin ID
 * @param days - Number of days (1, 7, 30, etc.)
 * @returns Array of price points [timestamp, price]
 */
export async function getHistoricalPrices(
  coinId: string,
  days: number
): Promise<number[][]> {
  const cacheKey = `history_${coinId}_${days}d`;
  const cached = cache.get<number[][]>(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    await rateLimitMiddleware();

    const response = await axiosInstance.get(`/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days,
        x_cg_demo_api_key: API_KEY,
      },
    });

    cache.set(cacheKey, response.data.prices);
    return response.data.prices;
  } catch (error) {
    console.error(`Error fetching historical prices for ${coinId}:`, error);
    throw new Error('Failed to fetch historical prices');
  }
}

/**
 * Clear all cache
 */
export function clearCache(): void {
  cache.flushAll();
}

/**
 * Get cache stats for monitoring
 */
export function getCacheStats(): { keys: string[]; size: number } {
  return {
    keys: cache.keys(),
    size: cache.getStats().ksize,
  };
}
