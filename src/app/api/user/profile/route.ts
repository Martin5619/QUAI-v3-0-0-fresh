import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      console.error("[PROFILE_API] No session user id")
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const data = await request.json()
    console.log("[PROFILE_API] Updating profile:", data)

    const user = await db.User_v3.update({
      where: {
        id: session.user.id,
      },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        accountState: "ACTIVE",
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        accountState: true
      }
    })

    console.log("[PROFILE_API] Profile updated:", user)
    return NextResponse.json(user)
  } catch (error) {
    console.error("[PROFILE_API_ERROR]", error)
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 }
    )
  }
}
