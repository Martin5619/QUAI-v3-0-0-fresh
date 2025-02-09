import { readFile } from 'fs/promises'
import { Document as DocxDocument } from 'docx'
import pdfParse from 'pdf-parse'

export async function extractText(filePath: string, fileType: string): Promise<string> {
  const buffer = await readFile(filePath)

  switch (fileType) {
    case 'application/pdf':
      try {
        console.log('[PDF_v2414] Starting PDF extraction:', filePath)
        const pdfData = await pdfParse(buffer, {
          version: 'v2.0.550',
          max: 50, // Maximum number of pages to parse
          pagerender: function(pageData: any) {
            // More reliable text extraction
            return pageData.getTextContent({
              normalizeWhitespace: true,
              disableCombineTextItems: false,
              includeMarkedContent: true
            }).then(function(text: any) {
              return text.items.map((item: any) => item.str).join(' ')
            })
          }
        })

        if (!pdfData || !pdfData.text) {
          console.error('[PDF_v2414] No text extracted from PDF')
          throw new Error('no_content_extracted_v2414')
        }

        console.log('[PDF_v2414] Raw text length:', pdfData.text.length)
        
        // Clean the text
        const cleanText = pdfData.text
          .replace(/^.*(Created|Creator|Producer|Title|Author|Subject|Keywords|ModDate|CreationDate|PDF Producer).*$/gm, '')
          .replace(/^\s*[\r\n]/gm, '')
          .replace(/\s+/g, ' ')
          .trim()

        console.log('[PDF_v2414] Clean text length:', cleanText.length)
        
        if (!cleanText || cleanText.length < 100) {
          console.error('[PDF_v2414] Insufficient clean text:', cleanText.length)
          throw new Error('insufficient_content_v2414')
        }
        
        return cleanText
      } catch (error: any) {
        console.error('[PDF_v2414] Error extracting text:', {
          error: error.message,
          stack: error.stack,
          filePath
        })
        throw new Error(`pdf_extraction_failed_v2414: ${error.message}`)
      }

    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      const doc = new DocxDocument(buffer)
      return (await doc.getText()).trim()

    case 'text/plain':
      return buffer.toString('utf-8').trim()

    default:
      throw new Error('unsupported_file_type_v2414')
  }
}

interface QuestionType {
  type: 'multiple-choice' | 'true-false' | 'open-ended'
  question: string
  answer: string
  options?: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  topic?: string
}

export async function generateQuestions(
  text: string,
  numQuestions: number = 5,
  types: ('multiple-choice' | 'true-false' | 'open-ended')[] = ['multiple-choice'],
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<QuestionType[]> {
  const maxLength = 12000 
  const truncatedText = text.length > maxLength 
    ? text.slice(0, maxLength) + '...'
    : text

  const prompt = `
    Generate ${numQuestions} ${difficulty} questions based on the following text. 
    For each question, provide:
    1. The question text
    2. The correct answer
    3. For multiple choice questions, provide 4 options (including the correct answer)
    4. A relevant topic or subject area

    Format the response as a JSON array with the following structure:
    [
      {
        "type": "multiple-choice",
        "question": "Question text",
        "answer": "Correct answer",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "difficulty": "${difficulty}",
        "topic": "Topic"
      }
    ]

    Text to generate questions from:
    ${truncatedText}
  `

  try {
    const Anthropic = require('@anthropic-ai/sdk')
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const response = message.content[0].text
    const questions = JSON.parse(response) as QuestionType[]

    return questions.map(q => ({
      type: q.type,
      question: q.question.trim(),
      answer: q.answer.trim(),
      options: q.options?.map(o => o.trim()),
      difficulty: q.difficulty,
      topic: q.topic?.trim()
    }))
  } catch (error) {
    console.error('Error generating questions:', error)
    throw new Error('Failed to generate questions')
  }
}
