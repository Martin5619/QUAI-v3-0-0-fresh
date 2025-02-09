import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { updateOnboardingStep_v2414 } from "@/lib/services/onboarding-service"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { step, data } = await req.json()

    // Update onboarding state
    await updateOnboardingStep_v2414(session.user.id, step, data)

    // Update user profile based on step
    switch (step) {
      case "welcome":
        await prisma.user_v3.update({
          where: { id: session.user.id },
          data: {
            role: data.role || "PERSONAL", // Default to personal if no role specified
          },
        })
        break

      case "profile":
        await prisma.user_v3.update({
          where: { id: session.user.id },
          data: {
            name: data.name,
            title: data.title || null,
            organization: data.organization || null,
            bio: data.bio || null,
            avatar: data.avatar || null,
            primaryLanguage: data.primaryLanguage || "en",
            secondaryLanguages: data.secondaryLanguages || [],
          },
        })
        break

      case "plan":
        await prisma.subscription_v3.upsert({
          where: { userId: session.user.id },
          create: {
            userId: session.user.id,
            planId: data.plan,
            status: "active",
          },
          update: {
            planId: data.plan,
            status: "active",
          },
        })
        break

      case "team":
        // Handle team settings if needed
        break

      case "languages":
        await prisma.user_v3.update({
          where: { id: session.user.id },
          data: {
            primaryLanguage: data.primaryLanguage,
            secondaryLanguages: data.secondaryLanguages || [],
          },
        })
        break

      case "complete":
        await prisma.user_v3.update({
          where: { id: session.user.id },
          data: {
            onboarded: true,
          },
        })
        break
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in onboarding save:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
