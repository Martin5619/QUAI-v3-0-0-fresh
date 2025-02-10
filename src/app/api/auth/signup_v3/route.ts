import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/db_v3'
import { randomUUID } from 'crypto'

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain uppercase, lowercase, number and special character'
    ),
  name: z.string().min(2, 'Name must be at least 2 characters')
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name } = signupSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user_v3.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Generate verification token
    const verificationToken = randomUUID()
    const verificationExpiry = new Date()
    verificationExpiry.setHours(verificationExpiry.getHours() + 24)

    // Create user
    const user = await prisma.user_v3.create({
      data: {
        email,
        password: hashedPassword,
        name,
        verificationToken,
        verificationExpiry,
        isVerified: false,
        provider: 'credentials'
      }
    })

    // TODO: Send verification email
    // await sendVerificationEmail(email, verificationToken)

    return NextResponse.json(
      { 
        message: 'User created successfully',
        verificationToken // Only for testing, remove in production
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}
