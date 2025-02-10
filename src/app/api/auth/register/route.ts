import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { Role_v3, Prisma } from "@prisma/client"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain uppercase, lowercase, number and special character"
    )
})

export async function POST(req: Request) {
  console.log("Starting registration process")

  try {
    // 1. Parse request body
    const rawBody = await req.text()
    console.log("Raw request body:", rawBody)

    let body
    try {
      body = JSON.parse(rawBody)
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError)
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      )
    }

    // 2. Validate data
    console.log("Validating request data:", { ...body, password: "[REDACTED]" })
    
    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error)
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, password, name } = validationResult.data

    // 3. Check if user exists
    console.log("Checking if user exists:", email)
    
    try {
      const existingUser = await db.user_v3.findUnique({
        where: { email }
      })

      if (existingUser) {
        console.log("User already exists:", email)
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 400 }
        )
      }

      // 4. Create user with onboarding state
      console.log("Creating new user:", email)
      
      const hashedPassword = await bcrypt.hash(password, 12)
      
      const user = await db.$transaction(async (tx) => {
        // Create user with all required relations
        const newUser = await tx.user_v3.create({
          data: {
            email,
            password: hashedPassword,
            name,
            role: Role_v3.PERSONAL_USER, // Default to personal user for free tier
            emailVerified: new Date(),
            usage: {
              create: {
                documentsCount: 0,
                questionsCount: 0,
                storageUsed: 0,
                tokensUsed: 0
              }
            },
            onboarding: {
              create: {
                currentStep: 1,
                isComplete: false
              }
            }
          },
          include: {
            usage: true,
            onboarding: true
          }
        })

        return newUser
      })

      console.log("User created successfully:", { id: user.id, email: user.email })

      return NextResponse.json(
        {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name
          }
        },
        { status: 201 }
      )
    } catch (dbError) {
      console.error("Database error:", dbError)
      
      if (dbError instanceof Prisma.PrismaClientKnownRequestError) {
        if (dbError.code === 'P2002') {
          return NextResponse.json(
            { error: "An account with this email already exists" },
            { status: 400 }
          )
        }
      }
      
      return NextResponse.json(
        { 
          error: "Database error",
          details: dbError instanceof Error ? dbError.message : "Unknown error"
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Unhandled registration error:", error)
    
    return NextResponse.json(
      { 
        error: "Failed to create account",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
