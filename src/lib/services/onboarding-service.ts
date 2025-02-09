import { prisma } from "@/lib/prisma"
import { Role_v3 } from "@prisma/client"
import { createSubscription_v2414, type PlanId_v2414 } from "./subscription-service"

interface OnboardingData_v2414 {
  name?: string
  company?: string
  role?: string
  industry?: string
  teamSize?: string
  primaryLanguage?: string
  targetLanguages?: string[]
  planId: PlanId_v2414
  paymentMethodId?: string
}

export async function startOnboarding_v2414(userId: string) {
  const existingState = await prisma.onboardingState_v3.findUnique({
    where: { userId },
  })

  if (existingState) {
    return existingState
  }

  return prisma.onboardingState_v3.create({
    data: {
      userId,
      status: "started",
      currentStep: "welcome",
      data: {},
    },
  })
}

export async function updateOnboardingStep_v2414(
  userId: string,
  step: string,
  data: Partial<OnboardingData_v2414>
) {
  const onboarding = await prisma.onboardingState_v3.findUnique({
    where: { userId },
  })

  if (!onboarding) {
    // If no onboarding state exists, create one
    return prisma.onboardingState_v3.create({
      data: {
        userId,
        status: "started",
        currentStep: step,
        data: data as any,
      },
    })
  }

  return prisma.onboardingState_v3.update({
    where: { userId },
    data: {
      currentStep: step,
      data: {
        ...onboarding.data,
        ...data,
      } as any,
    },
  })
}

export async function completeOnboarding_v2414(
  userId: string,
  data: OnboardingData_v2414
) {
  // Create subscription
  await createSubscription_v2414(
    userId,
    data.planId,
    data.paymentMethodId
  )

  // Update user profile
  await prisma.user_v3.update({
    where: { id: userId },
    data: {
      name: data.name,
      company: data.company,
      role: data.role,
      onboarded: true,
      preferences: {
        industry: data.industry,
        teamSize: data.teamSize,
        primaryLanguage: data.primaryLanguage,
        targetLanguages: data.targetLanguages,
      } as any,
    },
  })

  // Create default project if needed
  if (data.primaryLanguage && data.targetLanguages?.length) {
    await prisma.translationProject_v3.create({
      data: {
        name: "My First Project",
        description: "Welcome to QUAi! This is your first translation project.",
        sourceLocale: data.primaryLanguage.toUpperCase() as any,
        targetLocales: data.targetLanguages.map(
          (lang) => lang.toUpperCase()
        ) as any[],
        status: "draft",
        createdBy: userId,
        teamMembers: {
          create: {
            userId,
            role: "manager",
          },
        },
      },
    })
  }

  // Mark onboarding as completed
  return prisma.onboardingState_v3.update({
    where: { userId },
    data: {
      status: "completed",
      currentStep: "completed",
      completedAt: new Date(),
    },
  })
}

export async function getOnboardingState_v2414(userId: string) {
  const onboarding = await prisma.onboardingState_v3.findUnique({
    where: { userId },
  })

  if (!onboarding) {
    return {
      status: "started",
      currentStep: "welcome",
      data: {},
    }
  }

  return onboarding
}

export async function skipOnboarding_v2414(userId: string) {
  const onboarding = await prisma.onboardingState_v3.findUnique({
    where: { userId },
  })

  if (!onboarding) {
    // Create a completed onboarding state
    await prisma.onboardingState_v3.create({
      data: {
        userId,
        status: "completed",
        currentStep: "completed",
        data: {},
      },
    })
  } else {
    // Update existing onboarding state
    await prisma.onboardingState_v3.update({
      where: { userId },
      data: {
        status: "completed",
        currentStep: "completed",
      },
    })
  }

  // Mark user as onboarded
  await prisma.user_v3.update({
    where: { id: userId },
    data: { onboarded: true },
  })

  return { status: "completed", currentStep: "completed" }
}

export async function getWelcomeChecklist_v2414(userId: string) {
  const user = await prisma.user_v3.findUnique({
    where: { id: userId },
    include: {
      subscription: true,
    },
  })

  if (!user) {
    throw new Error("User not found")
  }

  return {
    profile: !!user.name,
    subscription: !!user.subscription,
    onboarded: user.onboarded,
  }
}
