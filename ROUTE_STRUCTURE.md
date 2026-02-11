# Bit Trading - Route Structure

## Application Architecture Overview

The application follows a clear, hierarchical route structure with proper layout nesting and authentication boundaries. Each route has its own layout file that manages styling, headers, navigation, and session providers.

## Root Layout (`/app/layout.tsx`)
- **Purpose**: Main application wrapper
- **Features**:
  - Next.js metadata configuration
  - Session provider setup (NextAuth.js)
  - Global fonts (Geist) configuration
  - Analytics setup
  - Base HTML structure

## Public Routes

### Home Page (`/app/page.tsx`)
- **Route**: `/`
- **Layout**: Root layout only
- **Features**:
  - Landing page with all homepage content
  - Hero section with call-to-action
  - Statistics cards
  - Feature highlights
  - Testimonials carousel
  - Security & Trust section
  - Professional footer
- **Background**: Gradient (navy blue to slate)

### Login Page (`/app/login/page.tsx`)
- **Route**: `/login`
- **Layout**: Root layout only
- **Features**:
  - Email/password authentication form
  - Demo credentials pre-filled
  - Error handling and validation
  - Link to registration page
  - Form state management
- **Background**: Gradient overlay

### Register Page (`/app/register/page.tsx`)
- **Route**: `/register`
- **Layout**: Root layout only
- **Features**:
  - User registration form
  - Password validation
  - Form state management
  - Link to login page
- **Background**: Gradient overlay

## Protected Routes (Require Authentication)

### Market Layout (`/app/market/layout.tsx`)
- **Purpose**: Wrapper for all market-related pages
- **Features**:
  - Header component (with navigation)
  - Footer component
  - Consistent styling across market section
  - Background gradient
  - No auth check (visible to all) - can be updated to require auth if needed

#### Market Overview Page (`/app/market/page.tsx`)
- **Route**: `/market`
- **Parent Layout**: Market Layout
- **Features**:
  - Live cryptocurrency table with prices
  - 24-hour change indicators
  - Top gainers section
  - New listings section
  - Real-time market data display

#### Crypto Detail Page (`/app/market/[id]/page.tsx`)
- **Route**: `/market/[id]`
- **Parent Layout**: Market Layout
- **Dynamic Parameters**: `id` (cryptocurrency identifier)
- **Features**:
  - Individual crypto details page
  - Price history and charts
  - Market data and statistics
  - Trading information

### Dashboard Layout (`/app/dashboard/layout.tsx`)
- **Purpose**: Wrapper for all dashboard pages
- **Features**:
  - Dashboard header with user info and logout
  - Sidebar navigation
  - Auth protection (redirects to login if not authenticated)
  - Left-right layout structure
  - Consistent styling across dashboard

#### Dashboard Home (`/app/dashboard/page.tsx`)
- **Route**: `/dashboard`
- **Parent Layout**: Dashboard Layout
- **Features**:
  - Portfolio overview
  - Quick action buttons
  - Recent transactions
  - Watchlist
  - Performance metrics

#### Portfolio Page (`/app/dashboard/portfolio/page.tsx`)
- **Route**: `/dashboard/portfolio`
- **Parent Layout**: Dashboard Layout
- **Features**:
  - Portfolio value summary
  - Holdings breakdown
  - Allocation percentages
  - Performance tracking

#### Analytics Page (`/app/dashboard/analytics/page.tsx`)
- **Route**: `/dashboard/analytics`
- **Parent Layout**: Dashboard Layout
- **Features**:
  - Trading performance metrics
  - Win rate statistics
  - Market overview
  - Performance charts

#### Settings Page (`/app/dashboard/settings/page.tsx`)
- **Route**: `/dashboard/settings`
- **Parent Layout**: Dashboard Layout
- **Features**:
  - Account information management
  - Security settings
  - Notification preferences
  - Profile customization

## Route Hierarchy Diagram

```
/app
├── layout.tsx (Root Layout - SessionProvider, Global Config)
│
├── page.tsx (Landing Page)
├── login/page.tsx (Public)
├── register/page.tsx (Public)
│
├── market/
│   ├── layout.tsx (Header + Footer)
│   ├── page.tsx (Market Overview)
│   └── [id]/page.tsx (Crypto Detail)
│
└── dashboard/
    ├── layout.tsx (Header + Sidebar - Auth Protected)
    ├── page.tsx (Dashboard Home)
    ├── portfolio/page.tsx (Portfolio)
    ├── analytics/page.tsx (Analytics)
    └── settings/page.tsx (Settings)
```

## Layout Nesting & Styling

### Background Styling Strategy
- **Root Layout**: No background (body only)
- **Public Pages** (`/`, `/login`, `/register`): Individual background gradients
- **Market Pages**: Gradient applied at market layout level
- **Dashboard Pages**: Gradient applied at dashboard layout level

### Component Reuse
Each page reuses components from `/components` directory:
- **header.tsx**: Main navigation header
- **dashboard-header.tsx**: Dashboard-specific header
- **dashboard-sidebar.tsx**: Dashboard navigation sidebar
- **footer.tsx**: Site footer
- **crypto-table.tsx**: Cryptocurrency data table
- **portfolio-overview.tsx**: Portfolio summary
- **recent-transactions.tsx**: Transaction history
- **watchlist.tsx**: User's watchlist

## Authentication Flow

1. User lands on `/` (public)
2. User can navigate to `/login` or `/register`
3. After successful authentication, redirected to `/dashboard`
4. Dashboard layout checks session and redirects to `/login` if not authenticated
5. User can access market pages (`/market`, `/market/[id]`)
6. User can access dashboard sub-routes (`/dashboard/*`)

## Session Management

- NextAuth.js handles session management
- JWT-based credentials provider for demo purposes
- Session provider wrapped at root layout
- Protected routes use `auth()` function to check session

## File Structure

```
/app
/components
  - header.tsx
  - dashboard-header.tsx
  - dashboard-sidebar.tsx
  - footer.tsx
  - [other components]
/lib
  - market-data.ts (mock data service)
/auth.ts (NextAuth setup)
/auth.config.ts (NextAuth configuration)
```

## Migration Notes

This structure allows for easy migration to:
- Real backend authentication (replace credentials provider with real API calls)
- Database integration (replace mock data with actual API calls)
- Additional features (add new dashboard sub-routes)
- Content management (update landing page content independently)

All changes can be made without affecting the route hierarchy or auth structure.
