import { prisma } from "@/lib/prisma"
import { type Locale } from "@/i18n.config"
import { LanguageCode_v2414 } from "@prisma/client"

const SIMILARITY_THRESHOLD = 0.8

interface TranslationMatch_v2414 {
  sourceText: string
  translation: string
  confidence: number
  context?: string
}

export async function findSimilarTranslations_v2414(
  text: string,
  sourceLocale: Locale,
  targetLocale: Locale,
  context?: string
): Promise<TranslationMatch_v2414[]> {
  // Convert locale to LanguageCode_v2414
  const sourceLanguage = LanguageCode_v2414[sourceLocale.toUpperCase()]
  const targetLanguage = LanguageCode_v2414[targetLocale.toUpperCase()]

  // Find similar translations in the translation memory
  const memories = await prisma.translationMemory_v2414.findMany({
    where: {
      sourceLocale: sourceLanguage,
      targetLocale: targetLanguage,
      context: context,
    },
    orderBy: [
      { confidence: "desc" },
      { usageCount: "desc" },
      { lastUsed: "desc" },
    ],
    take: 5,
  })

  // Calculate similarity and filter matches
  const matches = memories
    .map((memory) => ({
      sourceText: memory.sourceText,
      translation: memory.translation,
      confidence: calculateSimilarity(text, memory.sourceText),
      context: memory.context,
    }))
    .filter((match) => match.confidence >= SIMILARITY_THRESHOLD)

  return matches
}

export async function addToTranslationMemory_v2414(
  sourceText: string,
  translation: string,
  sourceLocale: Locale,
  targetLocale: Locale,
  userId: string,
  context?: string,
  confidence: number = 1.0
) {
  // Convert locale to LanguageCode_v2414
  const sourceLanguage = LanguageCode_v2414[sourceLocale.toUpperCase()]
  const targetLanguage = LanguageCode_v2414[targetLocale.toUpperCase()]

  // Check if a similar translation already exists
  const existingMemory = await prisma.translationMemory_v2414.findFirst({
    where: {
      sourceText,
      sourceLocale: sourceLanguage,
      targetLocale: targetLanguage,
      context,
    },
  })

  if (existingMemory) {
    // Update existing memory
    return prisma.translationMemory_v2414.update({
      where: { id: existingMemory.id },
      data: {
        usageCount: { increment: 1 },
        confidence: Math.max(existingMemory.confidence, confidence),
        lastUsed: new Date(),
      },
    })
  }

  // Create new memory
  return prisma.translationMemory_v2414.create({
    data: {
      sourceText,
      translation,
      sourceLocale: sourceLanguage,
      targetLocale: targetLanguage,
      context,
      confidence,
      createdBy: userId,
    },
  })
}

// Simple Levenshtein distance implementation for similarity calculation
function calculateSimilarity(str1: string, str2: string): number {
  const len1 = str1.length
  const len2 = str2.length
  const matrix: number[][] = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(null))

  for (let i = 0; i <= len1; i++) matrix[i][0] = i
  for (let j = 0; j <= len2; j++) matrix[0][j] = j

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      )
    }
  }

  const distance = matrix[len1][len2]
  const maxLength = Math.max(len1, len2)
  return 1 - distance / maxLength
}
