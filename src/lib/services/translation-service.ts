import { type Locale } from "@/i18n.config"

interface TranslationRequest_v2414 {
  text: string
  sourceLocale: Locale
  targetLocale: Locale
}

interface TranslationResponse_v2414 {
  translation: string
  confidence: number
}

export async function translateText_v2414({
  text,
  sourceLocale,
  targetLocale,
}: TranslationRequest_v2414): Promise<TranslationResponse_v2414> {
  try {
    // Use Anthropic's Claude API for translation
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        sourceLocale,
        targetLocale,
      }),
    })

    if (!response.ok) {
      throw new Error("Translation failed")
    }

    const data = await response.json()
    return {
      translation: data.translation,
      confidence: data.confidence,
    }
  } catch (error) {
    console.error("Translation error:", error)
    throw error
  }
}

export async function translateBatch_v2414(
  items: TranslationRequest_v2414[]
): Promise<TranslationResponse_v2414[]> {
  try {
    const response = await fetch("/api/translate/batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    })

    if (!response.ok) {
      throw new Error("Batch translation failed")
    }

    const data = await response.json()
    return data.translations
  } catch (error) {
    console.error("Batch translation error:", error)
    throw error
  }
}

export async function validateTranslation_v2414({
  text,
  translation,
  locale,
}: {
  text: string
  translation: string
  locale: Locale
}): Promise<{
  isValid: boolean
  suggestions?: string[]
  confidence: number
}> {
  try {
    const response = await fetch("/api/translate/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        translation,
        locale,
      }),
    })

    if (!response.ok) {
      throw new Error("Translation validation failed")
    }

    return response.json()
  } catch (error) {
    console.error("Translation validation error:", error)
    throw error
  }
}
