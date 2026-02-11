// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  trustHost: true,

  session: {
    strategy: 'jwt', // store user data in JWT
  },

  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          // Call your backend login API
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          )

          if (!response.ok) return null

          const result = await response.json()

          if (!result.success || !result.data) return null

          const { user, token } = result.data

          if (!user || !token) return null

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role, // 'USER' | 'ADMIN'
            accessToken: token,
          }
        } catch (err) {
          console.error('Auth login failed:', err)
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // store backend token & user info in JWT
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
        token.accessToken = user.accessToken
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as 'USER' | 'ADMIN'
        session.accessToken = token.accessToken
      }
      return session
    },
  },

  pages: {
    signIn: '/login', // your custom login page
  },
}

const handler = NextAuth(authConfig)
export { handler as GET, handler as POST }
