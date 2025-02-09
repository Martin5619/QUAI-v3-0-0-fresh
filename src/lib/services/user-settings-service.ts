import { prisma } from "@/lib/prisma"
import { type Locale } from "@/i18n.config"

interface UserPreferences_v2414 {
  industry?: string
  teamSize?: string
  primaryLanguage?: string
  targetLanguages?: string[]
  theme?: "light" | "dark" | "system"
  emailNotifications?: {
    taskAssigned?: boolean
    taskReviewed?: boolean
    projectUpdates?: boolean
    teamMessages?: boolean
  }
  translationPreferences?: {
    showMemorySuggestions?: boolean
    showGlossaryTerms?: boolean
    showQAWarnings?: boolean
    autoSave?: boolean
  }
}

interface UserProfile_v2414 {
  name?: string
  company?: string
  role?: string
  bio?: string
  avatar?: string
  timezone?: string
  language?: string
}

export async function updateUserPreferences_v2414(
  userId: string,
  preferences: Partial<UserPreferences_v2414>
) {
  const user = await prisma.user_v2414.findUnique({
    where: { id: userId },
  })

  if (!user) throw new Error("User not found")

  return prisma.user_v2414.update({
    where: { id: userId },
    data: {
      preferences: {
        ...(user.preferences as any),
        ...preferences,
      },
    },
  })
}

export async function updateUserProfile_v2414(
  userId: string,
  profile: Partial<UserProfile_v2414>
) {
  return prisma.user_v2414.update({
    where: { id: userId },
    data: profile,
  })
}

export async function getUserSettings_v2414(userId: string) {
  const user = await prisma.user_v2414.findUnique({
    where: { id: userId },
    include: {
      subscription: true,
    },
  })

  if (!user) throw new Error("User not found")

  return {
    profile: {
      name: user.name,
      email: user.email,
      company: user.company,
      role: user.role,
      bio: user.bio,
      avatar: user.image,
      timezone: user.timezone,
      language: user.language,
    },
    preferences: user.preferences as UserPreferences_v2414,
    subscription: user.subscription
      ? {
          plan: user.subscription.planId,
          status: user.subscription.status,
          expiresAt: user.subscription.currentPeriodEnd,
          cancelAtPeriodEnd: user.subscription.cancelAtPeriodEnd,
        }
      : null,
  }
}

export async function updateUserLanguage_v2414(
  userId: string,
  language: Locale
) {
  return prisma.user_v2414.update({
    where: { id: userId },
    data: {
      language,
    },
  })
}

export async function updateUserTimezone_v2414(
  userId: string,
  timezone: string
) {
  return prisma.user_v2414.update({
    where: { id: userId },
    data: {
      timezone,
    },
  })
}

export async function updateUserAvatar_v2414(
  userId: string,
  avatarUrl: string
) {
  return prisma.user_v2414.update({
    where: { id: userId },
    data: {
      image: avatarUrl,
    },
  })
}

export async function getUserActivity_v2414(userId: string) {
  const [
    projects,
    translations,
    reviews,
    comments,
  ] = await Promise.all([
    prisma.translationProject_v2414.count({
      where: { createdBy: userId },
    }),
    prisma.translationTask_v2414.count({
      where: { assignedTo: userId },
    }),
    prisma.translationTask_v2414.count({
      where: { reviewedBy: userId },
    }),
    prisma.taskComment_v2414.count({
      where: { userId },
    }),
  ])

  return {
    projects,
    translations,
    reviews,
    comments,
    lastActive: new Date(),
  }
}

export async function getRecentActivity_v2414(userId: string) {
  const [tasks, comments] = await Promise.all([
    prisma.translationTask_v2414.findMany({
      where: {
        OR: [
          { assignedTo: userId },
          { reviewedBy: userId },
        ],
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
      include: {
        project: true,
      },
    }),
    prisma.taskComment_v2414.findMany({
      where: {
        task: {
          OR: [
            { assignedTo: userId },
            { reviewedBy: userId },
          ],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        user: true,
        task: {
          include: {
            project: true,
          },
        },
      },
    }),
  ])

  return {
    tasks: tasks.map((task) => ({
      type: "task",
      id: task.id,
      projectName: task.project.name,
      status: task.status,
      updatedAt: task.updatedAt,
    })),
    comments: comments.map((comment) => ({
      type: "comment",
      id: comment.id,
      projectName: comment.task.project.name,
      userName: comment.user.name || comment.user.email,
      content: comment.content,
      createdAt: comment.createdAt,
    })),
  }
}
