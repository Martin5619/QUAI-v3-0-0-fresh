import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth"

// Pure API endpoint for auth status - no UI dependencies
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({
        authenticated: false,
        message: "No active session"
      })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        email: session.user.email,
        id: session.user.id
      }
    })
  } catch (error) {
    console.error("[AUTH_STATUS_ERROR]", error)
    return NextResponse.json({
      authenticated: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
