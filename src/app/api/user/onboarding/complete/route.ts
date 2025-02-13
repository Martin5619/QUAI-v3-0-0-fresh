import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"

// Define validation schema
const usageSchema = z.object({
  documentsUsed: z.number().min(0),
  questionsGenerated: z.number().min(0),
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
  plan: z.string().transform(plan => plan.toUpperCase() as "FREE" | "PRO" | "TEAM"),
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
    console.log("[ONBOARDING_COMPLETE] Raw data:", rawData)
    
    const validationResult = onboardingSchema.safeParse(rawData)
    
    if (!validationResult.success) {
      console.error("[VALIDATION_ERROR]", validationResult.error)
      return new NextResponse(
        `Invalid request data: ${validationResult.error.message}`,
        { status: 400 }
      )
    }

    const data = validationResult.data
    console.log("[ONBOARDING_COMPLETE] Validated data:", data)

    // Update user and onboarding state in a transaction
    const result = await db.$transaction([
      // Update user with role and plan
      db.user_v3.update({
        where: { id: session.user.id },
        data: {
          role: data.role,
          plan: data.plan,
          preferences: data.preferences || {},
          accountState: "ACTIVE"
        }
      }),
      
      // Upsert onboarding state
      db.onboardingState_v3.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          isComplete: true,
          currentStep: "completed",
          updatedAt: new Date()
        },
        update: {
          isComplete: true,
          currentStep: "completed",
          updatedAt: new Date()
        }
      }),

      // Create or update usage record
      db.usage_v3.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          ...data.usage
        },
        update: data.usage
      })
    ])

    console.log("[ONBOARDING_COMPLETE] Transaction result:", result)
    console.log("[ONBOARDING_COMPLETE] User updated:", result[0])
    console.log("[ONBOARDING_COMPLETE] Onboarding state updated:", result[1])
    console.log("[ONBOARDING_COMPLETE] Usage record updated:", result[2])
    return NextResponse.json({
      success: true,
      user: result[0],
      onboarding: result[1],
      usage: result[2]
    })

  } catch (error) {
    console.error("[ONBOARDING_COMPLETE_ERROR]", error)
    return new NextResponse(
      `Internal server error during onboarding completion: ${error.message} - ${error.stack}`,
      { status: 500 }
    )
  }
}
