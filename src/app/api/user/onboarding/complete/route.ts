import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"

// Define validation schema
const usageSchema = z.object({
  documentsCount: z.number().min(0),
  questionsCount: z.number().min(0),
  storageUsed: z.number().min(0),
  tokensUsed: z.number().min(0)
})

const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  language: z.string().optional(),
  notifications: z.enum(['all', 'important', 'none']).optional()
})

const onboardingSchema = z.object({
  role: z.enum(["PERSONAL_USER", "STUDENT", "TEACHER", "INSTITUTION_ADMIN", "SYSTEM_ADMIN"]),
  preferences: preferencesSchema.optional(),
  plan: z.enum(["FREE", "PRO", "TEAM"]),
  usage: usageSchema
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Parse and validate request data
    const rawData = await request.json()
    const validationResult = onboardingSchema.safeParse(rawData)
    
    if (!validationResult.success) {
      console.error("[VALIDATION_ERROR]", validationResult.error)
      return new NextResponse(
        `Invalid request data: ${validationResult.error.message}`,
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Convert notifications enum to boolean
    const preferences = data.preferences ? {
      ...data.preferences,
      notifications: data.preferences.notifications === 'all' || data.preferences.notifications === 'important'
    } : undefined

    // First update the user's core data
    const user = await db.User_v3.update({
      where: { id: session.user.id },
      data: {
        accountState: "ACTIVE",
        role: data.role,
        preferences,
        plan: data.plan,
        usage: {
          create: {
            documentsCount: data.usage.documentsCount,
            questionsCount: data.usage.questionsCount,
            storageUsed: data.usage.storageUsed,
            tokensUsed: data.usage.tokensUsed
          }
        }
      }
    })

    // Then update or create the onboarding state
    await db.OnboardingState_v3.upsert({
      where: {
        userId: session.user.id
      },
      create: {
        userId: session.user.id,
        role: data.role,
        preferences: data.preferences || {},
        plan: data.plan,
        isComplete: true,
        completedAt: new Date()
      },
      update: {
        role: data.role,
        preferences: data.preferences || {},
        plan: data.plan,
        isComplete: true,
        completedAt: new Date()
      }
    })

    console.log(`[${new Date().toISOString()}] Onboarding completed for user ${session.user.id}`)
    return NextResponse.json(user)
  } catch (error) {
    console.error("[ONBOARDING_COMPLETE_ERROR]", error)
    
    // Handle Prisma errors specifically
    if (error instanceof Error && error.name === "PrismaClientKnownRequestError") {
      return new NextResponse(
        "Failed to update user data. Please try again.",
        { status: 500 }
      )
    }
    
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 }
    )
  }
}
