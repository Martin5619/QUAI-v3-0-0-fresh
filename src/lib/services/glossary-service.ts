import { prisma } from "@/lib/prisma"
import { type Locale } from "@/i18n.config"
import { LanguageCode_v2414 } from "@prisma/client"

interface GlossaryTerm_v2414 {
  term: string
  definition: string
  context?: string
  translations: {
    locale: Locale
    translation: string
    notes?: string
  }[]
  category?: string
  notes?: string
}

export async function findGlossaryTerms_v2414(
  text: string,
  sourceLocale: Locale,
  targetLocale: Locale
): Promise<GlossaryTerm_v2414[]> {
  const sourceLanguage = LanguageCode_v2414[sourceLocale.toUpperCase()]
  const targetLanguage = LanguageCode_v2414[targetLocale.toUpperCase()]

  // Find all terms in the source language
  const terms = await prisma.glossaryTerm_v2414.findMany({
    where: {
      locale: sourceLanguage,
      OR: [
        { term: { contains: text, mode: "insensitive" } },
        { definition: { contains: text, mode: "insensitive" } },
      ],
    },
    include: {
      translations: {
        where: {
          locale: targetLanguage,
        },
      },
    },
  })

  return terms.map((term) => ({
    term: term.term,
    definition: term.definition,
    context: term.context || undefined,
    translations: term.translations.map((t) => ({
      locale: t.locale.toLowerCase() as Locale,
      translation: t.translation,
      notes: t.notes || undefined,
    })),
    category: term.category || undefined,
    notes: term.notes || undefined,
  }))
}

export async function addGlossaryTerm_v2414(
  term: string,
  definition: string,
  locale: Locale,
  userId: string,
  translations: {
    locale: Locale
    translation: string
    notes?: string
  }[],
  options?: {
    context?: string
    category?: string
    notes?: string
  }
) {
  const language = LanguageCode_v2414[locale.toUpperCase()]

  // Create the main term
  const glossaryTerm = await prisma.glossaryTerm_v2414.create({
    data: {
      term,
      definition,
      locale: language,
      context: options?.context,
      category: options?.category,
      notes: options?.notes,
      createdBy: userId,
    },
  })

  // Add translations
  const translationPromises = translations.map((t) =>
    prisma.glossaryTranslation_v2414.create({
      data: {
        termId: glossaryTerm.id,
        translation: t.translation,
        locale: LanguageCode_v2414[t.locale.toUpperCase()],
        notes: t.notes,
      },
    })
  )

  await Promise.all(translationPromises)

  return glossaryTerm
}

export async function updateGlossaryTerm_v2414(
  termId: string,
  updates: {
    term?: string
    definition?: string
    context?: string
    category?: string
    notes?: string
    translations?: {
      id?: string
      locale: Locale
      translation: string
      notes?: string
    }[]
  }
) {
  // Update the main term
  const updatedTerm = await prisma.glossaryTerm_v2414.update({
    where: { id: termId },
    data: {
      term: updates.term,
      definition: updates.definition,
      context: updates.context,
      category: updates.category,
      notes: updates.notes,
    },
  })

  // Update translations if provided
  if (updates.translations) {
    for (const translation of updates.translations) {
      if (translation.id) {
        // Update existing translation
        await prisma.glossaryTranslation_v2414.update({
          where: { id: translation.id },
          data: {
            translation: translation.translation,
            locale: LanguageCode_v2414[translation.locale.toUpperCase()],
            notes: translation.notes,
          },
        })
      } else {
        // Create new translation
        await prisma.glossaryTranslation_v2414.create({
          data: {
            termId: updatedTerm.id,
            translation: translation.translation,
            locale: LanguageCode_v2414[translation.locale.toUpperCase()],
            notes: translation.notes,
          },
        })
      }
    }
  }

  return updatedTerm
}

export async function deleteGlossaryTerm_v2414(termId: string) {
  // This will also delete all related translations due to onDelete: Cascade
  return prisma.glossaryTerm_v2414.delete({
    where: { id: termId },
  })
}
