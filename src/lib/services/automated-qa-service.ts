import { prisma } from "@/lib/prisma"
import { type Locale } from "@/i18n.config"
import { LanguageCode_v2414 } from "@prisma/client"
import { checkTranslationQuality_v2414 } from "./qa-service"
import { findSimilarTranslations_v2414 } from "./translation-memory-service"
import { findGlossaryTerms_v2414 } from "./glossary-service"

interface QAJobResult_v2414 {
  taskId: string
  sourceText: string
  translation: string
  qualityScore: number
  issues: any[]
  suggestions: string[]
  glossaryMatches: any[]
  memoryMatches: any[]
}

export async function runQAJob_v2414(
  projectId: string,
  userId: string
): Promise<QAJobResult_v2414[]> {
  const tasks = await prisma.translationTask_v2414.findMany({
    where: {
      projectId,
      NOT: {
        translation: null,
      },
    },
    include: {
      project: true,
    },
  })

  const results: QAJobResult_v2414[] = []

  for (const task of tasks) {
    if (!task.translation) continue

    const sourceLocale = task.project.sourceLocale.toLowerCase() as Locale
    const targetLocale = task.targetLocale.toLowerCase() as Locale

    // Run quality checks
    const qaResult = await checkTranslationQuality_v2414(
      task.sourceText,
      task.translation,
      sourceLocale,
      targetLocale,
      userId
    )

    // Find similar translations from memory
    const memoryMatches = await findSimilarTranslations_v2414(
      task.sourceText,
      sourceLocale,
      targetLocale
    )

    // Find relevant glossary terms
    const glossaryMatches = await findGlossaryTerms_v2414(
      task.sourceText,
      sourceLocale,
      targetLocale
    )

    // Generate suggestions based on issues
    const suggestions = generateSuggestions_v2414(
      task.translation,
      qaResult.issues,
      memoryMatches,
      glossaryMatches
    )

    results.push({
      taskId: task.id,
      sourceText: task.sourceText,
      translation: task.translation,
      qualityScore: qaResult.score,
      issues: qaResult.issues,
      suggestions,
      glossaryMatches,
      memoryMatches,
    })

    // Update task if issues are found
    if (qaResult.issues.length > 0) {
      await updateTaskWithQAResults_v2414(task.id, qaResult, userId)
    }
  }

  return results
}

export async function scheduleQAJob_v2414(
  projectId: string,
  userId: string,
  schedule: {
    frequency: "hourly" | "daily" | "weekly"
    time?: string // For daily/weekly jobs
    day?: string // For weekly jobs
  }
) {
  return prisma.qAJob_v2414.create({
    data: {
      projectId,
      frequency: schedule.frequency,
      scheduleTime: schedule.time,
      scheduleDay: schedule.day,
      status: "scheduled",
      createdBy: userId,
    },
  })
}

export async function getQAJobHistory_v2414(projectId: string) {
  return prisma.qAJob_v2414.findMany({
    where: {
      projectId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      results: true,
    },
  })
}

function generateSuggestions_v2414(
  translation: string,
  issues: any[],
  memoryMatches: any[],
  glossaryMatches: any[]
): string[] {
  const suggestions: string[] = []

  // Add suggestions based on issues
  for (const issue of issues) {
    if (issue.suggestion) {
      suggestions.push(issue.suggestion)
    }
  }

  // Add suggestions from translation memory
  for (const match of memoryMatches) {
    if (match.confidence > 0.8) {
      suggestions.push(
        `Consider using: "${match.translation}" (${Math.round(
          match.confidence * 100
        )}% match)`
      )
    }
  }

  // Add suggestions from glossary
  for (const term of glossaryMatches) {
    if (term.translations.length > 0) {
      suggestions.push(
        `Use "${term.translations[0].translation}" for "${term.term}"`
      )
    }
  }

  return suggestions
}

async function updateTaskWithQAResults_v2414(
  taskId: string,
  qaResult: any,
  userId: string
) {
  // Update task status if quality score is too low
  if (qaResult.score < 70) {
    await prisma.translationTask_v2414.update({
      where: { id: taskId },
      data: {
        status: "needs-review",
      },
    })

    // Add task history entry
    await prisma.taskHistory_v2414.create({
      data: {
        taskId,
        userId,
        action: "qa-review",
        details: {
          score: qaResult.score,
          issueCount: qaResult.issues.length,
        },
      },
    })

    // Add comment with QA results
    await prisma.taskComment_v2414.create({
      data: {
        taskId,
        userId,
        content: `Automated QA check found ${
          qaResult.issues.length
        } issues:\n${qaResult.issues
          .map((i: any) => `- ${i.message}`)
          .join("\n")}`,
      },
    })
  }
}
