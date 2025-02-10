import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { Role_v3 } from "@prisma/client"

// Define valid roles explicitly from schema
const validRoles = [
  "SUPER_ADMIN",
  "TEACHER",
  "LEARNING_MANAGER",
  "STUDENT",
  "CORPORATE_USER",
  "PERSONAL_USER",
  "INSTITUTION",
  "ADMINISTRATOR",
  "DEVELOPER",
  "SUPPORT",
  "ANALYST",
  "MANAGER"
] as const

export async function POST(req: Request) {
  try {
    console.log("[ONBOARDING_DEBUG] Starting onboarding request")
    const session = await auth()
    
    if (!session?.user) {
      console.error("[ONBOARDING_ERROR] No session found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[ONBOARDING_DEBUG] Session user:", {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email
    })

    let data
    try {
      const text = await req.text()
      console.log("[ONBOARDING_DEBUG] Raw request body:", text)
      
      if (!text) {
        console.error("[ONBOARDING_ERROR] Empty request body")
        return NextResponse.json({ error: "Empty request body" }, { status: 400 })
      }

      data = JSON.parse(text)
      console.log("[ONBOARDING_DEBUG] Parsed request body:", data)

      // Validate data structure
      if (!data || typeof data !== 'object') {
        throw new Error("Invalid data format")
      }

      // Ensure required fields
      if (!data.role || typeof data.role !== 'string') {
        throw new Error("Missing or invalid role")
      }

    } catch (error) {
      console.error("[ONBOARDING_ERROR] Request validation failed:", error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Invalid request format" },
        { status: 400 }
      )
    }

    // Validate role
    if (!validRoles.includes(data.role as Role_v3)) {
      console.error("[ONBOARDING_ERROR] Invalid role:", {
        receivedRole: data.role,
        validRoles,
      })
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${validRoles.join(", ")}` },
        { status: 400 }
      )
    }

    try {
      console.log("[ONBOARDING_DEBUG] Starting database operations")

      // Create or update onboarding state
      const onboardingState = await db.onboardingState_v3.upsert({
        where: {
          userId: session.user.id,
        },
        create: {
          userId: session.user.id,
          role: data.role as Role_v3,
          preferences: {},
          plan: 'free',
          isComplete: true,
          completedAt: new Date(),
        },
        update: {
          role: data.role as Role_v3,
          preferences: {},
          plan: 'free',
          isComplete: true,
          completedAt: new Date(),
        },
      })

      console.log("[ONBOARDING_DEBUG] Updated onboarding state:", onboardingState)

      // Update user role
      const updatedUser = await db.user_v3.update({
        where: {
          id: session.user.id,
        },
        data: {
          role: data.role as Role_v3,
        },
      })

      console.log("[ONBOARDING_DEBUG] Updated user:", updatedUser)

      // Initialize usage metrics
      const usageMetrics = await db.usage_v3.upsert({
        where: {
          userId: session.user.id,
        },
        create: {
          userId: session.user.id,
          documentsCount: 0,
          questionsCount: 0,
          storageUsed: 0,
          tokensUsed: 0,
        },
        update: {},
      })

      console.log("[ONBOARDING_DEBUG] Initialized usage metrics:", usageMetrics)

      return NextResponse.json({ 
        success: true,
        onboardingState,
        user: updatedUser,
        usageMetrics
      })
    } catch (error) {
      console.error("[ONBOARDING_ERROR] Database operation failed:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        session: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email
        },
        data
      })
      return NextResponse.json(
        { error: "Failed to save onboarding data" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("[ONBOARDING_ERROR] Unhandled error:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
