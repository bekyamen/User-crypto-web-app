# Crypto Portfolio Tracker - API Documentation

## Overview

This document provides comprehensive API reference for the Crypto Portfolio Tracking application. The API integrates with CoinGecko for real-time crypto market data and manages user portfolios.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, the application uses NextAuth.js for authentication. All protected endpoints require an active session.

---

## Portfolio Endpoints

### Get Portfolio Summary

Retrieves the complete portfolio summary with all calculated values and allocations.

**Endpoint:** `GET /portfolio/summary`

**Response:**
```json
{
  "total_value": 50000,
  "total_value_24h_ago": 48000,
  "portfolio_change_24h": 2000,
  "portfolio_change_24h_percentage": 4.17,
  "assets": [
    {
      "asset_id": "bitcoin_1234567890",
      "coin_id": "bitcoin",
      "symbol": "BTC",
      "name": "Bitcoin",
      "amount": 0.5,
      "current_price": 87787,
      "total_value": 43893.5,
      "purchase_price": 45000,
      "pnl": -553.5,
      "pnl_percentage": -1.23,
      "price_change_24h": -1.73,
      "asset_change_24h": -760.55
    }
  ],
  "allocation": [
    {
      "coin_id": "bitcoin",
      "symbol": "BTC",
      "name": "Bitcoin",
      "percentage": 87.86,
      "value": 43893.5
    }
  ],
  "last_updated": 1703472000000
}
```

---

### Get All Assets

Retrieve all cryptocurrencies in the portfolio.

**Endpoint:** `GET /portfolio/assets`

**Query Parameters:**
- `initialize` (optional): `"true"` - Initialize portfolio with sample data

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
      "purchase_price": 45000,
      "purchase_date": "2023-11-01T00:00:00Z",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

---

### Add Asset

Add a new cryptocurrency to the portfolio.

**Endpoint:** `POST /portfolio/assets`

**Request Body:**
```json
{
  "coin_id": "bitcoin",
  "symbol": "BTC",
  "name": "Bitcoin",
  "amount": 0.5,
  "purchase_price": 45000,
  "purchase_date": "2023-11-01T00:00:00Z"
}
```

**Response:** Returns the created asset object (201 Created)

---

### Get Single Asset

Retrieve details for a specific asset.

**Endpoint:** `GET /portfolio/assets/{id}`

**Response:**
```json
{
  "id": "bitcoin_1234567890",
  "coin_id": "bitcoin",
  "symbol": "BTC",
  "name": "Bitcoin",
  "amount": 0.5,
  "purchase_price": 45000,
  "purchase_date": "2023-11-01T00:00:00Z",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### Update Asset

Update the amount of an asset in the portfolio.

**Endpoint:** `PATCH /portfolio/assets/{id}`

**Request Body:**
```json
{
  "amount": 1.5
}
```

**Response:** Returns updated asset object

---

### Delete Asset

Remove an asset from the portfolio.

**Endpoint:** `DELETE /portfolio/assets/{id}`

**Response:**
```json
{
  "message": "Asset removed successfully"
}
```

---

## Market Data Endpoints

### Get Live Prices

Fetch current prices for multiple cryptocurrencies.

**Endpoint:** `GET /market/prices`

**Query Parameters:**
- `ids` (required): Comma-separated list of coin IDs (e.g., `"bitcoin,ethereum,solana"`)

**Response:**
```json
{
  "bitcoin": {
    "usd": 87787,
    "usd_market_cap": 1754316529753.77,
    "usd_24h_vol": 49292022259.21,
    "usd_24h_change": -1.73,
    "last_updated_at": 1703472000
  },
  "ethereum": {
    "usd": 2299.45,
    "usd_market_cap": 276543210000,
    "usd_24h_vol": 15234567890,
    "usd_24h_change": 2.35,
    "last_updated_at": 1703472000
  }
}
```

---

### Get Trending Coins

Fetch trending cryptocurrencies based on CoinGecko data.

**Endpoint:** `GET /market/trending`

**Response:**
```json
{
  "coins": [
    {
      "id": "bitcoin",
      "name": "Bitcoin",
      "symbol": "BTC",
      "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      "market_cap_rank": 1,
      "sparkline": {
        "price": [87000, 87500, 87787, ...]
      },
      "data": {
        "price": "$87,787.50",
        "price_btc": "1",
        "price_change_percentage_24h": {
          "usd": -1.73
        },
        "market_cap": "$1.75T",
        "total_volume": "$49.2B"
      }
    }
  ],
  "count": 12
}
```

---

## Data Models

### PortfolioAsset

```typescript
interface PortfolioAsset {
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
interface PortfolioValue {
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
interface PortfolioSummary {
  total_value: number;
  total_value_24h_ago: number;
  portfolio_change_24h: number;
  portfolio_change_24h_percentage: number;
  assets: PortfolioValue[];
  allocation: AssetAllocation[];
  last_updated: number;
}
```

### AssetAllocation

```typescript
interface AssetAllocation {
  coin_id: string;
  symbol: string;
  name: string;
  percentage: number;
  value: number;
}
```

### CryptoPrice

```typescript
interface CryptoPrice {
  usd: number;
  usd_market_cap: number;
  usd_24h_vol: number;
  usd_24h_change: number;
  last_updated_at: number;
}
```

---

## Error Handling

### Error Response Format

All errors follow this structure:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes

- `200 OK` - Successful GET request
- `201 Created` - Successful POST request
- `400 Bad Request` - Invalid parameters or request body
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Rate Limiting

The application respects CoinGecko API rate limits:

- Free tier: 10-50 calls/minute
- Response times: 30-60 second TTL caching
- Automatic backoff for rate limit errors

---

## Supported Cryptocurrencies

Supported coin_ids (lowercase):

```
bitcoin, ethereum, solana, ripple, cardano, polkadot, dogecoin,
litecoin, chainlink, uniswap, aave, curve-dao-token, yearn-finance,
wrapped-bitcoin, staked-ether, and 6000+ more...
```

---

## Usage Examples

### Example 1: Fetch Portfolio Summary

```typescript
const response = await fetch('/api/portfolio/summary');
const summary = await response.json();

console.log(`Total Portfolio Value: $${summary.total_value}`);
console.log(`24h Change: ${summary.portfolio_change_24h_percentage}%`);
```

### Example 2: Add New Asset to Portfolio

```typescript
const response = await fetch('/api/portfolio/assets', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    coin_id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    amount: 5,
    purchase_price: 2500,
  }),
});

const newAsset = await response.json();
console.log(`Added ${newAsset.amount} ${newAsset.symbol}`);
```

### Example 3: Get Live Prices

```typescript
const response = await fetch('/api/market/prices?ids=bitcoin,ethereum,solana');
const prices = await response.json();

Object.entries(prices).forEach(([coin, data]: [string, any]) => {
  console.log(`${coin}: $${data.usd} (${data.usd_24h_change}%)`);
});
```

### Example 4: Fetch Trending Coins

```typescript
const response = await fetch('/api/market/trending');
const data = await response.json();

data.coins.slice(0, 5).forEach((coin: any) => {
  console.log(`${coin.name}: $${coin.data.price}`);
});
```

---

## Performance & Caching

### Backend Caching

- Price data: 60-second TTL
- Market data: 60-second TTL
- Trending coins: 60-second TTL
- In-memory cache using Node.js `node-cache`

### Frontend Polling

- Portfolio refreshes every 30 seconds
- Market data refreshes every 60 seconds
- Manual refresh button available in UI

### Optimization Tips

1. Use batch requests when possible
2. Cache responses on the client side
3. Avoid fetching the same data repeatedly within 60 seconds
4. Use selective updates for large portfolios

---

## Limitations & Considerations

1. **Free Tier Limits**: CoinGecko free tier has rate limits (10-50 requests/minute)
2. **No WebSocket Support**: Uses polling instead of real-time WebSocket
3. **Data Lag**: Data may be 30-60 seconds behind actual market prices
4. **In-Memory Storage**: Portfolio data is stored in-memory (lost on server restart)
5. **No Database**: For production, integrate with a real database (PostgreSQL, MongoDB, etc.)

---

## Future Enhancements

- [ ] WebSocket support for real-time prices
- [ ] Database persistence for portfolio data
- [ ] Advanced analytics and reporting
- [ ] Price alerts and notifications
- [ ] Portfolio history and backtesting
- [ ] Advanced charting with TradingView
- [ ] Multi-user support with auth
- [ ] Portfolio sharing and comparison

---

## Support & Questions

For issues or questions, refer to the main README.md or contact support.
