import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const data = await request.json()
    const { preferences } = data

    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        preferences: preferences,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("[PREFERENCES_ERROR]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
