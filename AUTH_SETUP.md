# Authentication Setup Guide

## Overview
The application uses NextAuth.js with a credentials provider for authentication. It includes mock user data for demo purposes and can be easily integrated with a real backend.

## Quick Start

### Demo Credentials
```
Email: demo@bittrading.com
Password: password
```

### Alternative Account
```
Email: trader@bittrading.com
Password: password
```

## Environment Setup

### 1. Set NEXTAUTH_SECRET (Required)
The application needs a secret key for secure session management. You can:

**Option A: Use the default demo secret (for development)**
- The app automatically uses a default secret if `NEXTAUTH_SECRET` is not set
- This is fine for development but should be changed for production

**Option B: Generate and set a custom secret**

#### For v0 Preview (Recommended)
1. Click the **Vars** button in the left sidebar
2. Add a new environment variable:
   - **Key**: `NEXTAUTH_SECRET`
   - **Value**: Generate a secure secret by running this in your terminal:
     ```bash
     openssl rand -base64 32
     ```
3. Click Save

#### For Local Development
Create a `.env.local` file:
```bash
NEXTAUTH_SECRET="your-secure-secret-key-here"
```

### 2. Generate a Secret
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -base64 32

# Using npm package
npx uuid
```

## How It Works

### Mock User Database
The credentials are validated against mock users defined in `/auth.config.ts`:

```typescript
const mockUsers = [
  {
    id: '1',
    email: 'demo@bittrading.com',
    password: '$2a$10$...', // 'password' hashed with bcryptjs
    name: 'Demo User',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo'
  },
  // ... more users
]
```

### Password Security
- Passwords are hashed using `bcryptjs`
- The app uses `bcryptjs.compare()` for secure password verification
- Plain text passwords are never stored

### Session Management
- JWT tokens are generated and stored securely
- Sessions are validated on each request
- HTTP-only cookies prevent XSS attacks

## Integrating with Real Backend

### Step 1: Update the Credentials Provider
Replace the mock user database with an API call:

```typescript
// In auth.config.ts
async authorize(credentials) {
  if (!credentials?.email || !credentials?.password) {
    return null
  }

  // Replace this with your API call
  const response = await fetch('https://your-api.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password
    })
  })

  const user = await response.json()

  if (!response.ok || !user) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image
  }
}
```

### Step 2: Update Callbacks
Modify JWT and session callbacks to work with your backend:

```typescript
async jwt({ token, user, account }) {
  if (user) {
    token.id = user.id
    token.accessToken = user.accessToken // If your API returns one
  }
  return token
}

async session({ session, token }) {
  if (session.user) {
    session.user.id = token.id as string
  }
  return session
}
```

### Step 3: Add Registration
Create a registration endpoint:

```typescript
// In app/api/auth/register/route.ts
export async function POST(request: Request) {
  const { email, password, name } = await request.json()

  // Validate inputs
  if (!email || !password) {
    return Response.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Call your backend registration API
  const response = await fetch('https://your-api.com/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  })

  return response
}
```

## Authentication Flow

### Login Flow
```
1. User enters email/password
2. Next-Auth validates against credentials provider
3. authorize() function:
   - Finds user in database/API
   - Compares password using bcryptjs.compare()
   - Returns user object if valid
4. JWT token is created with user data
5. Session is established via HTTP-only cookie
6. User is redirected to dashboard or original page
```

### Session Management
```
1. On page load, getSession() is called
2. JWT token is validated
3. Session callbacks are executed
4. User data is available via useSession() hook
```

## Troubleshooting

### Error: "Please define a `secret`"
**Solution**: Add `NEXTAUTH_SECRET` environment variable (see Setup section above)

### Error: "The 'bcryptjs' module does not provide an export named 'compare'"
**Solution**: Use `bcryptjs.compare()` instead of importing `compare` as named export

### Sessions not persisting
**Solution**: 
- Ensure `NEXTAUTH_SECRET` is set
- Check that cookies are enabled in browser
- Verify redirect URLs in `pages` config

### Can't log in with demo credentials
**Solution**:
- Email: `demo@bittrading.com` (lowercase)
- Password: `password` (exactly)
- Check that auth.config.ts has the mock users defined

## Security Best Practices

1. **Always use NEXTAUTH_SECRET in production**
   - Generate a strong, random secret
   - Never commit secrets to version control
   - Use environment variables for all sensitive data

2. **HTTPS only**
   - Always use HTTPS in production
   - Set `trustHost: true` for development behind proxies

3. **Password Hashing**
   - Never store plain text passwords
   - Use bcryptjs with salt rounds > 10
   - Hash passwords on the backend when possible

4. **Session Security**
   - Use HTTP-only cookies (default in NextAuth)
   - Set appropriate session expiry times
   - Implement refresh token rotation for long-lived sessions

5. **API Security**
   - Validate all inputs server-side
   - Use rate limiting on auth endpoints
   - Implement CSRF protection
   - Log auth attempts for security monitoring

## Demo Page Access
The demo trading page is available at `/demo` without authentication. It displays:
- Cryptocurrency, Forex, and Commodities (Gold) trading interfaces
- Real-time market data
- Interactive charts and order books
- Trading simulation features

No login required for the demo.

## Files Reference
- **`/auth.config.ts`** - NextAuth configuration and credentials provider
- **`/auth.ts`** - NextAuth initialization
- **`/app/api/auth/[...nextauth]/route.ts`** - NextAuth API route
- **`/app/login/page.tsx`** - Login page
- **`/app/register/page.tsx`** - Registration page
- **`/components/providers.tsx`** - Session provider wrapper
