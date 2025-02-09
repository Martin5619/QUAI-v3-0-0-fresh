import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Role_v3 } from "@prisma/client"
import bcrypt from "bcryptjs"
import { Logger_v2414 } from "@/lib/logging"

export async function POST(req: Request) {
  try {
    Logger_v2414.info("auth", "Starting user registration")
    
    const body = await req.json()
    console.log("Received registration request:", { 
      email: body.email,
      hasPassword: !!body.password 
    })
    
    const { email, password } = body

    // Validate email and password
    if (!email || typeof email !== "string" || !email.includes("@")) {
      console.log("Invalid email:", { email })
      Logger_v2414.warn("auth", "Invalid email format", undefined, { email })
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      )
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      console.log("Invalid password:", { 
        hasPassword: !!password,
        isString: typeof password === "string",
        length: password?.length 
      })
      Logger_v2414.warn("auth", "Invalid password format", undefined, { passwordLength: password?.length })
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user_v3.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log("User already exists:", { email })
      Logger_v2414.warn("auth", "Registration attempted with existing email", undefined, { email })
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user_v3.create({
      data: {
        email,
        password: hashedPassword,
        role: Role_v3.STUDENT,
      },
    })

    console.log("User created successfully:", { 
      id: user.id,
      email: user.email,
      role: user.role 
    })
    Logger_v2414.info(
      "auth",
      "User registration successful",
      user.id,
      { email: user.email, role: user.role }
    )

    return NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    })
  } catch (error: any) {
    console.error("Registration error:", error)
    Logger_v2414.error(
      "auth",
      "Registration failed",
      undefined,
      { error: error.message }
    )
    
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    )
  }
}
