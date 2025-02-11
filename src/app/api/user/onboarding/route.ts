import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { Role_v3 } from "@prisma/client"
import { getServerSession } from "@/lib/auth"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { cookies, headers } from "next/headers"

export async function POST(req: Request) {
  console.log("[ONBOARDING_DEBUG] Starting onboarding POST request")
  try {
    // Get session using the App Router pattern
    console.log("[ONBOARDING_DEBUG] Getting session...")
    const session = await getServerSession()

    console.log("[ONBOARDING_DEBUG] Raw session:", {
      session,
      user: session?.user,
      id: session?.user?.id,
      email: session?.user?.email,
      headers: Object.fromEntries(headers()),
      cookies: Object.fromEntries(cookies().getAll().map(c => [c.name, c.value]))
    })

    if (!session || !session.user) {
      console.log("[ONBOARDING_ERROR] No session or user")
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    // Type check session.user.id
    if (!session.user.id) {
      console.log("[ONBOARDING_ERROR] No user ID in session")
      console.log("[ONBOARDING_DEBUG] Session user:", session.user)
      return NextResponse.json(
        { error: "Invalid session: missing user ID" },
        { status: 401 }
      )
    }

    // Parse request data
    console.log("[ONBOARDING_DEBUG] Parsing request data...")
    const data = await req.json()
    console.log("[ONBOARDING_DEBUG] Request data:", data)

    const { role } = data
    if (!role) {
      console.log("[ONBOARDING_ERROR] No role provided")
      return NextResponse.json(
        { error: "Role is required" },
        { status: 400 }
      )
    }

    // First check if user exists
    console.log("[ONBOARDING_DEBUG] Checking if user exists...")
    try {
      const existingUser = await db.user_v3.findUnique({
        where: {
          id: session.user.id
        }
      })

      console.log("[ONBOARDING_DEBUG] Existing user:", existingUser)

      if (!existingUser) {
        console.log("[ONBOARDING_ERROR] User not found:", session.user.id)
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        )
      }
    } catch (error) {
      console.error("[ONBOARDING_ERROR] Error finding user:", {
        error,
        userId: session.user.id
      })
      return NextResponse.json(
        { error: "Error finding user" },
        { status: 500 }
      )
    }

    // Create onboarding state with just the role
    try {
      console.log("[ONBOARDING_DEBUG] Creating onboarding state with:", {
        userId: session.user.id,
        role: role,
      })

      const onboardingState = await db.onboardingState_v3.create({
        data: {
          userId: session.user.id,
          role: role as Role_v3,
          isComplete: false
        }
      })

      console.log("[ONBOARDING_DEBUG] Onboarding state created:", onboardingState)

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error("[ONBOARDING_ERROR] Failed to create onboarding state:", {
        error,
        errorType: error?.constructor?.name,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        userId: session.user.id,
        role: role,
      })

      if (error instanceof PrismaClientKnownRequestError) {
        console.error("[ONBOARDING_ERROR] Prisma error details:", {
          code: error.code,
          meta: error.meta,
          message: error.message
        })
      }

      return NextResponse.json(
        { error: "Failed to create onboarding state" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("[ONBOARDING_ERROR] Unexpected error:", {
      error,
      errorType: error?.constructor?.name,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
