import { getLivePrice } from './coingecko.service';
import type {
  PortfolioAsset,
  PortfolioValue,
  PortfolioSummary,
  AssetAllocation,
  PriceResponse,
} from '@/lib/types/portfolio';

// In-memory portfolio store (replace with database in production)
let portfolioAssets: Map<string, PortfolioAsset> = new Map();

/**
 * Add or update an asset in the portfolio
 */
export function addAsset(asset: Omit<PortfolioAsset, 'id' | 'created_at' | 'updated_at'>): PortfolioAsset {
  const id = `${asset.coin_id}_${Date.now()}`;
  const now = new Date().toISOString();

  const portfolioAsset: PortfolioAsset = {
    ...asset,
    id,
    created_at: now,
    updated_at: now,
  };

  portfolioAssets.set(id, portfolioAsset);
  return portfolioAsset;
}

/**
 * Update an asset's amount
 */
export function updateAsset(
  assetId: string,
  amount: number
): PortfolioAsset | null {
  const asset = portfolioAssets.get(assetId);
  if (!asset) return null;

  const updated: PortfolioAsset = {
    ...asset,
    amount,
    updated_at: new Date().toISOString(),
  };

  portfolioAssets.set(assetId, updated);
  return updated;
}

/**
 * Remove an asset from the portfolio
 */
export function removeAsset(assetId: string): boolean {
  return portfolioAssets.delete(assetId);
}

/**
 * Get all portfolio assets
 */
export function getAssets(): PortfolioAsset[] {
  return Array.from(portfolioAssets.values());
}

/**
 * Get a single asset
 */
export function getAsset(assetId: string): PortfolioAsset | null {
  return portfolioAssets.get(assetId) || null;
}

/**
 * Calculate portfolio value with live prices
 */
export async function calculatePortfolioValue(): Promise<PortfolioValue[]> {
  const assets = getAssets();
  if (assets.length === 0) return [];

  // Fetch live prices for all coins in portfolio
  const coinIds = [...new Set(assets.map(a => a.coin_id))];
  let prices: PriceResponse = {};

  try {
    prices = await getLivePrice(coinIds);
  } catch (error) {
    console.error('Error fetching prices:', error);
    // Return portfolio with last known prices if API fails
    return assets.map(asset => ({
      asset_id: asset.id,
      coin_id: asset.coin_id,
      symbol: asset.symbol,
      name: asset.name,
      amount: asset.amount,
      current_price: 0,
      total_value: 0,
      purchase_price: asset.purchase_price,
      pnl: asset.purchase_price
        ? asset.amount * ((0 - asset.purchase_price))
        : undefined,
      pnl_percentage: asset.purchase_price
        ? ((0 - asset.purchase_price) / asset.purchase_price) * 100
        : undefined,
      price_change_24h: 0,
      asset_change_24h: 0,
    }));
  }

  return assets.map(asset => {
    const priceData = prices[asset.coin_id];
    const currentPrice = priceData?.usd || 0;
    const totalValue = asset.amount * currentPrice;
    const priceChange24h = priceData?.usd_24h_change || 0;
    const assetChange24h = (asset.amount * currentPrice * priceChange24h) / 100;

    let pnl: number | undefined;
    let pnlPercentage: number | undefined;

    if (asset.purchase_price) {
      pnl = totalValue - asset.amount * asset.purchase_price;
      pnlPercentage = (pnl / (asset.amount * asset.purchase_price)) * 100;
    }

    return {
      asset_id: asset.id,
      coin_id: asset.coin_id,
      symbol: asset.symbol,
      name: asset.name,
      amount: asset.amount,
      current_price: currentPrice,
      total_value: totalValue,
      purchase_price: asset.purchase_price,
      pnl,
      pnl_percentage: pnlPercentage,
      price_change_24h: priceChange24h,
      asset_change_24h: assetChange24h,
    };
  });
}

/**
 * Calculate portfolio summary with allocation
 */
export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  const portfolioValues = await calculatePortfolioValue();

  if (portfolioValues.length === 0) {
    return {
      total_value: 0,
      total_value_24h_ago: 0,
      portfolio_change_24h: 0,
      portfolio_change_24h_percentage: 0,
      assets: [],
      allocation: [],
      last_updated: Date.now(),
    };
  }

  // Calculate total values
  const totalValue = portfolioValues.reduce((sum, asset) => sum + asset.total_value, 0);
  const portfolio24hChangeAmount = portfolioValues.reduce(
    (sum, asset) => sum + asset.asset_change_24h,
    0
  );
  const totalValue24hAgo = totalValue - portfolio24hChangeAmount;
  const portfolio24hChangePercentage =
    totalValue24hAgo > 0
      ? (portfolio24hChangeAmount / totalValue24hAgo) * 100
      : 0;

  // Calculate asset allocation percentages
  const allocation: AssetAllocation[] = portfolioValues.map(asset => ({
    coin_id: asset.coin_id,
    symbol: asset.symbol,
    name: asset.name,
    percentage: totalValue > 0 ? (asset.total_value / totalValue) * 100 : 0,
    value: asset.total_value,
  }));

  return {
    total_value: totalValue,
    total_value_24h_ago: totalValue24hAgo,
    portfolio_change_24h: portfolio24hChangeAmount,
    portfolio_change_24h_percentage: portfolio24hChangePercentage,
    assets: portfolioValues,
    allocation: allocation.sort((a, b) => b.percentage - a.percentage),
    last_updated: Date.now(),
  };
}

/**
 * Initialize portfolio with sample data
 */
export function initializeSamplePortfolio(): void {
  portfolioAssets.clear();

  // Add sample cryptocurrencies
  const sampleAssets = [
    {
      coin_id: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      amount: 0.5,
      purchase_price: 45000,
    },
    {
      coin_id: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      amount: 5,
      purchase_price: 2500,
    },
    {
      coin_id: 'solana',
      symbol: 'SOL',
      name: 'Solana',
      amount: 50,
      purchase_price: 120,
    },
    {
      coin_id: 'ripple',
      symbol: 'XRP',
      name: 'Ripple',
      amount: 1000,
      purchase_price: 0.75,
    },
  ];

  sampleAssets.forEach(asset => {
    addAsset({
      ...asset,
      purchase_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  });
}

/**
 * Reset portfolio
 */
export function resetPortfolio(): void {
  portfolioAssets.clear();
}

/**
 * Get portfolio statistics
 */
export async function getPortfolioStats(): Promise<{
  totalAssets: number;
  averageHolding: number;
  topAsset: PortfolioValue | null;
  worstPerformer: PortfolioValue | null;
}> {
  const values = await calculatePortfolioValue();

  if (values.length === 0) {
    return {
      totalAssets: 0,
      averageHolding: 0,
      topAsset: null,
      worstPerformer: null,
    };
  }

  return {
    totalAssets: values.length,
    averageHolding: values.reduce((sum, a) => sum + a.total_value, 0) / values.length,
    topAsset: values.reduce((top, asset) =>
      asset.total_value > (top?.total_value || 0) ? asset : top
    ),
    worstPerformer: values.reduce((worst, asset) =>
      asset.pnl_percentage !== undefined && worst.pnl_percentage !== undefined
        ? asset.pnl_percentage < worst.pnl_percentage
          ? asset
          : worst
        : worst
    ),
  };
}
