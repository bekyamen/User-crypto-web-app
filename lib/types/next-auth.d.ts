import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    user: {
      id: string
      role: 'USER' | 'ADMIN'
      name?: string | null
      email?: string | null
    }
  }

  interface User {
    id: string
    role: 'USER' | 'ADMIN'
  }
}
