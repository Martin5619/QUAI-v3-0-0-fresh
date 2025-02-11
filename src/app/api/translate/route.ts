import { NextResponse } from "next/server"
import { type Locale } from "@/i18n.config"
import { getServerSession } from "@/lib/auth"

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

    const body = (await request.json()) as TranslationRequest_v2414
    const { text, sourceLocale, targetLocale } = body

    if (!text || !sourceLocale || !targetLocale) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Call Claude API for translation
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY!,
      },
      body: JSON.stringify({
        model: "claude-3-opus-20240229",
        max_tokens: 1000,
        messages: [
          {
            role: "system",
            content: `You are a professional translator. Translate the following text from ${sourceLocale} to ${targetLocale}. Maintain the original meaning, tone, and formatting. If there are any culturally specific elements, adapt them appropriately for the target language.`,
          },
          {
            role: "user",
            content: text,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error("Translation API error")
    }

    const data = await response.json()
    const translation = data.content

    return NextResponse.json({
      translation,
      confidence: 0.95, // Placeholder confidence score
    })
  } catch (error) {
    console.error("Translation error:", error)
    return new NextResponse("Translation failed", { status: 500 })
  }
}

export async function GET() {
  return new NextResponse("Method not allowed", { status: 405 })
}
