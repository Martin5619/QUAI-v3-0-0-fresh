import { NextResponse } from "next/server"
import { type Locale } from "@/i18n.config"
import { auth } from "@/lib/auth"

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY

interface ValidationRequest_v2414 {
  text: string
  translation: string
  locale: Locale
}

export async function POST(request: Request) {
  try {
    // Check authentication and authorization
    const session = await auth()
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = (await request.json()) as ValidationRequest_v2414
    const { text, translation, locale } = body

    if (!text || !translation || !locale) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Call Claude API for translation validation
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
            content: `You are a professional translation validator. Evaluate the following translation from English to ${locale}. Check for:
1. Accuracy of meaning
2. Cultural appropriateness
3. Grammar and spelling
4. Tone and style consistency
5. Technical terminology accuracy

Provide your evaluation in JSON format with the following fields:
- isValid: boolean
- suggestions: array of suggested improvements (if any)
- confidence: number between 0 and 1
- explanation: brief explanation of the evaluation`,
          },
          {
            role: "user",
            content: `Original text: ${text}\nTranslation: ${translation}`,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error("Translation validation API error")
    }

    const data = await response.json()
    const evaluation = JSON.parse(data.content)

    return NextResponse.json({
      isValid: evaluation.isValid,
      suggestions: evaluation.suggestions,
      confidence: evaluation.confidence,
      explanation: evaluation.explanation,
    })
  } catch (error) {
    console.error("Translation validation error:", error)
    return new NextResponse("Translation validation failed", { status: 500 })
  }
}

export async function GET() {
  return new NextResponse("Method not allowed", { status: 405 })
}
