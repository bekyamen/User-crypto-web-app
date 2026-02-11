# Crypto Portfolio Tracker - Quick Reference

## Fast API Examples

### 1. Initialize Sample Portfolio
```bash
# Loads 4 sample cryptocurrencies
curl "http://localhost:3000/api/portfolio/assets?initialize=true"
```

**Response:**
```json
{
  "assets": [
    {
      "id": "bitcoin_1234567890",
      "coin_id": "bitcoin",
      "symbol": "BTC",
      "name": "Bitcoin",
      "amount": 0.5,
      "purchase_price": 45000
    }
  ],
  "count": 4
}
```

---

### 2. Get Portfolio Summary
```bash
curl http://localhost:3000/api/portfolio/summary
```

**Response:**
```json
{
  "total_value": 62165.75,
  "portfolio_change_24h": 1200.50,
  "portfolio_change_24h_percentage": 1.97,
  "assets": [ ... ],
  "allocation": [
    {
      "coin_id": "bitcoin",
      "symbol": "BTC",
      "percentage": 70.65,
      "value": 43893.5
    }
  ]
}
```

---

### 3. Add New Asset
```bash
curl -X POST http://localhost:3000/api/portfolio/assets \
  -H "Content-Type: application/json" \
  -d '{
    "coin_id": "ethereum",
    "symbol": "ETH",
    "name": "Ethereum",
    "amount": 10,
    "purchase_price": 2000
  }'
```

---

### 4. Get Live Prices
```bash
# Get prices for multiple coins
curl "http://localhost:3000/api/market/prices?ids=bitcoin,ethereum,solana,ripple"
```

**Response:**
```json
{
  "bitcoin": {
    "usd": 87787,
    "usd_market_cap": 1754316529753.77,
    "usd_24h_vol": 49292022259.21,
    "usd_24h_change": -1.73
  },
  "ethereum": {
    "usd": 2299.45,
    "usd_market_cap": 276543210000,
    "usd_24h_vol": 15234567890,
    "usd_24h_change": 2.35
  }
}
```

---

### 5. Get Trending Coins
```bash
curl http://localhost:3000/api/market/trending
```

**Returns top trending coins with:**
- Current price
- Market cap
- 24h volume
- Sparkline chart data

---

## Frontend Component Usage

### PortfolioTracker Component
```tsx
import { PortfolioTracker } from '@/components/portfolio-tracker';

export default function Dashboard() {
  return <PortfolioTracker />;
}
```

**Features:**
- Portfolio value display
- Add/remove assets
- Holdings list
- Asset allocation
- Auto-refresh (30s)

---

### LiveMarketData Component
```tsx
import { LiveMarketData } from '@/components/live-market-data';

export default function MarketPage() {
  return <LiveMarketData />;
}
```

**Features:**
- Top 12 trending coins
- Sparkline charts
- 24h changes
- Market cap & volume

---

### PortfolioPerformance Component
```tsx
import { PortfolioPerformance } from '@/components/portfolio-performance';

export default function Analytics() {
  const { summary } = usePortfolio();
  return <PortfolioPerformance assets={summary.assets} />;
}
```

**Features:**
- Line/bar charts
- Performance metrics
- Detailed breakdown table

---

## Custom Hook Usage

### usePortfolio Hook

```typescript
import { usePortfolio } from '@/hooks/usePortfolio';

function MyComponent() {
  // Refreshes every 30 seconds
  const {
    summary,          // Portfolio summary
    assets,           // All assets
    loading,          // Loading state
    error,            // Error message
    refetch,          // Manual refresh
    addAsset,         // Add new asset
    removeAsset,      // Remove asset
    updateAsset,      // Update amount
  } = usePortfolio(30000);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>${summary.total_value.toFixed(2)}</h2>
      <p>{summary.portfolio_change_24h_percentage.toFixed(2)}%</p>
      
      <button onClick={refetch}>Refresh</button>
      
      <button onClick={() => addAsset({
        coin_id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        amount: 5,
      })}>
        Add ETH
      </button>
    </div>
  );
}
```

---

## Service Usage

### CoinGecko Service

```typescript
import {
  getLivePrice,
  getTrendingCoins,
  getMarketData,
  getHistoricalPrices,
} from '@/lib/services/coingecko.service';

// Get prices
const prices = await getLivePrice(['bitcoin', 'ethereum']);

// Get trending
const trending = await getTrendingCoins();

// Get market data
const market = await getMarketData(['bitcoin']);

// Get historical prices (last 30 days)
const history = await getHistoricalPrices('bitcoin', 30);
```

---

### Portfolio Service

```typescript
import {
  addAsset,
  removeAsset,
  calculatePortfolioValue,
  getPortfolioSummary,
  initializeSamplePortfolio,
} from '@/lib/services/portfolio.service';

// Initialize with sample data
initializeSamplePortfolio();

// Get summary
const summary = await getPortfolioSummary();

// Add asset
const newAsset = addAsset({
  coin_id: 'bitcoin',
  symbol: 'BTC',
  name: 'Bitcoin',
  amount: 0.5,
});

// Calculate values
const values = await calculatePortfolioValue();

// Remove asset
removeAsset(newAsset.id);
```

---

## Supported Cryptocurrencies

### Top Cryptocurrencies (by ID)
```
bitcoin          - BTC
ethereum         - ETH
solana           - SOL
ripple           - XRP
cardano          - ADA
polkadot         - DOT
dogecoin         - DOGE
litecoin         - LTC
chainlink        - LINK
uniswap          - UNI
```

### More Available
Over 6000+ cryptocurrencies supported. Use any lowercase coin ID.

---

## Common Calculations

### Portfolio Value
```typescript
total_value = amount × current_price
```

### Profit/Loss
```typescript
pnl = (current_price - purchase_price) × amount
pnl_percentage = (pnl / (purchase_price × amount)) × 100
```

### 24h Change
```typescript
change_24h = amount × current_price × (price_change_24h_percent / 100)
```

### Asset Allocation
```typescript
allocation_percent = (asset_value / total_portfolio_value) × 100
```

---

## Error Handling

### API Error Responses

All errors follow this format:
```json
{
  "error": "Error description"
}
```

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad request
- `404` - Not found
- `500` - Server error

### Frontend Error Handling
```typescript
try {
  const { summary } = usePortfolio();
} catch (error) {
  console.error('Portfolio error:', error);
  // Show error message to user
}
```

---

## Performance Tips

### 1. Reduce API Calls
```typescript
// Good: Request multiple coins at once
await getLivePrice(['bitcoin', 'ethereum', 'solana']);

// Avoid: Multiple separate requests
await getLivePrice(['bitcoin']);
await getLivePrice(['ethereum']);
await getLivePrice(['solana']);
```

### 2. Use Caching
```typescript
// Prices cached for 60 seconds
// Subsequent calls within 60s return cached data
const prices1 = await getLivePrice(['bitcoin']);
const prices2 = await getLivePrice(['bitcoin']); // From cache
```

### 3. Manage Refresh Intervals
```typescript
// Custom refresh interval (5 minutes)
const { summary } = usePortfolio(300000);

// Only refresh when needed
const { refetch } = usePortfolio();
<button onClick={refetch}>Manual Refresh</button>
```

---

## Debugging

### Enable Logging
```typescript
// Check cache status
const { keys, size } = getCacheStats();
console.log(`Cache has ${keys.length} items (${size} KB)`);
```

### Monitor Performance
```typescript
// Time API calls
console.time('fetch-prices');
const prices = await getLivePrice(['bitcoin']);
console.timeEnd('fetch-prices');
```

### Check Rate Limiting
```typescript
// Rate limiter: 10 requests per second
// If hitting limits, add delays:
await new Promise(resolve => setTimeout(resolve, 100));
const prices = await getLivePrice(['bitcoin']);
```

---

## Database Transition

### Current (In-Memory)
```typescript
let portfolioAssets = new Map();
portfolioAssets.set(id, asset);
```

### Future (Database)
```typescript
const asset = await db.assets.create({ ... });
const assets = await db.assets.findMany({ userId });
await db.assets.update(id, { amount });
await db.assets.delete(id);
```

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Refresh Portfolio | Cmd/Ctrl + R |
| Add Asset | Cmd/Ctrl + K |
| Toggle Charts | Tab |
| Dashboard | / then d |

---

## Useful Links

- CoinGecko API: https://docs.coingecko.com
- Next.js Docs: https://nextjs.org/docs
- React Docs: https://react.dev
- Recharts: https://recharts.org
- TypeScript: https://www.typescriptlang.org

---

## Troubleshooting Checklist

- [ ] Portfolio not loading → Check `/api/portfolio/summary` endpoint
- [ ] Prices not updating → Check CoinGecko API status
- [ ] Slow performance → Check cache size with getCacheStats()
- [ ] Rate limit errors → Reduce request frequency
- [ ] Component errors → Check browser console
- [ ] Database errors → Check database connection

---

## Development Tips

### Hot Reload
Changes auto-reload in browser during `npm run dev`

### Type Safety
All components and services are fully typed with TypeScript

### Component Testing
```typescript
// Test portfolio calculation
const summary = await getPortfolioSummary();
expect(summary.total_value).toBeGreaterThan(0);
```

---

## Production Checklist

Before deploying to production:

- [ ] Add real database (PostgreSQL/MongoDB)
- [ ] Configure authentication properly
- [ ] Set environment variables
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS
- [ ] Add error tracking (Sentry)
- [ ] Set up monitoring
- [ ] Add rate limiting
- [ ] Enable logging
- [ ] Test error scenarios
- [ ] Load test the API
- [ ] Review security

---

**Last Updated:** January 2024
**Version:** 1.0.0
