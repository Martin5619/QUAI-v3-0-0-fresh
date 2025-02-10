import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './db_v3'

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
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        const existingUser = await prisma.user_v3.findUnique({
          where: { email: profile.email }
        })

        if (!existingUser) {
          const newUser = await prisma.user_v3.create({
            data: {
              email: profile.email,
              name: profile.name,
              role: 'STUDENT',
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
          throw new Error('Please enter your email and password')
        }

        const user = await prisma.user_v3.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          throw new Error('No user found with this email')
        }

        if (!user.isVerified) {
          throw new Error('Please verify your email before signing in')
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)

        if (!isValid) {
          throw new Error('Invalid password')
        }

        return user
      }
    })
  ],
  pages: {
    signIn: '/signin',
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
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    }
  },
  debug: process.env.NODE_ENV === 'development'
})
