import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

interface GeneratedQuestion {
  type: string
  question: string
  answer: string
  options?: string[]
  difficulty: string
  topic?: string
}

export async function generateQuestionsWithClaude(
  content: string
): Promise<GeneratedQuestion[]> {
  try {
    const prompt = `Given the following text, generate a mix of multiple-choice, true/false, and open-ended questions. For each question, provide:
1. The question type
2. The question text
3. The correct answer
4. For multiple-choice questions, provide 4 options
5. A difficulty level (easy, medium, or hard)
6. A relevant topic or subject area

Format the response as a JSON array of questions.

Text:
${content}

Generate 5 questions of varying types and difficulty levels.`

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const questions = JSON.parse(response.content[0].text) as GeneratedQuestion[]
    return questions
  } catch (error) {
    console.error('Error generating questions with Claude:', error)
    throw new Error('Failed to generate questions')
  }
}
