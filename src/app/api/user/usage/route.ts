import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { usage } = body

    if (!usage || typeof usage !== 'object') {
      return new NextResponse("Invalid usage data", { status: 400 })
    }

    // Create or update usage record
    const userUsage = await db.usage_v3.upsert({
      where: {
        userId: session.user.id
      },
      create: {
        userId: session.user.id,
        documentsUsed: usage.documents || 0,
        questionsGenerated: usage.questions || 0,
        storageUsed: usage.storage || 0,
        tokensUsed: usage.tokens || 0
      },
      update: {
        documentsUsed: usage.documents || 0,
        questionsGenerated: usage.questions || 0,
        storageUsed: usage.storage || 0,
        tokensUsed: usage.tokens || 0,
        updatedAt: new Date()
      }
    })

    console.log("[USAGE_API] Updated user usage:", {
      userId: session.user.id,
      usage: userUsage
    })

    return NextResponse.json({ success: true, usage: userUsage })
  } catch (error) {
    console.error("[USAGE_API_ERROR]", error)
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 }
    )
  }
}
