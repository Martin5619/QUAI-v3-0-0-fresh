import OpenAI from 'openai'
import { AIProvider, GeneratedQuestion, GenerationContext } from './types'
import { AIError } from './retry'

export class OpenAIProvider implements AIProvider {
  private openai: OpenAI | null = null

  private getClient(): OpenAI {
    if (!this.openai) {
      const apiKey = process.env.OPENAI_API_KEY
      if (!apiKey) {
        throw new AIError(
          'OPENAI_API_KEY environment variable is not set',
          undefined,
          false
        )
      }
      this.openai = new OpenAI({ apiKey })
    }
    return this.openai
  }

  async generateQuestions(
    context: GenerationContext,
    onProgress?: (progress: number) => void
  ): Promise<GeneratedQuestion[]> {
    const questions: GeneratedQuestion[] = []
    const batchSize = 5
    const totalBatches = Math.ceil(context.numberOfQuestions / batchSize)

    for (let batch = 0; batch < totalBatches; batch++) {
      const questionsInBatch = Math.min(
        batchSize,
        context.numberOfQuestions - batch * batchSize
      )

      const prompt = this.createPrompt(context, questionsInBatch)

      try {
        console.log('Sending request to OpenAI with prompt:', prompt)

        const completion = await this.getClient().chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are an expert question generator. Your task is to create high-quality educational questions based on the provided content or instructions. Follow these rules:

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
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })

        const response = completion.choices[0]?.message?.content
        if (!response) {
          console.error('No response from OpenAI')
          throw new AIError('No response received from OpenAI', undefined, true)
        }

        console.log('Raw response from OpenAI:', response)

        let parsedResponse
        try {
          const jsonMatch = response.match(/\{[\s\S]*\}/)
          const jsonStr = jsonMatch ? jsonMatch[0] : response
          parsedResponse = JSON.parse(jsonStr)
        } catch (error) {
          console.error('Failed to parse OpenAI response:', error)
          console.error('Raw response:', response)
          throw new AIError(
            'Failed to parse response from OpenAI - invalid JSON format',
            error as Error,
            true
          )
        }

        if (!parsedResponse?.questions || !Array.isArray(parsedResponse.questions)) {
          console.error('Invalid response format from OpenAI:', parsedResponse)
          throw new AIError(
            'Invalid response format from OpenAI - missing questions array',
            undefined,
            true
          )
        }

        // Validate each question
        const validQuestions = parsedResponse.questions.filter(q => {
          const isValid = 
            typeof q.question === 'string' &&
            typeof q.answer === 'string' &&
            typeof q.type === 'string' &&
            (!q.explanation || typeof q.explanation === 'string') &&
            (!q.options || Array.isArray(q.options))
          
          if (!isValid) {
            console.warn('Skipping invalid question:', q)
          }
          return isValid
        })

        if (validQuestions.length === 0) {
          throw new AIError(
            'No valid questions in OpenAI response',
            undefined,
            true
          )
        }

        questions.push(...validQuestions)

        if (onProgress) {
          const progress = Math.min(
            ((batch + 1) * batchSize / context.numberOfQuestions) * 100,
            100
          )
          onProgress(progress)
        }
      } catch (error) {
        console.error('Error generating questions:', error)
        if (error instanceof AIError) throw error
        throw new AIError(
          'Failed to generate questions: ' + (error instanceof Error ? error.message : String(error)),
          error instanceof Error ? error : undefined,
          true
        )
      }
    }

    return questions
  }

  private createPrompt(context: GenerationContext, numQuestions: number): string {
    const { documentContent, customPrompt, questionTypes, difficulty } = context
    
    let prompt = 'Please generate '
    if (numQuestions > 1) {
      prompt += `${numQuestions} questions `
    } else {
      prompt += 'one question '
    }
    
    prompt += `with difficulty level "${difficulty}". `
    
    if (questionTypes.length === 1) {
      prompt += `The question should be of type: ${questionTypes[0]}. `
    } else {
      prompt += `The questions should be of these types: ${questionTypes.join(', ')}. `
    }
    
    if (documentContent) {
      prompt += '\n\nHere is the content to base the questions on:\n\n'
      prompt += documentContent
    } else if (customPrompt) {
      prompt += '\n\nHere are the specific instructions for the questions:\n\n'
      prompt += customPrompt
    }
    
    prompt += '\n\nPlease ensure your response follows the exact JSON format specified.'
    
    return prompt
  }
}
