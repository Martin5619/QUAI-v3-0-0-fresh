import { QuestionType } from '@prisma/client'

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

export interface AIProvider {
  generateQuestions(
    context: GenerationContext,
    onProgress?: (progress: number) => void
  ): Promise<GeneratedQuestion[]>
}
