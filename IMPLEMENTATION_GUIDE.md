# Crypto Portfolio Tracker - Implementation Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (React/Next.js)                  │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ Portfolio Tracker│  │ Market Dashboard │                │
│  │   (Dashboard)    │  │  (Trending Coins)│                │
│  └────────┬─────────┘  └────────┬─────────┘                │
└───────────┼──────────────────────┼──────────────────────────┘
            │                      │
            │    API Calls         │
            ▼                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend (Node.js/Next.js API Routes)           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ REST API Endpoints                                     │ │
│  │ ├─ /api/portfolio/summary                              │ │
│  │ ├─ /api/portfolio/assets                               │ │
│  │ ├─ /api/portfolio/assets/{id}                          │ │
│  │ ├─ /api/market/prices                                  │ │
│  │ └─ /api/market/trending                                │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Service Layer                                          │ │
│  │ ├─ CoinGecko Service (coingecko.service.ts)            │ │
│  │ └─ Portfolio Service (portfolio.service.ts)            │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Caching Layer (Node.js node-cache)                     │ │
│  │ ├─ Price Cache (60s TTL)                               │ │
│  │ ├─ Market Data Cache (60s TTL)                         │ │
│  │ └─ Trending Cache (60s TTL)                            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
            │
            │    HTTP Requests
            ▼
┌─────────────────────────────────────────────────────────────┐
│               CoinGecko API (External)                       │
│  https://api.coingecko.com/api/v3                            │
│  ├─ /simple/price                                            │
│  ├─ /coins/markets                                           │
│  ├─ /search/trending                                         │
│  └─ ... (6000+ coins)                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
project-root/
├── app/
│   ├── api/
│   │   ├── portfolio/
│   │   │   ├── summary/
│   │   │   │   └── route.ts         # GET portfolio summary
│   │   │   └── assets/
│   │   │       ├── route.ts         # GET/POST assets
│   │   │       └── [id]/
│   │   │           └── route.ts     # GET/PATCH/DELETE single asset
│   │   └── market/
│   │       ├── prices/
│   │       │   └── route.ts         # GET live prices
│   │       └── trending/
│   │           └── route.ts         # GET trending coins
│   ├── dashboard/
│   │   └── page.tsx                 # Portfolio dashboard page
│   └── market/
│       └── page.tsx                 # Market data page
│
├── components/
│   ├── portfolio-tracker.tsx         # Main portfolio component
│   ├── portfolio-performance.tsx     # Performance charts
│   ├── live-market-data.tsx          # Trending coins display
│   └── ... (other UI components)
│
├── hooks/
│   └── usePortfolio.ts              # Custom hook for portfolio data
│
├── lib/
│   ├── services/
│   │   ├── coingecko.service.ts     # CoinGecko API integration
│   │   └── portfolio.service.ts     # Portfolio business logic
│   └── types/
│       └── portfolio.ts              # TypeScript interfaces
│
├── API_DOCUMENTATION.md              # API reference
├── IMPLEMENTATION_GUIDE.md           # This file
└── package.json
```

---

## Core Components & Services

### 1. CoinGecko Service (`lib/services/coingecko.service.ts`)

Handles all API communication with CoinGecko.

**Key Functions:**
- `getLivePrice(coinIds)` - Fetch current prices
- `getMarketData(coinIds)` - Get detailed market data
- `getTrendingCoins()` - Get trending cryptocurrencies
- `getNFTData(nftIds)` - Get NFT data
- `getCategoryData()` - Get market data by category
- `getHistoricalPrices(coinId, days)` - Get price history

**Features:**
- Rate limiting (10 req/sec)
- In-memory caching with 60s TTL
- Automatic retry logic
- Error handling with meaningful messages

### 2. Portfolio Service (`lib/services/portfolio.service.ts`)

Manages portfolio calculations and asset management.

**Key Functions:**
- `addAsset(asset)` - Add new cryptocurrency to portfolio
- `updateAsset(assetId, amount)` - Update asset amount
- `removeAsset(assetId)` - Remove asset from portfolio
- `calculatePortfolioValue()` - Calculate live portfolio values
- `getPortfolioSummary()` - Get complete portfolio summary
- `getPortfolioStats()` - Get portfolio statistics

**Features:**
- Real-time price integration
- Profit/Loss calculation
- Asset allocation percentage
- 24h change tracking
- Sample data initialization

### 3. usePortfolio Hook (`hooks/usePortfolio.ts`)

React hook for portfolio data management.

**Features:**
- Automatic data fetching
- 30-second refresh interval (configurable)
- Error handling
- Loading states
- CRUD operations (add/update/remove assets)

**Usage:**
```typescript
const { summary, assets, loading, error, refetch } = usePortfolio();
```

---

## Data Flow

### Portfolio Value Calculation

```
User Portfolio Assets
    │
    ├─ 0.5 BTC @ $87,787
    ├─ 5 ETH @ $2,299.45
    └─ 50 SOL @ $135.50
    │
    ▼
Fetch Live Prices from CoinGecko
    │
    ├─ BTC: $87,787
    ├─ ETH: $2,299.45
    └─ SOL: $135.50
    │
    ▼
Calculate Portfolio Values
    │
    ├─ BTC: 0.5 × $87,787 = $43,893.50
    ├─ ETH: 5 × $2,299.45 = $11,497.25
    └─ SOL: 50 × $135.50 = $6,775.00
    │
    ▼
Total Portfolio Value = $62,165.75
```

### 24h Change Calculation

```
Current Portfolio Value: $62,165.75

For each asset:
  24h_change_usd = amount × (current_price × 24h_change% / 100)
  
Total 24h Change = Σ(asset_24h_changes)

24h Change % = (total_24h_change / value_24h_ago) × 100
```

---

## Frontend Components

### PortfolioTracker Component

Main component displaying:
- Total portfolio value
- 24h change (USD and %)
- Add/remove assets
- Asset allocation (pie chart)
- Holdings list with PnL
- Manual refresh

### PortfolioPerformance Component

Advanced analytics showing:
- Performance summary (value, 24h change)
- Switchable charts (line/bar)
- Detailed performance table
- Asset-by-asset breakdown

### LiveMarketData Component

Displays:
- Trending cryptocurrencies (top 12)
- Sparkline charts for each coin
- 24h price changes
- Market cap and volume
- Auto-refresh every 60 seconds

---

## API Integration Examples

### Example 1: Add Bitcoin to Portfolio

```typescript
// Frontend
const response = await fetch('/api/portfolio/assets', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    coin_id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    amount: 0.5,
    purchase_price: 45000,
  }),
});

// Backend receives → validates → stores → returns asset
// Frontend receives → updates local state → re-renders
```

### Example 2: Get Portfolio Summary

```typescript
// Frontend initiates
const response = await fetch('/api/portfolio/summary');
const summary = response.json();

// Backend:
// 1. Fetch all portfolio assets from memory
// 2. Extract coin IDs
// 3. Call CoinGecko API for live prices (cached)
// 4. Calculate values, allocations, 24h changes
// 5. Return complete summary
```

### Example 3: Refresh Live Prices

```typescript
// Frontend polling (every 30s)
useEffect(() => {
  const interval = setInterval(() => {
    fetchPortfolioSummary();
  }, 30000);
  
  return () => clearInterval(interval);
}, []);

// Always gets fresh data from cache or API
```

---

## Performance Considerations

### Caching Strategy

**60-Second TTL for:**
- Live prices
- Market data
- Trending coins

**Benefits:**
- Reduced API calls
- Faster response times
- Compliance with rate limits
- Cost savings

### Database Transitions (For Production)

Current implementation uses in-memory storage. For production:

```typescript
// Replace this:
let portfolioAssets: Map<string, PortfolioAsset> = new Map();

// With:
async function addAsset(asset: PortfolioAsset) {
  return await db.portfolioAssets.create(asset);
}

async function getAssets(userId: string) {
  return await db.portfolioAssets.findMany({ userId });
}
```

---

## Error Handling Strategy

### API Error Handling

```typescript
try {
  const prices = await getLivePrice(['bitcoin']);
} catch (error) {
  // 1. Log error
  // 2. Check cache for stale data
  // 3. Return cached data if available
  // 4. Or throw user-friendly error
}
```

### Frontend Error Display

```typescript
if (error) {
  return (
    <Card className="bg-red-500/10 border-red-500/30">
      <p className="text-red-400">Error: {error}</p>
      <Button onClick={refetch}>Retry</Button>
    </Card>
  );
}
```

---

## Testing Recommendations

### Unit Tests

```typescript
describe('portfolio.service', () => {
  it('should calculate portfolio value correctly', () => {
    addAsset({ coin_id: 'bitcoin', amount: 0.5, ... });
    const value = calculatePortfolioValue();
    expect(value).toBeDefined();
  });
});
```

### Integration Tests

```typescript
describe('GET /api/portfolio/summary', () => {
  it('should return portfolio summary', async () => {
    const res = await fetch('/api/portfolio/summary');
    expect(res.status).toBe(200);
  });
});
```

### E2E Tests

```typescript
describe('Portfolio Flow', () => {
  it('should add asset and update portfolio value', async () => {
    // Add asset
    // Verify in summary
    // Check 24h changes
  });
});
```

---

## Production Deployment Checklist

- [ ] Replace in-memory storage with database
- [ ] Add authentication/authorization
- [ ] Implement proper logging
- [ ] Add monitoring/alerting
- [ ] Set up CI/CD pipeline
- [ ] Configure rate limiting
- [ ] Add request validation
- [ ] Implement CORS properly
- [ ] Set up error tracking
- [ ] Add performance metrics
- [ ] Document API endpoints
- [ ] Create user documentation

---

## Scaling Considerations

### Horizontal Scaling

1. **Database Separation** - Use PostgreSQL/MongoDB instead of in-memory
2. **Cache Layer** - Redis for distributed caching
3. **API Gateway** - Rate limiting and load balancing
4. **Message Queue** - Bull/RabbitMQ for async tasks

### Performance Optimization

1. **Database Indexing** - Index on user_id, coin_id
2. **Query Optimization** - Batch requests to CoinGecko
3. **Pagination** - Limit results in large portfolios
4. **Background Jobs** - Update prices periodically

### Cost Optimization

1. **CoinGecko** - Consider paid plans for higher limits
2. **Caching** - Longer TTL for less frequently accessed data
3. **API Consolidation** - Combine requests where possible
4. **Database** - Use read replicas for analytics

---

## Troubleshooting

### Issue: "Failed to fetch prices"

**Solutions:**
1. Check internet connection
2. Verify CoinGecko API status
3. Check rate limiting (max 10 req/sec)
4. Review API key validity

### Issue: "Stale portfolio data"

**Solutions:**
1. Click refresh button
2. Wait for auto-refresh (30s)
3. Clear browser cache
4. Check backend logs

### Issue: "Memory usage growing"

**Solutions:**
1. Check cache size
2. Reduce cache TTL
3. Implement data pagination
4. Use database instead of memory

---

## Resources

- CoinGecko API: https://docs.coingecko.com/reference/introduction
- Next.js: https://nextjs.org/docs
- React: https://react.dev
- Recharts: https://recharts.org
- TypeScript: https://www.typescriptlang.org

---

## Support & Contribution

For issues, feature requests, or contributions, please refer to the project repository.
