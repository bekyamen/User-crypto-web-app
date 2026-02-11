<<<<<<< HEAD
# Client-side-crypto-web-app
=======
# Bit Trading - Professional Crypto Trading Platform

A production-ready cryptocurrency trading platform built with Next.js, TypeScript, and NextAuth.js. This application features a modern UI matching professional trading standards with secure authentication, real-time market data, and portfolio management.

## Features

### Authentication & Security
- **NextAuth.js Integration**: JWT-based authentication with credentials provider
- **Mock User Database**: Pre-configured with demo credentials for testing
- **Password Hashing**: Using bcryptjs for secure password storage
- **Session Management**: Secure HTTP-only session handling
- **Frontend-Ready**: Designed to seamlessly integrate with backend authentication

### Landing Page
- Modern hero section with animated gradients
- Statistics showcase (2M+ traders, $50B+ volume, 99.9% uptime)
- Feature highlights (Lightning Fast, Low Fees, Advanced Charts, Mobile Ready)
- Testimonials carousel with user reviews
- Security & Trust section (Bank-Level Security, 2FA, Regulated & Compliant)
- Professional navigation and footer

### Market Data
- Real-time cryptocurrency prices and 24h changes
- Live market data tables with sorting and filtering
- Top Gainers section showing best performers
- New Listings highlighting emerging cryptocurrencies
- Crypto detail pages with price charts and trading information

### Dashboard
- Portfolio overview with total value and day changes
- Interactive line charts showing portfolio performance
- Holdings summary with allocation percentages
- Quick action buttons (Buy, Sell, Deposit)
- Account status and security notices
- Recent transactions history
- Watchlist with favorite cryptocurrencies

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Authentication**: NextAuth.js 5 with Credentials Provider
- **Styling**: Tailwind CSS with custom dark theme
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Password Hashing**: bcryptjs
- **JWT**: jose

## Demo Credentials

```
Email: demo@bittrading.com
Password: password
```

Alternative demo account:
```
Email: trader@bittrading.com
Password: password
```

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
├── app/
│   ├── api/auth/[...nextauth]/    # NextAuth API route
│   ├── dashboard/                  # User dashboard
│   ├── market/                     # Market data pages
│   ├── login/                      # Login page
│   ├── register/                   # Registration page
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles
├── components/
│   ├── header.tsx                  # Navigation header
│   ├── hero.tsx                    # Hero section
│   ├── stats.tsx                   # Statistics section
│   ├── testimonials.tsx            # Testimonials carousel
│   ├── features.tsx                # Features section
│   ├── security.tsx                # Security section
│   ├── footer.tsx                  # Footer
│   ├── crypto-table.tsx            # Market data table
│   ├── crypto-detail.tsx           # Individual crypto page
│   ├── dashboard-content.tsx       # Dashboard layout
│   ├── portfolio-overview.tsx      # Portfolio stats & chart
│   ├── quick-actions.tsx           # Action buttons
│   ├── recent-transactions.tsx     # Transaction history
│   ├── watchlist.tsx               # Watched cryptocurrencies
│   ├── top-gainers.tsx             # Top performers
│   └── new-listings.tsx            # New cryptocurrencies
├── lib/
│   └── market-data.ts              # Crypto data services
├── auth.config.ts                  # NextAuth configuration
├── auth.ts                         # Auth initialization
├── package.json
└── tsconfig.json
```

## Authentication Flow

1. **Login/Register Pages**: User submits credentials
2. **Credentials Provider**: Validates against mock user database
3. **JWT Generation**: NextAuth creates JWT token in HTTP-only cookie
4. **Protected Routes**: Dashboard and market pages require valid session
5. **Session Management**: Automatic session validation on each request

### Replacing with Real Backend

The authentication is designed to work seamlessly with a real backend:

1. Update credentials validation in `auth.config.ts`
2. Replace mock user database with API call to your backend
3. Adjust JWT callback for your backend's token format
4. No UI changes required - same interface works with real auth

## Market Data

Mock cryptocurrency data is provided in `lib/market-data.ts`. In production:

1. Replace with real API calls (CoinGecko, Binance, etc.)
2. Implement real-time updates using WebSockets
3. Cache data appropriately
4. Add error handling and rate limiting

## Customization

### Colors & Theme
Edit design tokens in `app/globals.css` to customize the color scheme:
- Primary: Blue (#3b82f6)
- Secondary: Orange (#f97316)
- Success: Green (#10b981)
- Background: Dark slate (#0f172a)

### Add More Cryptocurrencies
Expand the `mockCryptos` array in `lib/market-data.ts` with additional assets.

### Portfolio Holdings
Mock portfolio data in `components/portfolio-overview.tsx` can be replaced with real user data from your backend.

## Security Considerations

- **Password Hashing**: All passwords are hashed with bcryptjs
- **JWT Tokens**: Secure, HTTP-only cookies prevent XSS attacks
- **CSRF Protection**: NextAuth includes built-in CSRF protection
- **Session Expiration**: Configure session timeout in `auth.config.ts`
- **HTTPS Only**: Ensure cookies are secure in production

### For Production

1. Set a strong `AUTH_SECRET` environment variable
2. Enable HTTPS
3. Configure CORS appropriately
4. Implement rate limiting
5. Add input validation and sanitization
6. Enable security headers

## Performance

- **Server Components**: Used where possible for faster rendering
- **Client Components**: Minimal state management for interactivity
- **Image Optimization**: Using Next.js Image component
- **Code Splitting**: Automatic with App Router
- **Caching**: Implement caching strategies for crypto data

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is available for startup, portfolio, and commercial use.

## Support & Contributing

For issues or feature requests, please create an issue in your repository. The application is built with extensibility in mind, making it easy to add new features like:

- Real trading functionality
- Advanced charting with TradingView charts
- User notifications and alerts
- Multi-language support
- Dark/Light theme toggle
- Mobile app version

## Future Enhancements

- WebSocket integration for real-time prices
- Advanced trading orders (limit, stop-loss, etc.)
- Portfolio analytics and performance metrics
- Social trading features
- API access for automated trading
- Mobile app (React Native)
- Multi-currency support
>>>>>>> 0ca2c83 (Initial commit)
