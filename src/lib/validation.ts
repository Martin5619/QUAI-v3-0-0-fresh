export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface QuestionFormData {
  title: string
  customPrompt?: string
  questionTypes: string[]
  difficulty: string
  numberOfQuestions: number
  documentId?: string
}

export function validateQuestionForm(data: QuestionFormData): ValidationResult {
  const errors: string[] = []

  // Title validation
  if (!data.title.trim()) {
    errors.push('Title is required')
  } else if (data.title.length > 100) {
    errors.push('Title must be less than 100 characters')
  }

  // Question types validation
  if (!data.questionTypes.length) {
    errors.push('At least one question type must be selected')
  }

  // Number of questions validation
  if (data.numberOfQuestions < 1 || data.numberOfQuestions > 50) {
    errors.push('Number of questions must be between 1 and 50')
  }

  // Custom prompt validation
  if (data.customPrompt) {
    if (data.customPrompt.length > 500) {
      errors.push('Custom prompt must be less than 500 characters')
    }
  }

  // Document validation
  if (!data.documentId && !data.customPrompt?.trim()) {
    errors.push('Either a document or custom prompt is required')
  }

  // Difficulty validation
  const validDifficulties = ['easy', 'medium', 'hard']
  if (!validDifficulties.includes(data.difficulty)) {
    errors.push('Invalid difficulty level selected')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateCustomPrompt(prompt: string): ValidationResult {
  const errors: string[] = []
  
  if (prompt.trim().length === 0) {
    errors.push('Custom prompt cannot be empty')
  }
  
  if (prompt.length > 500) {
    errors.push('Custom prompt must be less than 500 characters')
  }
  
  // Check for potential harmful content
  const harmfulPatterns = [
    /DROP\s+TABLE/i,
    /DELETE\s+FROM/i,
    /<script/i,
    /javascript:/i
  ]
  
  for (const pattern of harmfulPatterns) {
    if (pattern.test(prompt)) {
      errors.push('Custom prompt contains invalid content')
      break
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function getCharacterCount(text: string): number {
  return text.trim().length
}

export function getRemainingCharacters(text: string, limit: number): number {
  return limit - getCharacterCount(text)
}
