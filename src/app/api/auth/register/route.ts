import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import { PrismaClient } from '@prisma/client'
import { registerSchema } from "@/lib/validations/auth"
import { z } from "zod"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    console.log('Starting registration process...')
    
    // Parse request body with error handling
    let json
    try {
      json = await req.json()
      console.log('Request body:', { 
        ...json, 
        password: '[REDACTED]', 
        confirmPassword: '[REDACTED]' 
      })
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError)
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      )
    }

    // Validate with schema
    try {
      const body = registerSchema.parse(json)
      console.log('Validation passed')

      // Check if user exists
      console.log('Checking for existing user with email:', body.email)
      console.log('Database URL format check:', {
        isDefined: !!process.env.DATABASE_URL,
        length: process.env.DATABASE_URL?.length,
        startsWithMongodb: process.env.DATABASE_URL?.startsWith('mongodb'),
      })

      let existingUser = null
      try {
        // Try to connect first
        await prisma.$connect()
        console.log('Connected to database')

        // Then query
        existingUser = await prisma.user_v3.findUnique({
          where: { email: body.email },
          select: { id: true, email: true, accountState: true }
        })
        console.log('Direct Prisma query completed. Result:', existingUser)
      } catch (findError) {
        console.error('Error checking for existing user:', {
          error: findError,
          name: findError.name,
          message: findError.message,
          code: findError.code,
          meta: findError.meta,
          stack: findError.stack
        })
        return NextResponse.json(
          { error: `Database error: ${findError.message}` },
          { status: 500 }
        )
      }

      if (existingUser) {
        console.log('User exists with state:', existingUser.accountState)
        return NextResponse.json(
          { error: "This email is already registered" },
          { status: 400 }
        )
      }

      console.log('Hashing password...')
      const hashedPassword = await hash(body.password, 10)

      console.log('Creating new user...')
      try {
        const user = await prisma.user_v3.create({
          data: {
            email: body.email,
            password: hashedPassword,
            firstName: body.firstName,
            lastName: body.lastName,
            role: 'PERSONAL_USER',
            plan: 'FREE',
            accountState: 'EMAIL_PENDING',
            resetToken: null,  
            resetTokenExpiry: null,  
            verificationToken: null  
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            accountState: true
          }
        })
        console.log('User created successfully:', { ...user, password: '[REDACTED]' })

        const response = { 
          success: true,
          message: "Account created successfully. Please verify your email to continue.",
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          }
        }
        console.log('Sending response:', response)
        return NextResponse.json(response)
      } catch (createError) {
        console.error('Error creating user:', {
          error: createError,
          name: createError.name,
          message: createError.message,
          code: createError.code,
          meta: createError.meta,
          stack: createError.stack
        })
        return NextResponse.json(
          { error: `Database error: ${createError.message}` },
          { status: 500 }
        )
      }

    } catch (validationError) {
      console.error('Validation error:', validationError)
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
