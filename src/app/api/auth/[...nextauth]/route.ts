import { PrismaAdapter } from "@auth/prisma-adapter"
import { Role_v3 } from "@prisma/client"
import NextAuth, { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { Logger_v2414 } from "@/lib/logging"

const prismaAdapter = {
  ...PrismaAdapter(prisma),
  createUser: (data: any) => prisma.user_v3.create({ data }),
  getUser: (id: string) => prisma.user_v3.findUnique({ where: { id } }),
  getUserByEmail: (email: string) => prisma.user_v3.findUnique({ where: { email } }),
  getUserByAccount: ({ providerAccountId, provider }: any) =>
    prisma.user_v3.findFirst({
      where: {
        accounts: {
          some: {
            provider,
            providerAccountId,
          },
        },
      },
    }),
  createSession: (data: any) => prisma.session_v3.create({ data }),
  getSessionAndUser: (sessionToken: string) =>
    prisma.session_v3.findUnique({
      where: { sessionToken },
      include: { user: true },
    }),
  updateSession: (data: any) =>
    prisma.session_v3.update({
      where: { sessionToken: data.sessionToken },
      data,
    }),
  deleteSession: (sessionToken: string) =>
    prisma.session_v3.delete({ where: { sessionToken } }),
  linkAccount: (data: any) => prisma.account_v3.create({ data }),
}

export const authOptions: NextAuthOptions = {
  adapter: prismaAdapter as any,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            Logger_v2414.warn("auth", "Missing credentials during login", undefined, {
              email: !!credentials?.email,
              password: !!credentials?.password,
            })
            throw new Error("Invalid credentials")
          }

          const user = await prisma.user_v3.findUnique({
            where: { email: credentials.email },
          })

          if (!user || !user.password) {
            Logger_v2414.warn("auth", "User not found or no password set", undefined, {
              email: credentials.email,
            })
            throw new Error("Invalid credentials")
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isCorrectPassword) {
            Logger_v2414.warn("auth", "Invalid password attempt", user.id, {
              email: credentials.email,
            })
            throw new Error("Invalid credentials")
          }

          Logger_v2414.info("auth", "User logged in successfully", user.id, {
            email: user.email,
            role: user.role,
          })

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          Logger_v2414.error("auth", "Authorization error", error)
          throw error
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        const userId = token.sub || user?.id
        if (!userId) return session

        const dbUser = await prisma.user_v3.findUnique({
          where: { id: userId }
        })

        if (!dbUser) return session

        session.user.id = dbUser.id
        session.user.role = dbUser.role
        session.user.onboarded = dbUser.onboarded
      }

      return session
    },
    async signIn({ user, account, profile }) {
      try {
        if (!user.email) {
          Logger_v2414.warn("auth", "Sign in attempted without email")
          return false
        }

        // Check if user exists
        const existingUser = await prisma.user_v3.findUnique({
          where: { email: user.email },
        })

        if (!existingUser) {
          Logger_v2414.info("auth", "Creating new user from OAuth", undefined, {
            email: user.email,
            provider: account?.provider,
          })

          // Create new user
          await prisma.user_v3.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              role: Role_v3.PERSONAL,
              onboarded: false,
            },
          })
        }

        Logger_v2414.info("auth", "OAuth sign in successful", existingUser?.id, {
          email: user.email,
          provider: account?.provider,
        })

        return true
      } catch (error) {
        Logger_v2414.error("auth", "Sign in callback error", error)
        return false
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        Logger_v2414.debug("auth", "JWT updated", user.id)
      }
      return token
    }
  },
  events: {
    async signIn({ user }) {
      try {
        // Update last login
        if (user.id) {
          await prisma.user_v3.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
          })
          Logger_v2414.info("auth", "Updated last login time", user.id)
        }
      } catch (error) {
        Logger_v2414.error("auth", "Error updating last login time", error, user.id)
      }
    },
  },
}

import { GET, POST } from '@/lib/auth'

export { GET, POST }
