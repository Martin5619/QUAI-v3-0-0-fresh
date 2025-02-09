import { prisma } from './prisma'
import { startOfMonth, endOfMonth } from 'date-fns'

export const PLAN_LIMITS = {
  free: {
    documentsPerMonth: 5,
    questionsPerMonth: 50,
    generationsPerMonth: 10
  },
  basic: {
    documentsPerMonth: 10,
    questionsPerMonth: 100,
    generationsPerMonth: 25
  },
  pro: {
    documentsPerMonth: 50,
    questionsPerMonth: 500,
    generationsPerMonth: 100
  },
  ultimate: {
    documentsPerMonth: 999999,
    questionsPerMonth: 999999,
    generationsPerMonth: 999999
  }
}

export async function getCurrentUsage(userId: string) {
  try {
    const now = new Date()
    const periodStart = startOfMonth(now)
    const periodEnd = endOfMonth(now)

    let usage = await prisma.usage_v2414.findFirst({
      where: {
        userId,
        AND: [
          { period: { gte: periodStart } },
          { period: { lte: periodEnd } }
        ]
      },
    })

    if (!usage) {
      usage = await prisma.usage_v2414.create({
        data: {
          userId,
          period: periodStart,
          documents: 0,
          questions: 0,
        },
      })
    }

    return usage
  } catch (error) {
    console.error('Error in getCurrentUsage:', error)
    throw new Error('Failed to get current usage')
  }
}

export async function getUserPlan(userId: string) {
  try {
    const user = await prisma.user_v2414.findUnique({
      where: { id: userId },
      select: {
        plan: true,
        stripeSubscriptionPlan: true
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    // If they have a stripe subscription plan, use that
    if (user.stripeSubscriptionPlan && user.stripeSubscriptionPlan !== 'free') {
      return user.stripeSubscriptionPlan
    }

    // Otherwise use their base plan
    return user.plan || 'free'
  } catch (error) {
    console.error('Error in getUserPlan:', error)
    throw new Error('Failed to get user plan')
  }
}

export async function checkDocumentLimit(userId: string): Promise<boolean> {
  try {
    const usage = await getCurrentUsage(userId)
    const plan = await getUserPlan(userId)
    const limit = PLAN_LIMITS[plan]?.documentsPerMonth || PLAN_LIMITS.free.documentsPerMonth
    return usage.documents < limit
  } catch (error) {
    console.error('Error in checkDocumentLimit:', error)
    throw new Error('Failed to check document limit')
  }
}

export async function checkQuestionLimit(userId: string): Promise<boolean> {
  try {
    const usage = await getCurrentUsage(userId)
    const plan = await getUserPlan(userId)
    const limit = PLAN_LIMITS[plan]?.questionsPerMonth || PLAN_LIMITS.free.questionsPerMonth
    return usage.questions < limit
  } catch (error) {
    console.error('Error in checkQuestionLimit:', error)
    throw new Error('Failed to check question limit')
  }
}

export async function incrementDocumentCount(userId: string): Promise<void> {
  try {
    const usage = await getCurrentUsage(userId)
    await prisma.usage_v2414.update({
      where: { id: usage.id },
      data: { documents: { increment: 1 } },
    })
  } catch (error) {
    console.error('Error in incrementDocumentCount:', error)
    throw new Error('Failed to increment document count')
  }
}

export async function incrementQuestionCount(userId: string, count: number = 1): Promise<void> {
  try {
    const usage = await getCurrentUsage(userId)
    await prisma.usage_v2414.update({
      where: { id: usage.id },
      data: { questions: { increment: count } },
    })
  } catch (error) {
    console.error('Error in incrementQuestionCount:', error)
    throw new Error('Failed to increment question count')
  }
}

export async function getRemainingQuota(userId: string) {
  try {
    const usage = await getCurrentUsage(userId)
    const plan = await getUserPlan(userId)
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free

    return {
      documents: Math.max(0, limits.documentsPerMonth - usage.documents),
      questions: Math.max(0, limits.questionsPerMonth - usage.questions),
    }
  } catch (error) {
    console.error('Error in getRemainingQuota:', error)
    throw new Error('Failed to get remaining quota')
  }
}

export function getUsageLimits() {
  return PLAN_LIMITS
}
