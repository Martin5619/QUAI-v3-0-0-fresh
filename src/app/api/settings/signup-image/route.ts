import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const setting = await prisma.settings_v2414.findUnique({
      where: {
        key: "signup_image",
      },
    })

    return NextResponse.json(setting || { value: "/placeholder-signup.jpg" })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch signup image" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const { value, userId } = await req.json()

    const setting = await prisma.settings_v2414.upsert({
      where: {
        key: "signup_image",
      },
      update: {
        value,
        updatedBy: userId,
      },
      create: {
        key: "signup_image",
        value,
        updatedBy: userId,
        description: "Image shown on the sign-up page",
      },
    })

    return NextResponse.json(setting)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update signup image" },
      { status: 500 }
    )
  }
}
