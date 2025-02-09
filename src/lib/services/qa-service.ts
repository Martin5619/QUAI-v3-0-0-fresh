import { prisma } from "@/lib/prisma"
import { type Locale } from "@/i18n.config"
import { LanguageCode_v2414 } from "@prisma/client"

interface QAIssue_v2414 {
  type: "spelling" | "grammar" | "consistency" | "terminology" | "formatting"
  message: string
  suggestion?: string
  position?: {
    start: number
    end: number
  }
}

interface QAResult_v2414 {
  hasIssues: boolean
  issues: QAIssue_v2414[]
  score: number
}

export async function checkTranslationQuality_v2414(
  sourceText: string,
  translation: string,
  sourceLocale: Locale,
  targetLocale: Locale,
  userId: string
): Promise<QAResult_v2414> {
  const issues: QAIssue_v2414[] = []

  // 1. Check for glossary term consistency
  const glossaryIssues = await checkGlossaryConsistency_v2414(
    translation,
    targetLocale
  )
  issues.push(...glossaryIssues)

  // 2. Check for translation memory consistency
  const memoryIssues = await checkMemoryConsistency_v2414(
    sourceText,
    translation,
    sourceLocale,
    targetLocale
  )
  issues.push(...memoryIssues)

  // 3. Check for common formatting issues
  const formattingIssues = checkFormatting_v2414(sourceText, translation)
  issues.push(...formattingIssues)

  // 4. Check for placeholder consistency
  const placeholderIssues = checkPlaceholders_v2414(sourceText, translation)
  issues.push(...placeholderIssues)

  // Calculate quality score (0-100)
  const score = calculateQualityScore_v2414(issues)

  // Store QA check result if there are issues
  if (issues.length > 0) {
    await prisma.qualityCheck_v2414.create({
      data: {
        sourceText,
        translation,
        sourceLocale: LanguageCode_v2414[sourceLocale.toUpperCase()],
        targetLocale: LanguageCode_v2414[targetLocale.toUpperCase()],
        issues: issues as any[],
        severity: getSeverityLevel_v2414(score),
        status: "open",
        createdBy: userId,
      },
    })
  }

  return {
    hasIssues: issues.length > 0,
    issues,
    score,
  }
}

async function checkGlossaryConsistency_v2414(
  translation: string,
  locale: Locale
): Promise<QAIssue_v2414[]> {
  const issues: QAIssue_v2414[] = []
  const language = LanguageCode_v2414[locale.toUpperCase()]

  // Get all glossary terms for the target language
  const glossaryTerms = await prisma.glossaryTranslation_v2414.findMany({
    where: {
      locale: language,
    },
    include: {
      term: true,
    },
  })

  // Check if glossary terms are used consistently
  for (const term of glossaryTerms) {
    const termRegex = new RegExp(term.term.term, "gi")
    const translationRegex = new RegExp(term.translation, "gi")

    const sourceMatches = term.term.term.match(termRegex)
    const targetMatches = translation.match(translationRegex)

    if (sourceMatches && (!targetMatches || sourceMatches.length !== targetMatches.length)) {
      issues.push({
        type: "terminology",
        message: `Inconsistent use of glossary term: "${term.term.term}"`,
        suggestion: `Consider using "${term.translation}"`,
      })
    }
  }

  return issues
}

async function checkMemoryConsistency_v2414(
  sourceText: string,
  translation: string,
  sourceLocale: Locale,
  targetLocale: Locale
): Promise<QAIssue_v2414[]> {
  const issues: QAIssue_v2414[] = []
  const sourceLanguage = LanguageCode_v2414[sourceLocale.toUpperCase()]
  const targetLanguage = LanguageCode_v2414[targetLocale.toUpperCase()]

  // Find similar translations in memory
  const memories = await prisma.translationMemory_v2414.findMany({
    where: {
      sourceLocale: sourceLanguage,
      targetLocale: targetLanguage,
      sourceText: {
        contains: sourceText,
        mode: "insensitive",
      },
    },
    orderBy: {
      confidence: "desc",
    },
    take: 5,
  })

  // Check for inconsistencies with translation memory
  for (const memory of memories) {
    if (
      memory.sourceText === sourceText &&
      memory.translation !== translation &&
      memory.confidence > 0.9
    ) {
      issues.push({
        type: "consistency",
        message: "Translation differs from high-confidence memory match",
        suggestion: memory.translation,
      })
    }
  }

  return issues
}

function checkFormatting_v2414(
  sourceText: string,
  translation: string
): QAIssue_v2414[] {
  const issues: QAIssue_v2414[] = []

  // Check for HTML tags consistency
  const sourceHtmlTags = sourceText.match(/<[^>]+>/g) || []
  const translationHtmlTags = translation.match(/<[^>]+>/g) || []

  if (sourceHtmlTags.length !== translationHtmlTags.length) {
    issues.push({
      type: "formatting",
      message: "Inconsistent HTML tags",
      suggestion: "Ensure all HTML tags are preserved in translation",
    })
  }

  // Check for punctuation at the end
  const sourcePunctuation = sourceText.match(/[.!?]$/)
  const translationPunctuation = translation.match(/[.!?]$/)

  if (sourcePunctuation && !translationPunctuation) {
    issues.push({
      type: "formatting",
      message: "Missing end punctuation",
      suggestion: "Add appropriate end punctuation",
    })
  }

  return issues
}

function checkPlaceholders_v2414(
  sourceText: string,
  translation: string
): QAIssue_v2414[] {
  const issues: QAIssue_v2414[] = []

  // Check for variable placeholders like {name} or {{name}}
  const sourcePlaceholders = sourceText.match(/\{+[^}]+\}+/g) || []
  const translationPlaceholders = translation.match(/\{+[^}]+\}+/g) || []

  const missingPlaceholders = sourcePlaceholders.filter(
    (p) => !translationPlaceholders.includes(p)
  )

  if (missingPlaceholders.length > 0) {
    issues.push({
      type: "formatting",
      message: "Missing variable placeholders",
      suggestion: `Add missing placeholders: ${missingPlaceholders.join(", ")}`,
    })
  }

  return issues
}

function calculateQualityScore_v2414(issues: QAIssue_v2414[]): number {
  const baseScore = 100
  const deductions = {
    spelling: 5,
    grammar: 10,
    consistency: 15,
    terminology: 20,
    formatting: 10,
  }

  const totalDeduction = issues.reduce(
    (sum, issue) => sum + deductions[issue.type],
    0
  )

  return Math.max(0, baseScore - totalDeduction)
}

function getSeverityLevel_v2414(score: number): string {
  if (score >= 90) return "info"
  if (score >= 70) return "warning"
  return "error"
}
