import { NextResponse } from "next/server"
import { db } from "@/lib/db_v3_2"
import { Role_v3_2, Plan_v3_2, Prisma } from "@prisma/client"
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
  try {
    // 1. Parse and validate request body
    const body = await req.json()
    
    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, password, name } = validationResult.data

    // 2. Check if user exists
    const existingUser = await db.user_v3_2.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      )
    }

    // 3. Create user with all required relations
    const hashedPassword = await bcrypt.hash(password, 12)
    
    try {
      const user = await db.$transaction(async (tx) => {
        const newUser = await tx.user_v3_2.create({
          data: {
            email,
            password: hashedPassword,
            name,
            role: Role_v3_2.PERSONAL_USER,
            plan: Plan_v3_2.FREE,
            emailVerified: new Date(), // Auto-verify for now
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

      return NextResponse.json(
        {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            plan: user.plan
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
      
      throw dbError
    }
  } catch (error) {
    console.error("Registration error:", error)
    
    return NextResponse.json(
      { 
        error: "Failed to create account",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
