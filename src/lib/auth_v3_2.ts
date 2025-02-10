import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "./db_v3_2"
import bcrypt from "bcryptjs"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/v3_2/signin"
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Validate input
          const result = loginSchema.safeParse(credentials)
          if (!result.success) {
            throw new Error("Invalid credentials")
          }

          const { email, password } = result.data

          // Find user
          const user = await db.user_v3_2.findUnique({
            where: { email },
            include: {
              usage: true,
              onboarding: true
            }
          })

          if (!user?.password) {
            throw new Error("No account found with this email")
          }

          // Verify password
          const passwordMatch = await bcrypt.compare(password, user.password)
          if (!passwordMatch) {
            throw new Error("Invalid password")
          }

          // Return user data for session
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            plan: user.plan,
            onboarding: user.onboarding,
            usage: user.usage
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
        token.plan = user.plan
        token.onboarding = user.onboarding
        token.usage = user.usage
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
        session.user.onboarding = token.onboarding
        session.user.usage = token.usage
      }
      return session
    }
  }
}
