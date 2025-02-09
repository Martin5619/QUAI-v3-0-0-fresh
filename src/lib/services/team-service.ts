import { prisma } from "@/lib/prisma"
import { Role_v2414 } from "@prisma/client"

interface TeamMemberStats_v2414 {
  userId: string
  name: string
  role: string
  tasksCompleted: number
  tasksInProgress: number
  averageQualityScore: number
  commentsCount: number
  lastActive: Date
}

interface TeamPerformance_v2414 {
  totalTasks: number
  completedTasks: number
  averageQuality: number
  memberStats: TeamMemberStats_v2414[]
  recentActivity: any[]
}

export async function addTeamMember_v2414(
  projectId: string,
  userId: string,
  role: "translator" | "reviewer" | "manager",
  adminId: string
) {
  // Check if admin has permission
  const admin = await prisma.user_v2414.findUnique({
    where: { id: adminId },
  })

  if (!admin || admin.role !== Role_v2414.SUPER_ADMIN) {
    throw new Error("Unauthorized to manage team members")
  }

  // Check if user exists
  const user = await prisma.user_v2414.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new Error("User not found")
  }

  // Add team member
  return prisma.projectMember_v2414.create({
    data: {
      projectId,
      userId,
      role,
    },
    include: {
      user: true,
    },
  })
}

export async function removeTeamMember_v2414(
  projectId: string,
  userId: string,
  adminId: string
) {
  // Check if admin has permission
  const admin = await prisma.user_v2414.findUnique({
    where: { id: adminId },
  })

  if (!admin || admin.role !== Role_v2414.SUPER_ADMIN) {
    throw new Error("Unauthorized to manage team members")
  }

  // Remove team member
  return prisma.projectMember_v2414.delete({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  })
}

export async function getTeamPerformance_v2414(
  projectId: string
): Promise<TeamPerformance_v2414> {
  const [members, tasks, comments] = await Promise.all([
    prisma.projectMember_v2414.findMany({
      where: { projectId },
      include: {
        user: true,
      },
    }),
    prisma.translationTask_v2414.findMany({
      where: { projectId },
      include: {
        history: true,
      },
    }),
    prisma.taskComment_v2414.findMany({
      where: {
        task: {
          projectId,
        },
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    }),
  ])

  const memberStats: TeamMemberStats_v2414[] = await Promise.all(
    members.map(async (member) => {
      const memberTasks = tasks.filter(
        (task) => task.assignedTo === member.userId
      )
      const completedTasks = memberTasks.filter(
        (task) => task.status === "approved"
      )
      const inProgressTasks = memberTasks.filter(
        (task) =>
          task.status === "in-progress" || task.status === "review"
      )

      // Get quality scores from QA checks
      const qualityChecks = await prisma.qualityCheck_v2414.findMany({
        where: {
          createdBy: member.userId,
        },
      })

      const averageQuality =
        qualityChecks.length > 0
          ? qualityChecks.reduce(
              (sum, check) =>
                sum + (check.severity === "error" ? 0 : check.severity === "warning" ? 50 : 100),
              0
            ) / qualityChecks.length
          : 100

      // Get last activity timestamp
      const lastActivity = await getLastActivity_v2414(member.userId, projectId)

      return {
        userId: member.userId,
        name: member.user.name || member.user.email,
        role: member.role,
        tasksCompleted: completedTasks.length,
        tasksInProgress: inProgressTasks.length,
        averageQualityScore: averageQuality,
        commentsCount: comments.filter((c) => c.userId === member.userId).length,
        lastActive: lastActivity,
      }
    })
  )

  return {
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === "approved").length,
    averageQuality:
      memberStats.reduce((sum, stats) => sum + stats.averageQualityScore, 0) /
      memberStats.length,
    memberStats,
    recentActivity: comments.map((comment) => ({
      type: "comment",
      user: comment.user.name || comment.user.email,
      content: comment.content,
      timestamp: comment.createdAt,
    })),
  }
}

async function getLastActivity_v2414(
  userId: string,
  projectId: string
): Promise<Date> {
  const [lastTask, lastComment] = await Promise.all([
    prisma.translationTask_v2414.findFirst({
      where: {
        projectId,
        OR: [{ assignedTo: userId }, { reviewedBy: userId }],
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),
    prisma.taskComment_v2414.findFirst({
      where: {
        userId,
        task: {
          projectId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ])

  const dates = [
    lastTask?.updatedAt,
    lastComment?.createdAt,
  ].filter((date): date is Date => date !== null && date !== undefined)

  return dates.length > 0
    ? new Date(Math.max(...dates.map((d) => d.getTime())))
    : new Date()
}

export async function getTeamNotifications_v2414(
  projectId: string,
  userId: string
) {
  const [assignedTasks, reviewTasks, comments] = await Promise.all([
    prisma.translationTask_v2414.findMany({
      where: {
        projectId,
        assignedTo: userId,
        status: {
          in: ["pending", "in-progress", "needs-review"],
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
    }),
    prisma.translationTask_v2414.findMany({
      where: {
        projectId,
        reviewedBy: userId,
        status: "review",
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
    }),
    prisma.taskComment_v2414.findMany({
      where: {
        task: {
          projectId,
          OR: [{ assignedTo: userId }, { reviewedBy: userId }],
        },
        NOT: {
          userId,
        },
      },
      include: {
        user: true,
        task: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
  ])

  return {
    assignedTasks,
    reviewTasks,
    comments,
  }
}
