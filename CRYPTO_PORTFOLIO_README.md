# Crypto Portfolio Tracker - Complete Implementation

A production-ready cryptocurrency portfolio tracking application built with Next.js, TypeScript, and CoinGecko API integration. Track your crypto holdings, monitor real-time prices, and analyze portfolio performance.

## Features

### Portfolio Management
- Add, update, and remove cryptocurrencies from your portfolio
- Track holdings with purchase price and date
- Real-time portfolio value calculation
- Profit/Loss tracking per asset
- Asset allocation visualization
- Portfolio summary with 24h changes

### Market Data
- Real-time crypto prices from CoinGecko
- Trending cryptocurrencies display
- Market cap, volume, and price changes
- Sparkline charts for visual analysis
- Support for 6000+ cryptocurrencies

### Performance Analytics
- Portfolio performance charts (line and bar)
- Asset-by-asset performance breakdown
- 24-hour change tracking (USD and %)
- Historical price data
- Interactive dashboard with multiple views

### Technical Features
- 60-second caching for optimal performance
- Rate limiting (10 requests/second)
- Automatic retry logic
- Error handling and recovery
- Real-time price polling (30s intervals)
- Responsive design for all devices

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Internet connection for CoinGecko API

### Installation

1. **Clone or navigate to the project**
   ```bash
   cd your-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Landing page: `http://localhost:3000`
   - Dashboard: `http://localhost:3000/dashboard` (after login)
   - Market data: `http://localhost:3000/market`

### Demo Credentials
- **Email**: demo@bittrading.com
- **Password**: password

## Project Structure

```
src/
├── app/
│   ├── api/                    # REST API endpoints
│   │   ├── portfolio/
│   │   │   ├── summary/        # GET portfolio summary
│   │   │   └── assets/         # CRUD operations
│   │   └── market/
│   │       ├── prices/         # Live prices
│   │       └── trending/       # Trending coins
│   ├── dashboard/
│   │   └── page.tsx            # Portfolio dashboard
│   └── market/
│       └── page.tsx            # Market data page
│
├── components/
│   ├── portfolio-tracker.tsx    # Main portfolio component
│   ├── portfolio-performance.tsx # Analytics charts
│   ├── live-market-data.tsx     # Trending coins
│   └── ... (other UI components)
│
├── hooks/
│   └── usePortfolio.ts          # Portfolio data hook
│
├── lib/
│   ├── services/
│   │   ├── coingecko.service.ts # CoinGecko API
│   │   └── portfolio.service.ts # Portfolio logic
│   └── types/
│       └── portfolio.ts          # TypeScript interfaces
│
├── API_DOCUMENTATION.md         # Complete API reference
└── IMPLEMENTATION_GUIDE.md      # Technical guide
```

## Core Services

### CoinGecko Service (`lib/services/coingecko.service.ts`)

Handles all cryptocurrency data from CoinGecko API.

**Available Functions:**
```typescript
// Get live prices
getLivePrice(['bitcoin', 'ethereum'])

// Get trending coins
getTrendingCoins()

// Get historical prices
getHistoricalPrices('bitcoin', 30)

// Get NFT data
getNFTData(['opensea-collection-id'])

// Get market categories
getCategoryData()
```

**Features:**
- Automatic caching (60s TTL)
- Rate limiting (10 req/sec)
- Retry logic with exponential backoff
- Comprehensive error handling

### Portfolio Service (`lib/services/portfolio.service.ts`)

Manages portfolio calculations and asset operations.

**Available Functions:**
```typescript
// Asset CRUD
addAsset(asset)
updateAsset(assetId, amount)
removeAsset(assetId)
getAssets()

// Portfolio calculations
calculatePortfolioValue()
getPortfolioSummary()
getPortfolioStats()

// Utilities
initializeSamplePortfolio()
resetPortfolio()
```

## API Endpoints

### Portfolio Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/portfolio/summary` | Get portfolio summary with allocations |
| GET | `/api/portfolio/assets` | Get all assets in portfolio |
| POST | `/api/portfolio/assets` | Add new asset |
| GET | `/api/portfolio/assets/{id}` | Get single asset |
| PATCH | `/api/portfolio/assets/{id}` | Update asset amount |
| DELETE | `/api/portfolio/assets/{id}` | Remove asset |

### Market Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/market/prices?ids=bitcoin,ethereum` | Get live prices |
| GET | `/api/market/trending` | Get trending coins |

### Example Requests

**Get Portfolio Summary:**
```bash
curl http://localhost:3000/api/portfolio/summary
```

**Add Bitcoin:**
```bash
curl -X POST http://localhost:3000/api/portfolio/assets \
  -H "Content-Type: application/json" \
  -d '{
    "coin_id": "bitcoin",
    "symbol": "BTC",
    "name": "Bitcoin",
    "amount": 0.5,
    "purchase_price": 45000
  }'
```

**Get Live Prices:**
```bash
curl "http://localhost:3000/api/market/prices?ids=bitcoin,ethereum,solana"
```

## Frontend Components

### PortfolioTracker
Main dashboard component displaying:
- Total portfolio value and 24h changes
- Asset allocation with pie chart
- Holdings list with individual metrics
- Add/remove asset functionality
- Real-time price updates

### PortfolioPerformance
Advanced analytics showing:
- Line and bar charts
- Performance summary cards
- Detailed performance table
- Asset comparison

### LiveMarketData
Market overview displaying:
- Top 12 trending cryptocurrencies
- Sparkline price charts
- 24h price changes
- Market cap and volume
- Auto-refresh functionality

## Configuration

### Refresh Intervals

```typescript
// Portfolio refresh: 30 seconds (configurable)
const { summary } = usePortfolio(30000);

// Market data refresh: 60 seconds
const fetchMarketData = () => {
  // Automatic 60-second refresh
};
```

### CoinGecko API Configuration

API key is embedded in the service:
```typescript
const API_KEY = 'CG-CWaa2GFJKQsotejdezBSvBaN';
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
```

## Usage Examples

### Add Asset to Portfolio

```typescript
const { addAsset } = usePortfolio();

await addAsset({
  coin_id: 'ethereum',
  symbol: 'ETH',
  name: 'Ethereum',
  amount: 5,
  purchase_price: 2500,
});
```

### Get Portfolio Summary

```typescript
const { summary } = usePortfolio();

console.log(`Total: $${summary.total_value}`);
console.log(`24h Change: ${summary.portfolio_change_24h_percentage}%`);

summary.allocation.forEach(asset => {
  console.log(`${asset.symbol}: ${asset.percentage.toFixed(1)}%`);
});
```

### Fetch Trending Coins

```typescript
const response = await fetch('/api/market/trending');
const { coins } = await response.json();

coins.forEach(coin => {
  console.log(`${coin.name} (${coin.symbol}): $${coin.data.price}`);
});
```

### Get Live Prices

```typescript
const response = await fetch('/api/market/prices?ids=bitcoin,ethereum');
const prices = await response.json();

Object.entries(prices).forEach(([coin, data]: [string, any]) => {
  console.log(`${coin}: $${data.usd} (${data.usd_24h_change}%)`);
});
```

## Performance & Caching

### Cache Strategy
- **Price Data**: 60-second TTL
- **Market Data**: 60-second TTL
- **Trending Coins**: 60-second TTL
- **In-memory Cache**: Node.js `node-cache`

### Optimization Tips
1. Leverage 60-second cache for repeated requests
2. Use batch requests when fetching multiple coins
3. Enable client-side caching for dashboard data
4. Adjust refresh intervals based on usage

### Rate Limiting
- CoinGecko Free Tier: 10-50 requests/minute
- Built-in rate limiter: 10 requests/second
- Automatic request queuing

## Data Models

### PortfolioAsset
```typescript
{
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
```

### PortfolioValue
```typescript
{
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
```

### PortfolioSummary
```typescript
{
  total_value: number;
  total_value_24h_ago: number;
  portfolio_change_24h: number;
  portfolio_change_24h_percentage: number;
  assets: PortfolioValue[];
  allocation: AssetAllocation[];
  last_updated: number;
}
```

## Error Handling

All API endpoints include error handling:

```typescript
try {
  const prices = await getLivePrice(['bitcoin']);
} catch (error) {
  // Returns cached data if available
  // Or throws user-friendly error
}
```

Frontend automatically handles errors:
```typescript
if (error) {
  return <ErrorCard message={error} onRetry={refetch} />;
}
```

## Database Integration (Production)

Currently uses in-memory storage. For production, integrate with:

```typescript
// PostgreSQL
import { createClient } from '@supabase/supabase-js';

// MongoDB
import { MongoClient } from 'mongodb';

// Neon
import { sql } from '@vercel/postgres';
```

## Deployment

### Vercel Deployment
```bash
vercel deploy
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD npm start
```

## Environment Variables

```env
# CoinGecko API (embedded, no configuration needed)
COINGECKO_API_KEY=CG-CWaa2GFJKQsotejdezBSvBaN

# Database (optional for production)
DATABASE_URL=postgresql://...

# Authentication (NextAuth.js)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## Testing

### Unit Tests
```typescript
describe('portfolio.service', () => {
  it('calculates portfolio value correctly', () => {
    // Test implementation
  });
});
```

### Integration Tests
```typescript
describe('GET /api/portfolio/summary', () => {
  it('returns valid portfolio summary', async () => {
    // Test implementation
  });
});
```

## Troubleshooting

### Issue: "Failed to fetch prices"
- Check internet connection
- Verify CoinGecko API status
- Review rate limiting (10 req/sec max)

### Issue: "Stale portfolio data"
- Click manual refresh button
- Wait for auto-refresh (30 seconds)
- Clear browser cache

### Issue: "Portfolio not updating"
- Verify market data is available
- Check browser console for errors
- Ensure authentication is active

## Future Enhancements

- WebSocket support for real-time prices
- Database persistence (PostgreSQL/MongoDB)
- Advanced analytics and reporting
- Price alerts and notifications
- Portfolio history and backtesting
- Multi-user support
- Portfolio sharing
- Advanced charting (TradingView)
- Mobile app (React Native)

## Dependencies

### Core
- Next.js 16.0.10 - React framework
- React 19.2.0 - UI library
- TypeScript 5 - Type safety

### Data Management
- axios 1.6.8 - HTTP client
- node-cache 5.1.2 - In-memory caching
- zod 3.25.76 - Schema validation

### UI Components
- Recharts 2.15.4 - Charts and graphs
- shadcn/ui - Component library
- Tailwind CSS 4.1.9 - Styling

### Authentication
- NextAuth.js 5.0.0-beta.20 - Authentication
- bcryptjs 2.4.3 - Password hashing
- jose 5.6.2 - JWT handling

## Documentation

- **API_DOCUMENTATION.md** - Complete API reference
- **IMPLEMENTATION_GUIDE.md** - Technical implementation details
- **This README** - Getting started guide

## Support

For issues, feature requests, or contributions:
1. Check documentation first
2. Review API_DOCUMENTATION.md for endpoint details
3. Check IMPLEMENTATION_GUIDE.md for technical details
4. Open an issue on the repository

## License

MIT License - See LICENSE file for details

---

## Quick Feature Overview

### Dashboard
- Real-time portfolio value tracking
- Asset allocation pie chart
- Holdings list with PnL
- Quick add/remove asset buttons
- 24h performance metrics
- Auto-refresh every 30 seconds

### Market Page
- Trending cryptocurrencies display
- Top 12 coins with sparkline charts
- 24h price changes
- Market cap and volume data
- Interactive trending data

### Performance Page
- Multiple chart types (line/bar)
- Performance summary cards
- Detailed performance table
- Asset comparison

## Getting Help

1. **API Issues** → Check `/API_DOCUMENTATION.md`
2. **Architecture Questions** → Check `/IMPLEMENTATION_GUIDE.md`
3. **Feature Usage** → Check component JSDoc comments
4. **Data Formats** → Check `/lib/types/portfolio.ts`

---

Start tracking your crypto portfolio with real-time data and advanced analytics!
