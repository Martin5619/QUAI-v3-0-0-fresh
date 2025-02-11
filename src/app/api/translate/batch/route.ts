import { NextResponse } from "next/server"
import { type Locale } from "@/i18n.config"
import { auth } from "@/lib/auth"
import { getServerSession } from "next-auth/next"

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY

interface TranslationRequest_v2414 {
  text: string
  sourceLocale: Locale
  targetLocale: Locale
}

export async function POST(request: Request) {
  try {
    // Check authentication and authorization
    const session = await getServerSession()
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { items } = body as { items: TranslationRequest_v2414[] }

    if (!Array.isArray(items) || items.length === 0) {
      return new NextResponse("Invalid request body", { status: 400 })
    }

    // Group translations by target language for efficiency
    const translationsByLanguage = items.reduce((acc, item) => {
      const key = `${item.sourceLocale}-${item.targetLocale}`
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(item)
      return acc
    }, {} as Record<string, TranslationRequest_v2414[]>)

    const translations = []

    // Process each language group
    for (const [langPair, texts] of Object.entries(translationsByLanguage)) {
      const [sourceLocale, targetLocale] = langPair.split("-") as [Locale, Locale]
      
      // Combine texts for batch translation
      const combinedText = texts
        .map((item, index) => `[${index}] ${item.text}`)
        .join("\n\n")

      // Call Claude API for batch translation
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": CLAUDE_API_KEY!,
        },
        body: JSON.stringify({
          model: "claude-3-opus-20240229",
          max_tokens: 4000,
          messages: [
            {
              role: "system",
              content: `You are a professional translator. Translate the following texts from ${sourceLocale} to ${targetLocale}. Each text is prefixed with [index]. Maintain the original meaning, tone, and formatting. If there are any culturally specific elements, adapt them appropriately for the target language. Return the translations in the same format, preserving the [index] prefixes.`,
            },
            {
              role: "user",
              content: combinedText,
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error("Translation API error")
      }

      const data = await response.json()
      const translatedText = data.content

      // Parse individual translations
      const translationMap = new Map()
      translatedText.split("\n\n").forEach((translation: string) => {
        const match = translation.match(/\[(\d+)\] (.+)/)
        if (match) {
          const [, index, text] = match
          translationMap.set(parseInt(index), text.trim())
        }
      })

      // Map translations back to original items
      texts.forEach((item, index) => {
        translations.push({
          translation: translationMap.get(index) || "",
          confidence: 0.95, // Placeholder confidence score
        })
      })
    }

    return NextResponse.json({ translations })
  } catch (error) {
    console.error("Batch translation error:", error)
    return new NextResponse("Batch translation failed", { status: 500 })
  }
}

export async function GET() {
  return new NextResponse("Method not allowed", { status: 405 })
}
