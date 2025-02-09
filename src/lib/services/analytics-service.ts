import { prisma } from "@/lib/prisma"
import { type Locale } from "@/i18n.config"
import { LanguageCode_v2414 } from "@prisma/client"

interface ProjectAnalytics_v2414 {
  overview: {
    totalProjects: number
    activeProjects: number
    completedProjects: number
    averageProgress: number
  }
  performance: {
    totalTasks: number
    completedTasks: number
    averageQuality: number
    averageTimeToComplete: number
  }
  languages: {
    sourceLanguages: { code: string; count: number }[]
    targetLanguages: { code: string; count: number }[]
    languagePairs: { source: string; target: string; count: number }[]
  }
  quality: {
    averageScore: number
    issuesByType: Record<string, number>
    trendsOverTime: {
      date: string
      score: number
    }[]
  }
  team: {
    totalMembers: number
    membersByRole: Record<string, number>
    topContributors: {
      userId: string
      name: string
      tasksCompleted: number
      qualityScore: number
    }[]
  }
}

export async function getProjectAnalytics_v2414(
  projectId: string
): Promise<ProjectAnalytics_v2414> {
  const [
    project,
    tasks,
    qualityChecks,
    teamMembers,
    taskHistory,
  ] = await Promise.all([
    prisma.translationProject_v2414.findUnique({
      where: { id: projectId },
    }),
    prisma.translationTask_v2414.findMany({
      where: { projectId },
      include: {
        history: true,
      },
    }),
    prisma.qualityCheck_v2414.findMany({
      where: {
        task: {
          projectId,
        },
      },
    }),
    prisma.projectMember_v2414.findMany({
      where: { projectId },
      include: {
        user: true,
      },
    }),
    prisma.taskHistory_v2414.findMany({
      where: {
        task: {
          projectId,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
  ])

  if (!project) {
    throw new Error("Project not found")
  }

  // Calculate overview metrics
  const overview = {
    totalProjects: 1,
    activeProjects: project.status === "in-progress" ? 1 : 0,
    completedProjects: project.status === "completed" ? 1 : 0,
    averageProgress: project.progress,
  }

  // Calculate performance metrics
  const completedTasks = tasks.filter((t) => t.status === "approved")
  const performance = {
    totalTasks: tasks.length,
    completedTasks: completedTasks.length,
    averageQuality:
      qualityChecks.reduce(
        (sum, check) =>
          sum + (check.severity === "error" ? 0 : check.severity === "warning" ? 50 : 100),
        0
      ) / (qualityChecks.length || 1),
    averageTimeToComplete: calculateAverageCompletionTime_v2414(tasks),
  }

  // Analyze language statistics
  const languages = {
    sourceLanguages: [
      {
        code: project.sourceLocale,
        count: tasks.length,
      },
    ],
    targetLanguages: project.targetLocales.map((locale) => ({
      code: locale,
      count: tasks.filter((t) => t.targetLocale === locale).length,
    })),
    languagePairs: project.targetLocales.map((target) => ({
      source: project.sourceLocale,
      target,
      count: tasks.filter((t) => t.targetLocale === target).length,
    })),
  }

  // Analyze quality metrics
  const quality = {
    averageScore:
      qualityChecks.reduce((sum, check) => sum + check.issues.length, 0) /
      (qualityChecks.length || 1),
    issuesByType: calculateIssuesByType_v2414(qualityChecks),
    trendsOverTime: calculateQualityTrends_v2414(qualityChecks),
  }

  // Analyze team performance
  const team = {
    totalMembers: teamMembers.length,
    membersByRole: teamMembers.reduce(
      (acc, member) => ({
        ...acc,
        [member.role]: (acc[member.role] || 0) + 1,
      }),
      {} as Record<string, number>
    ),
    topContributors: calculateTopContributors_v2414(tasks, teamMembers),
  }

  return {
    overview,
    performance,
    languages,
    quality,
    team,
  }
}

function calculateAverageCompletionTime_v2414(tasks: any[]): number {
  const completionTimes = tasks
    .filter((task) => task.status === "approved")
    .map((task) => {
      const start = task.history.find(
        (h: any) => h.action === "created"
      )?.createdAt
      const end = task.history.find(
        (h: any) => h.action === "status-changed" && h.details.to === "approved"
      )?.createdAt

      if (start && end) {
        return new Date(end).getTime() - new Date(start).getTime()
      }
      return null
    })
    .filter((time): time is number => time !== null)

  return completionTimes.length > 0
    ? completionTimes.reduce((sum, time) => sum + time, 0) /
        completionTimes.length /
        (1000 * 60 * 60) // Convert to hours
    : 0
}

function calculateIssuesByType_v2414(
  qualityChecks: any[]
): Record<string, number> {
  return qualityChecks.reduce((acc, check) => {
    check.issues.forEach((issue: any) => {
      acc[issue.type] = (acc[issue.type] || 0) + 1
    })
    return acc
  }, {})
}

function calculateQualityTrends_v2414(qualityChecks: any[]) {
  const trends: { date: string; score: number }[] = []
  const checksByDate = new Map<string, any[]>()

  qualityChecks.forEach((check) => {
    const date = new Date(check.createdAt).toISOString().split("T")[0]
    const checks = checksByDate.get(date) || []
    checks.push(check)
    checksByDate.set(date, checks)
  })

  checksByDate.forEach((checks, date) => {
    const averageScore =
      checks.reduce(
        (sum, check) =>
          sum +
          (check.severity === "error"
            ? 0
            : check.severity === "warning"
            ? 50
            : 100),
        0
      ) / checks.length

    trends.push({
      date,
      score: averageScore,
    })
  })

  return trends.sort((a, b) => a.date.localeCompare(b.date))
}

function calculateTopContributors_v2414(tasks: any[], teamMembers: any[]) {
  const contributorStats = new Map<
    string,
    { tasksCompleted: number; qualityScore: number }
  >()

  tasks.forEach((task) => {
    if (task.status === "approved" && task.assignedTo) {
      const stats = contributorStats.get(task.assignedTo) || {
        tasksCompleted: 0,
        qualityScore: 0,
      }
      stats.tasksCompleted++
      contributorStats.set(task.assignedTo, stats)
    }
  })

  return teamMembers
    .map((member) => ({
      userId: member.userId,
      name: member.user.name || member.user.email,
      ...(contributorStats.get(member.userId) || {
        tasksCompleted: 0,
        qualityScore: 0,
      }),
    }))
    .sort((a, b) => b.tasksCompleted - a.tasksCompleted)
    .slice(0, 5)
}

export async function generateAnalyticsReport_v2414(projectId: string) {
  const analytics = await getProjectAnalytics_v2414(projectId)

  return {
    generatedAt: new Date(),
    projectId,
    summary: `
Project Analytics Summary:
------------------------
Total Tasks: ${analytics.performance.totalTasks}
Completed Tasks: ${analytics.performance.completedTasks}
Average Quality Score: ${Math.round(analytics.quality.averageScore)}%
Average Time to Complete: ${Math.round(
      analytics.performance.averageTimeToComplete
    )} hours

Top Issues:
${Object.entries(analytics.quality.issuesByType)
  .map(([type, count]) => `- ${type}: ${count} issues`)
  .join("\n")}

Top Contributors:
${analytics.team.topContributors
  .map(
    (c) =>
      `- ${c.name}: ${c.tasksCompleted} tasks (${Math.round(
        c.qualityScore
      )}% quality)`
  )
  .join("\n")}
    `,
    analytics,
  }
}
