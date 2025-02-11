import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { Plan_v3 } from "@prisma/client"

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { plan } = body

    if (!plan || !Object.values(Plan_v3).includes(plan.toUpperCase() as Plan_v3)) {
      return new NextResponse("Invalid plan selected", { status: 400 })
    }

    const user = await db.user_v3.update({
      where: { id: session.user.id },
      data: {
        plan: plan.toUpperCase() as Plan_v3,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        plan: true
      }
    })

    console.log("[PLAN_API] Updated user plan:", {
      id: user.id,
      email: user.email,
      plan: user.plan
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("[PLAN_API_ERROR]", error)
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 }
    )
  }
}
