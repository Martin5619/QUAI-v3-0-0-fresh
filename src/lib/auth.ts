import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('Please provide process.env.NEXTAUTH_SECRET')
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
        const existingUser = await prisma.user_v2414.findUnique({
          where: { email: profile.email },
          include: {
            usage_v2414: true,
            subscription_v2414: true
          }
        })

        if (!existingUser) {
          const newUser = await prisma.user_v2414.create({
            data: {
              email: profile.email,
              name: profile.name,
              role: 'USER',
              plan: 'free',
              usage_v2414: {
                create: {
                  documentsCount: 0,
                  questionsCount: 0,
                  tokensUsed: 0,
                  lastUpdated: new Date()
                }
              }
            },
            include: {
              usage_v2414: true,
              subscription_v2414: true
            }
          })
          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            plan: newUser.plan,
            usage_v2414: newUser.usage_v2414,
            subscription_v2414: newUser.subscription_v2414
          }
        }

        return {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role,
          plan: existingUser.plan,
          usage_v2414: existingUser.usage_v2414,
          subscription_v2414: existingUser.subscription_v2414
        }
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

        const user = await prisma.user_v2414.findUnique({
          where: {
            email: credentials.email.toLowerCase()
          },
          include: {
            usage_v2414: true,
            subscription_v2414: true
          }
        })

        if (!user || !user.hashedPassword) {
          throw new Error('Invalid email or password')
        }

        const isValid = await bcrypt.compare(credentials.password, user.hashedPassword)

        if (!isValid) {
          throw new Error('Invalid email or password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          plan: user.plan,
          usage_v2414: user.usage_v2414,
          subscription_v2414: user.subscription_v2414
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
        token.plan = user.plan
        token.usage_v2414 = user.usage_v2414
        token.subscription_v2414 = user.subscription_v2414
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.name = token.name
        session.user.role = token.role
        session.user.plan = token.plan
        session.user.usage_v2414 = token.usage_v2414
        session.user.subscription_v2414 = token.subscription_v2414
      }
      return session
    }
  },
  debug: process.env.NODE_ENV === 'development'
})
