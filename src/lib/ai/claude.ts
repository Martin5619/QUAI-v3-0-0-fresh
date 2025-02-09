import Anthropic from '@anthropic-ai/sdk'
import { AIProvider, GeneratedQuestion, GenerationContext } from './types'
import { AIError } from './retry'

// Initialize Anthropic with better error handling
const SYSTEM_PROMPT = `You are Claude, an expert question generator. Your task is to create high-quality educational questions based on the provided content or instructions. Follow these rules:

1. Generate questions that test understanding, not just memorization
2. Ensure questions are clear, concise, and unambiguous
3. Provide detailed, accurate answers
4. Include explanations that help learners understand the concept
5. For multiple choice questions, create plausible but clearly incorrect options
6. Adapt question difficulty based on the specified level
7. Ensure questions are directly related to the content or prompt provided

IMPORTANT: Always return your response in this exact JSON format:
{
  "questions": [
    {
      "question": "Question text here",
      "answer": "Answer text here",
      "type": "MULTIPLE_CHOICE",
      "explanation": "Explanation here",
      "options": ["Option A", "Option B", "Option C", "Option D"]
    }
  ]
}`

export class ClaudeProvider implements AIProvider {
  private anthropic: Anthropic | null = null
  private readonly batchSize: number
  private readonly maxRetries: number
  private readonly temperature: number
  private readonly timeoutMs: number

  constructor() {
    // Load configuration from environment variables with defaults
    this.batchSize = parseInt(process.env.AI_BATCH_SIZE || '2', 10)
    this.maxRetries = parseInt(process.env.AI_MAX_RETRIES || '3', 10)
    this.temperature = parseFloat(process.env.AI_TEMPERATURE || '0.7')
    this.timeoutMs = parseInt(process.env.AI_TIMEOUT_MS || '120000', 10)
  }

  private getClient(): Anthropic {
    if (!this.anthropic) {
      const apiKey = process.env.ANTHROPIC_API_KEY
      if (!apiKey) {
        throw new AIError(
          'ANTHROPIC_API_KEY environment variable is not set',
          undefined,
          false
        )
      }
      this.anthropic = new Anthropic({ apiKey })
    }
    return this.anthropic
  }

  async generateQuestions(
    context: GenerationContext,
    onProgress?: (progress: number) => void
  ): Promise<GeneratedQuestion[]> {
    const questions: GeneratedQuestion[] = []
    const totalBatches = Math.ceil(context.numberOfQuestions / this.batchSize)

    for (let batch = 0; batch < totalBatches; batch++) {
      const questionsInBatch = Math.min(
        this.batchSize,
        context.numberOfQuestions - batch * this.batchSize
      )

      const prompt = this.createPrompt(context, questionsInBatch)
      
      let retryCount = 0
      let lastError: Error | null = null

      while (retryCount <= this.maxRetries) {
        try {
          console.log(`Batch ${batch + 1}/${totalBatches}, Attempt ${retryCount + 1}/${this.maxRetries + 1}`)
          console.log('Sending request to Claude with prompt length:', prompt.length)

          const message = await Promise.race([
            this.getClient().messages.create({
              model: 'claude-3-opus-20240229',
              max_tokens: 4000,
              temperature: this.temperature,
              system: SYSTEM_PROMPT,
              messages: [
                {
                  role: 'user',
                  content: prompt
                }
              ]
            }),
            new Promise((_, reject) => 
              setTimeout(() => reject(new AIError('Request timed out', undefined, true)), this.timeoutMs)
            )
          ]) as Anthropic.Message

          // Get the response text from the first content block
          const response = message.content[0]?.text
          if (!response) {
            throw new AIError('No response received from Claude', undefined, true)
          }

          console.log(`Batch ${batch + 1} response received, length:`, response.length)

          let parsedResponse
          try {
            // Try to extract JSON from the response if it's wrapped in text
            const jsonMatch = response.match(/\{[\s\S]*\}/)
            if (!jsonMatch) {
              console.error('No JSON found in response:', response.substring(0, 200))
              throw new AIError('Invalid response format - no JSON found', undefined, true)
            }

            const jsonStr = jsonMatch[0]
            try {
              parsedResponse = JSON.parse(jsonStr)
            } catch (parseError) {
              console.error('Failed to parse JSON:', jsonStr.substring(0, 200))
              throw new AIError('Failed to parse JSON response', parseError as Error, true)
            }

            if (!parsedResponse.questions || !Array.isArray(parsedResponse.questions)) {
              console.error('Response missing questions array:', parsedResponse)
              throw new AIError('Invalid response format - missing questions array', undefined, true)
            }

            // Validate each question
            parsedResponse.questions.forEach((q: any, i: number) => {
              if (!q.question || !q.answer || !q.type) {
                console.error(`Question ${i} is missing required fields:`, q)
                throw new AIError(`Question ${i} is missing required fields`, undefined, true)
              }
              if (q.type === 'MULTIPLE_CHOICE' && (!q.options || !Array.isArray(q.options) || q.options.length !== 4)) {
                console.error(`Question ${i} has invalid options:`, q.options)
                throw new AIError(`Multiple choice question ${i} has invalid options`, undefined, true)
              }
            })

            // Add questions from this batch
            questions.push(...parsedResponse.questions)
            console.log(`Added ${parsedResponse.questions.length} questions from batch ${batch + 1}`)

            if (onProgress) {
              const progress = Math.min(
                ((batch + 1) * this.batchSize) / context.numberOfQuestions,
                1
              )
              onProgress(progress)
            }
            break
          } catch (error) {
            console.error('Failed to process Claude response:', error)
            if (error instanceof AIError) {
              throw error
            }
            throw new AIError(
              `Failed to process response: ${error instanceof Error ? error.message : 'Invalid format'}`,
              error as Error,
              true
            )
          }
        } catch (error) {
          console.error('Error calling Claude API:', error)
          if (error instanceof AIError && error.timedOut) {
            retryCount++
            console.log(`Batch ${batch + 1} timed out, retrying...`)
            await new Promise(resolve => setTimeout(resolve, 5000)) // Wait 5 seconds before retrying
          } else {
            throw new AIError(
              'Failed to generate questions with Claude',
              error as Error,
              true
            )
          }
        }
      }
    }

    if (questions.length === 0) {
      throw new AIError('No questions were generated', undefined, true)
    }

    console.log(`Successfully generated ${questions.length} questions`)
    return questions
  }

  private createPrompt(context: GenerationContext, numQuestions: number): string {
    const { documentContent, customPrompt, questionTypes, difficulty } = context

    let prompt = `Generate ${numQuestions} ${difficulty.toLowerCase()} questions.\n\n`

    if (documentContent) {
      prompt += `Use this content as the source material:\n${documentContent}\n\n`
    }

    if (customPrompt) {
      prompt += `Additional instructions: ${customPrompt}\n\n`
    }

    prompt += `Question types to generate: ${questionTypes.join(', ')}\n`
    prompt += `Difficulty level: ${difficulty}\n\n`

    prompt += `IMPORTANT REQUIREMENTS:
1. Return EXACTLY ${numQuestions} questions
2. Use ONLY these question types: ${questionTypes.join(', ')}
3. Each question MUST have: question, answer, type, and explanation fields
4. Multiple choice questions MUST have exactly 4 options
5. Format your response as a JSON object with a "questions" array
6. Make sure all questions are at ${difficulty} difficulty level
7. DO NOT include any text outside the JSON object\n\n`

    prompt += `Example response format:
{
  "questions": [
    {
      "question": "What is...?",
      "answer": "The answer is...",
      "type": "MULTIPLE_CHOICE",
      "explanation": "This is correct because...",
      "options": ["Correct answer", "Wrong 1", "Wrong 2", "Wrong 3"]
    }
  ]
}`

    return prompt
  }
}
