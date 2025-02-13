import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    // Get current session
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    // Get user details
    const user = await db.user_v3.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        accountState: true,
        sessions: {
          select: {
            id: true,
            expires: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Return sanitized user data
    return NextResponse.json({
      auth: {
        isAuthenticated: true,
        sessionValid: true
      },
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        accountState: user.accountState
      },
      sessions: user.sessions.map(s => ({
        id: s.id,
        expires: s.expires
      }))
    })
  } catch (error) {
    console.error("[AUTH_TEST_ERROR]", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
