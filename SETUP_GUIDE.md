# Bit Trading - Setup & Installation Guide

## Quick Start

### 1. Installation

```bash
# Install dependencies
npm install

# Or with yarn
yarn install

# Or with pnpm
pnpm install
```

### 2. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 3. Default Demo Credentials

- **Email**: demo@bittrading.com
- **Password**: password

Log in with these credentials to access the protected dashboard and market pages.

## Project Structure

```
/app
├── page.tsx                    # Home page (landing)
├── login/page.tsx              # Login page
├── register/page.tsx           # Registration page
├── layout.tsx                  # Root layout with SessionProvider
│
├── market/
│   ├── layout.tsx              # Market layout (Header + Footer)
│   ├── page.tsx                # Market overview
│   └── [id]/page.tsx           # Crypto detail page
│
└── dashboard/
    ├── layout.tsx              # Dashboard layout (Auth protected)
    ├── page.tsx                # Dashboard home
    ├── portfolio/page.tsx       # Portfolio page
    ├── analytics/page.tsx       # Analytics page
    └── settings/page.tsx        # Settings page

/components
├── header.tsx
├── footer.tsx
├── dashboard-header.tsx
├── dashboard-sidebar.tsx
├── providers.tsx
├── crypto-table.tsx
├── top-gainers.tsx
├── new-listings.tsx
├── crypto-detail.tsx
├── dashboard-content.tsx
├── portfolio-overview.tsx
├── quick-actions.tsx
├── recent-transactions.tsx
├── watchlist.tsx
├── features.tsx
├── hero.tsx
├── stats.tsx
├── testimonials.tsx
├── security.tsx
├── why-choose-us.tsx
└── ui/                         # shadcn/ui components
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    └── ...

/lib
├── market-data.ts              # Mock cryptocurrency data
└── utils.ts

/auth.config.ts                 # NextAuth.js configuration
/auth.ts                        # NextAuth initialization
```

## Features

### Public Pages
- **Home (`/`)**: Landing page with features, testimonials, security highlights
- **Login (`/login`)**: Demo credentials pre-filled for easy testing
- **Register (`/register`)**: Registration form

### Market Section
- **Markets (`/market`)**: Live cryptocurrency data with prices, charts, top gainers, new listings
- **Crypto Detail (`/market/[id]`)**: Individual cryptocurrency information

### Protected Dashboard
- **Dashboard (`/dashboard`)**: Portfolio overview, quick actions, recent transactions, watchlist
- **Portfolio (`/dashboard/portfolio`)**: Portfolio management and holdings
- **Analytics (`/dashboard/analytics`)**: Trading performance and market metrics
- **Settings (`/dashboard/settings`)**: Account settings and preferences

## Authentication

- **Type**: NextAuth.js with Credentials Provider
- **Session**: JWT-based with HTTP-only cookies
- **Demo Account**: Pre-configured with demo credentials
- **Auth Pages**: Automatic redirect to login for protected routes

### Demo Users

The application includes mock users for demonstration:

```typescript
demo@bittrading.com / password
trader@bittrading.com / password
```

## Styling

- **Framework**: Tailwind CSS v4
- **Color Scheme**: Dark theme (slate, blue, orange)
- **Components**: shadcn/ui
- **Icons**: lucide-react

### Color Palette

- **Primary**: Blue (#3b82f6)
- **Secondary**: Orange (#f97316)
- **Success**: Green (#10b981)
- **Background**: Slate-950 (#0f172a)
- **Surface**: Slate-800/900 (#1a2642 / #1e293b)

## Development

### Environment Variables

No environment variables required for development. The app uses mock data and demo authentication by default.

For production, you would configure:
- `NEXTAUTH_URL`: Your application URL
- `NEXTAUTH_SECRET`: Secret key for session encryption
- Real authentication providers
- Real cryptocurrency data sources

### Building for Production

```bash
npm run build
npm start
```

### Code Structure

- **App Router**: Using Next.js 16 App Router
- **TypeScript**: Full TypeScript support
- **Component Composition**: Modular, reusable components
- **Layouts**: Hierarchical layout system for route organization

## Testing the Application

1. **Landing Page**: Visit `http://localhost:3000` to see the home page
2. **Market Data**: Click "Markets" or visit `http://localhost:3000/market`
3. **Authentication**: Click "Try Demo Account" on the login page or use:
   - Email: demo@bittrading.com
   - Password: password
4. **Dashboard**: After login, access `http://localhost:3000/dashboard`
5. **Navigation**: Use the sidebar to navigate between dashboard sections

## Customization

### Updating Mock Data

Edit `/lib/market-data.ts` to modify:
- Cryptocurrency prices
- Trading volume
- Market cap
- Top gainers/losers

### Styling Changes

- Global styles: `/app/globals.css`
- Tailwind config: `/next.config.mjs` (TailwindCSS v4 uses globals.css for theme)
- Component styles: Individual component files

### Adding New Routes

1. Create new folder in `/app`
2. Add `layout.tsx` if you want custom layout
3. Add `page.tsx` for the route content
4. Import necessary components

Example structure for a new route:

```
/app/my-feature/
├── layout.tsx    (optional)
├── page.tsx      (required)
└── components/   (optional)
```

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Other Platforms

Build the application:

```bash
npm run build
```

The output will be in `.next/` directory and ready for deployment.

### Production Checklist

- [ ] Set `NEXTAUTH_SECRET` environment variable
- [ ] Configure `NEXTAUTH_URL` for production domain
- [ ] Replace mock data with real API calls
- [ ] Implement real user authentication
- [ ] Add database integration (Supabase, Neon, etc.)
- [ ] Configure cryptocurrency data provider (CoinGecko, etc.)
- [ ] Set up monitoring and error tracking
- [ ] Configure CORS if using external APIs

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Clear the build cache:
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. Check for TypeScript errors:
   ```bash
   npx tsc --noEmit
   ```

### Import Errors

If imports are failing:

1. Ensure all components are exported properly
2. Check file paths (case-sensitive on Linux/Mac)
3. Verify component names match import statements

### Authentication Issues

If login is not working:

1. Check that `/app/api/auth/[...nextauth]/route.ts` exists
2. Verify `/auth.ts` and `/auth.config.ts` are properly configured
3. Clear browser cookies and try again
4. Check browser console for error messages

## Next Steps

1. **Integrate Real Backend**: Replace mock data with API calls
2. **Add Database**: Implement real user storage and authentication
3. **Customize Branding**: Update logos, colors, and content
4. **Add Features**: Implement trading, deposits, withdrawals
5. **Security Audit**: Review and implement security best practices

## Support

For issues or questions:
- Check the `ROUTE_STRUCTURE.md` file for architectural details
- Review component implementations in `/components`
- Check NextAuth.js documentation: https://next-auth.js.org
- Check Next.js documentation: https://nextjs.org

---

**Version**: 1.0.0  
**Last Updated**: January 2026
