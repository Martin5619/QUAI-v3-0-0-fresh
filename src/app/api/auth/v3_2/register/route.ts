import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db_v3_2"
import { registerSchema } from "@/lib/validations/auth"
import { Role_v3_2, Plan_v3_2 } from "@prisma/client"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, password, firstName, lastName } = validationResult.data

    // Check if user exists
    const existingUser = await db.user_v3_2.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await db.user_v3_2.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        role: Role_v3_2.PERSONAL_USER,
        plan: Plan_v3_2.FREE,
        emailVerified: new Date(), // Auto-verify for now
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    )
  }
}
