import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from './db'

const crypto = require('crypto')

if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = crypto.randomBytes(32).toString('hex')
  console.warn('NEXTAUTH_SECRET not set, using random value. This is not recommended for production.')
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        const existingUser = await db.user_v3.findUnique({
          where: { email: profile.email }
        })

        if (!existingUser) {
          const newUser = await db.user_v3.create({
            data: {
              email: profile.email,
              name: profile.name,
              role: 'PERSONAL_USER',
              isVerified: true, // Google users are pre-verified
              provider: 'google'
            }
          })
          return newUser
        }
        return existingUser
      }
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const user = await db.user_v3.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          throw new Error('User not found')
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)

        if (!isValid) {
          throw new Error('Invalid password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isVerified: user.isVerified
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
        token.isVerified = user.isVerified
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role
        session.user.id = token.id
        session.user.isVerified = token.isVerified
      }
      return session
    }
  },
  debug: process.env.NODE_ENV === 'development'
})
