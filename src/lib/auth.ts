import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'
import { headers, cookies } from 'next/headers'
import { getServerSession as getServerSessionInternal } from 'next-auth'
import { JWT } from 'next-auth/jwt'

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('Please provide process.env.NEXTAUTH_SECRET')
}

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      firstName?: string | null
      lastName?: string | null
      image?: string | null
    }
  }
}

export const authOptions: NextAuthOptions = {
  adapter: {
    ...PrismaAdapter(db),
    createUser: async (data) => {
      console.log("[AUTH_DEBUG] Creating user:", data)
      const user = await db.User_v3.create({
        data: {
          ...data,
          accountState: 'CREATED'
        }
      })
      console.log("[AUTH_DEBUG] Created user:", user)
      return user
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  callbacks: {
    async session({ session, token }) {
      console.log("[AUTH_DEBUG] Session callback:", { session, token })
      if (session.user && token.sub) {
        session.user.id = token.sub
        
        // Get user data from database
        const user = await db.User_v3.findUnique({
          where: { id: token.sub },
          select: {
            firstName: true,
            lastName: true,
            image: true
          }
        })

        if (user) {
          // Keep firstName and lastName separate
          session.user.firstName = user.firstName
          session.user.lastName = user.lastName
          session.user.image = user.image
        }
      }
      return session
    },
    async jwt({ token, user, account, profile }) {
      console.log("[AUTH_DEBUG] JWT callback:", { token, user, account, profile })
      if (user) {
        token.sub = user.id
      }
      return token
    }
  },
  debug: process.env.NODE_ENV === 'development'
}

// Use this instead of getServerSession directly in Server Components
export async function getServerSession() {
  const headersList = await headers()
  const cookiesList = await cookies()
  
  const req = {
    headers: Object.fromEntries(headersList.entries()),
    cookies: Object.fromEntries(
      cookiesList.getAll().map((c) => [c.name, c.value])
    ),
  }
  const res = { getHeader() {}, setCookie() {}, setHeader() {} }
  
  return await getServerSessionInternal(req as any, res as any, authOptions)
}
