import { NextResponse } from "next/server"
import { prisma } from "@/lib/db_v3"
import { Role_v3 } from "@prisma/client"
import bcrypt from "bcryptjs"
import { z } from "zod"
import crypto from "crypto"

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain uppercase, lowercase, number and special character"
    ),
  name: z.string().min(2, "Name must be at least 2 characters")
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name } = registerSchema.parse(body)

    // Check if user exists
    const existingUser = await prisma.user_v3.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate verification token
    const verificationToken = crypto.randomUUID()
    const verificationExpiry = new Date()
    verificationExpiry.setHours(verificationExpiry.getHours() + 24)

    // Create user
    const user = await prisma.user_v3.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: Role_v3.STUDENT,
        verificationToken,
        verificationExpiry,
        isVerified: false,
        provider: "credentials"
      }
    })

    // TODO: Send verification email
    // await sendVerificationEmail(email, verificationToken)

    return NextResponse.json(
      { 
        message: "User created successfully. Please check your email to verify your account.",
        verificationToken // Only for testing, remove in production
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
