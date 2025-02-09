import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { prisma } from './prisma'

export type UsageType = 'document_upload' | 'question_create'

export async function trackUsage(userId: string, type: UsageType, count: number = 1) {
  try {
    // First, find all existing usage records for this user
    const existingUsages = await prisma.usage_v2414.findMany({
      where: { userId }
    });

    // If multiple records exist, merge them into one
    if (existingUsages.length > 1) {
      const totalDocuments = existingUsages.reduce((sum, usage) => sum + (usage.documentsCount || 0), 0);
      const totalQuestions = existingUsages.reduce((sum, usage) => sum + (usage.questionsCount || 0), 0);

      // Delete all existing records
      await prisma.usage_v2414.deleteMany({
        where: { userId }
      });

      // Create a new merged record
      return await prisma.usage_v2414.create({
        data: {
          userId,
          documentsCount: totalDocuments + (type === 'document_upload' ? count : 0),
          questionsCount: totalQuestions + (type === 'question_create' ? count : 0),
          lastUpdated: new Date(),
          createdAt: new Date()
        }
      });
    }

    // Otherwise, use upsert as normal
    return await prisma.usage_v2414.upsert({
      where: {
        userId: userId
      },
      update: {
        ...(type === 'document_upload' ? { documentsCount: { increment: count } } : {}),
        ...(type === 'question_create' ? { questionsCount: { increment: count } } : {}),
        lastUpdated: new Date()
      },
      create: {
        userId,
        documentsCount: type === 'document_upload' ? count : 0,
        questionsCount: type === 'question_create' ? count : 0,
        lastUpdated: new Date(),
        createdAt: new Date()
      }
    });
  } catch (error) {
    console.error('[API_v2414] Error tracking usage:', error);
    throw error;
  }
}

const PLAN_LIMITS = {
  free: {
    documentsPerMonth: 5,
    questionsPerMonth: 50
  },
  pro: {
    documentsPerMonth: 100,
    questionsPerMonth: 1000
  }
}

export async function checkUsage(req: NextRequest): Promise<{ allowed: boolean, error?: string }> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { allowed: false, error: 'Unauthorized' }
    }

    const userId = session.user.id

    // Get user with usage
    const user = await prisma.user_v2414.findUnique({
      where: { id: userId },
      include: {
        usage_v2414: true
      }
    })

    if (!user) {
      return { allowed: false, error: 'User not found' }
    }

    const plan = user.plan || 'free'
    const limits = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS]
    const usage = user.usage_v2414 || { documentsCount: 0, questionsCount: 0 }

    if (usage.documentsCount >= limits.documentsPerMonth) {
      return { 
        allowed: false, 
        error: `Monthly document limit (${limits.documentsPerMonth}) reached` 
      }
    }

    return { allowed: true }
  } catch (error) {
    console.error('[API_v2414] Error checking usage:', error)
    return { allowed: false, error: 'Failed to check usage' }
  }
}
