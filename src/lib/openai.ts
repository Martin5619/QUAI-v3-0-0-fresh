import OpenAI from 'openai'
import { QuestionType } from '@prisma/client'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface GeneratedQuestion {
  question: string
  answer: string
  type: QuestionType
  explanation?: string
  options?: string[] // For multiple choice questions
}

export interface GenerationContext {
  documentContent?: string
  customPrompt?: string
  questionTypes: QuestionType[]
  difficulty: string
  numberOfQuestions: number
}

const SYSTEM_PROMPT = `You are an expert question generator. Your task is to create high-quality educational questions based on the provided content or instructions. Follow these rules:

1. Generate questions that test understanding, not just memorization
2. Ensure questions are clear, concise, and unambiguous
3. Provide detailed, accurate answers
4. Include explanations that help learners understand the concept
5. For multiple choice questions, create plausible but clearly incorrect options
6. Adapt question difficulty based on the specified level
7. Ensure questions are directly related to the content or prompt provided`

export async function generateQuestions(
  context: GenerationContext,
  onProgress?: (progress: number) => void
): Promise<GeneratedQuestion[]> {
  const questions: GeneratedQuestion[] = []
  const batchSize = 5 // Generate questions in batches of 5
  const totalBatches = Math.ceil(context.numberOfQuestions / batchSize)

  for (let batch = 0; batch < totalBatches; batch++) {
    const questionsInBatch = Math.min(
      batchSize,
      context.numberOfQuestions - batch * batchSize
    )

    const prompt = createPrompt(context, questionsInBatch)
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })

      const response = completion.choices[0]?.message?.content
      if (!response) throw new Error("No response from OpenAI")

      const parsedResponse = JSON.parse(response)
      if (!Array.isArray(parsedResponse.questions)) {
        throw new Error("Invalid response format")
      }

      questions.push(...parsedResponse.questions)

      // Report progress
      if (onProgress) {
        const progress = Math.min(
          ((batch + 1) * batchSize / context.numberOfQuestions) * 100,
          100
        )
        onProgress(progress)
      }
    } catch (error) {
      console.error('Error generating questions:', error)
      throw error
    }
  }

  return questions.slice(0, context.numberOfQuestions)
}

function createPrompt(context: GenerationContext, numQuestions: number): string {
  const {
    documentContent,
    customPrompt,
    questionTypes,
    difficulty,
    numberOfQuestions
  } = context

  let prompt = `Generate ${numQuestions} ${difficulty} level questions.\n\n`

  if (documentContent) {
    prompt += `Base the questions on this content:\n${documentContent}\n\n`
  }

  if (customPrompt) {
    prompt += `Additional instructions:\n${customPrompt}\n\n`
  }

  prompt += `Question types to generate: ${questionTypes.join(", ")}\n`
  prompt += `
Format each question as a JSON object with these fields:
- question (string): The question text
- answer (string): The correct answer
- type (string): The question type (${questionTypes.join("|")})
- explanation (string): A helpful explanation of the answer
- options (string[]): For multiple choice questions only, include 4 options

Return the response as a JSON object with a 'questions' array containing all generated questions.`

  return prompt
}
