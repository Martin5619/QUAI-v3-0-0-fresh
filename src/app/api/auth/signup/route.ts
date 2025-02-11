import { NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import { db } from '@/lib/db'
import { z } from 'zod'
import { sendVerificationEmail } from '@/lib/email'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
  firstName: z.string().min(2),
  lastName: z.string().min(2)
})

export async function POST(req: Request) {
  try {
    console.log('Starting signup process...')
    const body = await req.json()
    console.log('Request body:', { ...body, password: '[REDACTED]' })
    
    const { email, password, firstName, lastName } = signupSchema.parse(body)
    console.log('Validation passed')

    // Check if user exists
    console.log('Checking for existing user with email:', email)
    const existingUser = await db.user_v3.findUnique({
      where: { email },
      select: { id: true, email: true, accountState: true }
    })
    console.log('Existing user check result:', existingUser)

    if (existingUser) {
      console.log('User already exists with state:', existingUser.accountState)
      // If user exists but is in EMAIL_PENDING state for more than 24 hours, allow re-registration
      if (existingUser.accountState === 'EMAIL_PENDING') {
        const user = await db.user_v3.findUnique({
          where: { email },
          select: { createdAt: true }
        })
        
        if (user && user.createdAt < new Date(Date.now() - 24 * 60 * 60 * 1000)) {
          console.log('Existing registration expired, allowing re-registration')
          await db.user_v3.delete({
            where: { email }
          })
        } else {
          return NextResponse.json(
            { error: 'A verification email has already been sent. Please check your inbox.' },
            { status: 409 }
          )
        }
      } else {
        return NextResponse.json(
          { error: 'This email is already registered' },
          { status: 400 }
        )
      }
    }

    // Hash password
    console.log('Hashing password...')
    const hashedPassword = await hash(password, 10)

    // Create verification token
    console.log('Generating verification token...')
    const verificationToken = crypto.randomUUID()

    // Create user
    console.log('Creating user...')
    const user = await db.user_v3.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        verificationToken,
        emailVerified: null,
        role: 'PERSONAL_USER',
        plan: 'FREE',
        accountState: 'EMAIL_PENDING'
      }
    })
    console.log('User created successfully')

    // Send verification email
    console.log('Sending verification email...')
    await sendVerificationEmail(email, verificationToken)
    console.log('Verification email sent')

    return NextResponse.json(
      { message: 'User created successfully. Please check your email to verify your account.' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'An error occurred during signup', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
