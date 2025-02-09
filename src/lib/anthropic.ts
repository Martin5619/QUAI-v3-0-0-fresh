import { Anthropic } from '@anthropic-ai/sdk';
import { prisma } from './prisma';
import { RateLimiter } from 'limiter';

// Constants
const MODEL = 'claude-2';
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_TIMEOUT_MS = 30000;
const LARGE_CONTENT_THRESHOLD = 50000;

// Types
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

export interface Question_v2414 {
  questionText_v2414: string;
  type_v2414: QuestionType;
  options_v2414: string[];
  correctOption_v2414: string;
  explanation_v2414: string;
}

export interface GenerateQuestionsParams {
  documents: Array<{
    title: string;
    content: string;
  }>;
  questionTypes?: QuestionType[];
  difficulty?: 'easy' | 'medium' | 'hard';
  numberOfQuestions?: number;
  customPrompt?: string;
  guidance?: string;
}

interface RawQuestion {
  questionText_v2414: string;
  type_v2414?: QuestionType;
  options_v2414: string | string[];
  correctOption_v2414: string;
  explanation_v2414?: string;
}

interface ContentBlock {
  type: string;
  text?: string;
}

// Error types
export class AnthropicError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AnthropicError';
  }
}

// Rate limiter configuration
const rateLimiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: 'minute',
});

const largeContentLimiter = new RateLimiter({
  tokensPerInterval: 2,
  interval: 'minute',
});

// Initialize Anthropic client
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey && process.env.NODE_ENV !== 'test') {
  throw new AnthropicError('Anthropic API key is missing', 'anthropic_key_missing_v2414');
}

const anthropicClient = new Anthropic({
  apiKey: apiKey || 'test-key',
  maxRetries: process.env.AI_MAX_RETRIES ? parseInt(process.env.AI_MAX_RETRIES) : DEFAULT_MAX_RETRIES,
  timeout: process.env.AI_TIMEOUT_MS ? parseInt(process.env.AI_TIMEOUT_MS) : DEFAULT_TIMEOUT_MS
});

function cleanContent(content: string): string {
  console.log('[Anthropic_v2414] Cleaning content...');
  
  // Basic content cleaning
  content = content
    // Remove non-printable characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
    // Convert Windows line endings to Unix
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Normalize whitespace
    .replace(/\t/g, ' ')
    .replace(/ +/g, ' ')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
  
  console.log('[Anthropic_v2414] Content cleaned. Length:', content.length);
  return content;
}

function validateQuestion(question: RawQuestion): boolean {
  try {
    // Check required fields exist
    if (!question.questionText_v2414 || !question.options_v2414 || !question.correctOption_v2414) {
      console.log('[Anthropic_v2414] Missing required fields:', question);
      return false;
    }

    // Validate question text
    const questionText = question.questionText_v2414.trim();
    if (questionText.length < 10) {
      console.log('[Anthropic_v2414] Question text too short:', questionText);
      return false;
    }

    // Validate options format
    const options = Array.isArray(question.options_v2414) 
      ? question.options_v2414.join('\n')
      : question.options_v2414;

    if (typeof options !== 'string') {
      console.log('[Anthropic_v2414] Options not a string:', options);
      return false;
    }

    // Split options and check format
    const optionLines = options.split(/\n|\r\n/).filter(line => line.trim());
    if (optionLines.length !== 4) {
      console.log('[Anthropic_v2414] Wrong number of options:', optionLines.length);
      return false;
    }

    const optionLabels = ['A)', 'B)', 'C)', 'D)'];
    for (let i = 0; i < optionLines.length; i++) {
      const line = optionLines[i].trim();
      if (!line.startsWith(optionLabels[i])) {
        console.log('[Anthropic_v2414] Invalid option format:', line);
        return false;
      }
      if (line.length < 4) {
        console.log('[Anthropic_v2414] Option too short:', line);
        return false;
      }
    }

    // Validate correct option
    const correctOption = question.correctOption_v2414.trim().toUpperCase();
    if (!['A', 'B', 'C', 'D'].includes(correctOption)) {
      console.log('[Anthropic_v2414] Invalid correct option:', correctOption);
      return false;
    }

    // Validate explanation
    const explanation = question.explanation_v2414?.trim() || '';
    if (explanation.length < 10) {
      console.log('[Anthropic_v2414] Explanation too short:', explanation);
      return false;
    }

    return true;
  } catch (e) {
    console.log('[Anthropic_v2414] Validation error:', e);
    return false;
  }
}

function generateSystemMessage(params: GenerateQuestionsParams): string {
  return `You are an expert at generating multiple choice questions. Your task is to generate questions that test understanding of key concepts from the provided content.

You MUST ALWAYS respond with ONLY a JSON array in this EXACT format, with NO additional text or explanations:

[{
  "questionText_v2414": "What is the main concept discussed?",
  "type_v2414": "multiple_choice",
  "options_v2414": [
    "A) First option",
    "B) Second option", 
    "C) Third option",
    "D) Fourth option"
  ],
  "correctOption_v2414": "A",
  "explanation_v2414": "Explanation of why A is correct"
}]

CRITICAL RULES:
1. ONLY output a JSON array - NO other text before or after
2. Use EXACTLY these field names with _v2414 suffix
3. Format options EXACTLY as "A) text", "B) text", etc.
4. correctOption_v2414 must be EXACTLY one letter: A, B, C, or D
5. Base questions on the actual content provided
6. Make all options plausible but clearly distinct
7. Provide clear, concise explanations

If you cannot generate questions from the content, still respond with a valid JSON array, but include a message in the questionText_v2414 explaining why.`;
}

function generatePrompt(params: GenerateQuestionsParams): string {
  const { documents, questionTypes = ['multiple_choice'], difficulty = 'medium', numberOfQuestions = 3 } = params;

  const contentSections = documents.map(doc => 
    doc.title ? `Title: ${doc.title}\n\nContent:\n${doc.content}` : doc.content
  ).join('\n\n---\n\n');

  return `Generate ${numberOfQuestions} ${difficulty} difficulty multiple choice questions based on this content. Remember to ONLY respond with the JSON array, no other text:

${contentSections}

${params.customPrompt || ''}
${params.guidance ? `Additional guidance: ${params.guidance}` : ''}`;
}

function extractJSONFromText(text: string): Question_v2414[] {
  try {
    console.log('[Anthropic_v2414] Raw response:', text);
    
    // First try direct parse
    try {
      const directParse = JSON.parse(text.trim()) as RawQuestion[];
      if (Array.isArray(directParse)) {
        return processQuestions(directParse);
      }
    } catch (e) {
      console.log('[Anthropic_v2414] Direct parse failed, trying regex');
    }

    // Try to find JSON array using regex
    const jsonPattern = /\[\s*\{[\s\S]*?\}\s*\]/g;
    const matches = text.match(jsonPattern);
    
    if (!matches || matches.length === 0) {
      throw new AnthropicError('No JSON array found in response', 'no_json_array_found_v2414');
    }

    // Try each match until we find valid JSON
    for (const match of matches) {
      try {
        const questions = JSON.parse(match) as RawQuestion[];
        if (Array.isArray(questions)) {
          return processQuestions(questions);
        }
      } catch (e) {
        console.log('[Anthropic_v2414] Failed to parse match:', match);
        continue;
      }
    }

    throw new AnthropicError('No valid JSON array found', 'no_valid_json_found_v2414');
  } catch (error: unknown) {
    console.error('[Anthropic_v2414] Error extracting JSON:', error);
    if (error instanceof AnthropicError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new AnthropicError(error.message, 'json_extraction_failed_v2414');
    }
    throw new AnthropicError('Failed to extract JSON from response', 'json_extraction_failed_v2414');
  }
}

function processQuestions(questions: RawQuestion[]): Question_v2414[] {
  return questions.map((q: RawQuestion) => {
    // Validate required fields
    if (!q.questionText_v2414 || !q.options_v2414 || !q.correctOption_v2414) {
      throw new AnthropicError('Missing required fields in question', 'missing_required_fields_v2414');
    }

    // Ensure options is an array
    let options: string[] = Array.isArray(q.options_v2414) 
      ? q.options_v2414 
      : q.options_v2414.split(/\n|\r\n/).filter(line => line.trim());

    // Add option prefixes if missing
    options = options.map((opt: string, idx: number) => {
      const prefix = String.fromCharCode(65 + idx) + ')';
      return opt.trim().startsWith(prefix) ? opt.trim() : `${prefix} ${opt.trim()}`;
    });

    // Clean up correct option
    const correctOption = q.correctOption_v2414.trim().replace(/^([A-D])\)?\s*$/, '$1');
    if (!/^[A-D]$/.test(correctOption)) {
      throw new AnthropicError('Invalid correct option format', 'invalid_correct_option_v2414');
    }

    return {
      questionText_v2414: q.questionText_v2414.trim(),
      type_v2414: q.type_v2414 || 'multiple_choice',
      options_v2414: options,
      correctOption_v2414: correctOption,
      explanation_v2414: q.explanation_v2414?.trim() || 'No explanation provided'
    };
  });
}

async function generateQuestions(params: GenerateQuestionsParams): Promise<Question_v2414[]> {
  try {
    console.log('[Anthropic_v2414] Starting question generation');
    
    // Check rate limit
    const rateLimitResult = await rateLimiter.tryRemoveTokens(1);
    if (!rateLimitResult) {
      throw new AnthropicError('Rate limit exceeded', 'rate_limit_exceeded_v2414');
    }

    // Validate input
    if (!params.documents || params.documents.length === 0) {
      throw new AnthropicError('No documents provided', 'no_documents_v2414');
    }

    // Calculate total content size
    const totalContentSize = params.documents.reduce((acc, doc) => acc + doc.content.length, 0);
    console.log('[Anthropic_v2414] Total content size:', totalContentSize);

    if (totalContentSize < 100) {
      throw new AnthropicError('Insufficient content for question generation', 'insufficient_content_v2414');
    }

    // Apply size-based rate limiting
    if (totalContentSize > LARGE_CONTENT_THRESHOLD) {
      const sizeLimitResult = await largeContentLimiter.tryRemoveTokens(1);
      if (!sizeLimitResult) {
        throw new AnthropicError('Large content rate limit exceeded', 'rate_limit_exceeded_v2414');
      }
    }

    // Clean content
    const cleanedDocuments = params.documents.map(doc => ({
      ...doc,
      content: cleanContent(doc.content)
    }));

    // Validate cleaned content
    const totalCleanedSize = cleanedDocuments.reduce((acc, doc) => acc + doc.content.length, 0);
    if (totalCleanedSize < 100) {
      throw new AnthropicError('Content too short after cleaning', 'insufficient_content_v2414');
    }

    // Generate system message and prompt
    const systemMessage = generateSystemMessage(params);
    const prompt = generatePrompt({ ...params, documents: cleanedDocuments });

    console.log('[Anthropic_v2414] System message:', systemMessage);
    console.log('[Anthropic_v2414] Prompt:', prompt);

    // Send request to API
    const response = await anthropicClient.messages.create({
      model: MODEL,
      max_tokens: 4096,
      temperature: 0.2,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      system: systemMessage
    });

    console.log('[Anthropic_v2414] Raw response:', response);

    // Extract and validate questions
    if (!response.content || !Array.isArray(response.content)) {
      throw new AnthropicError('Invalid response format from API', 'invalid_response_format_v2414');
    }

    // Get text content from response
    const textContent = response.content
      .map(block => typeof block === 'string' ? block : block.text)
      .filter(Boolean)
      .join('');

    if (!textContent) {
      throw new AnthropicError('No content in response', 'no_content_v2414');
    }

    console.log('[Anthropic_v2414] Extracted text content:', textContent);

    const questions = extractJSONFromText(textContent);
    if (questions.length === 0) {
      throw new AnthropicError('No questions were generated', 'no_questions_generated_v2414');
    }

    // Validate question count
    if (questions.length < (params.numberOfQuestions || 3)) {
      throw new AnthropicError('Not enough questions generated', 'insufficient_questions_v2414');
    }

    console.log('[Anthropic_v2414] Generated questions:', questions);
    return questions;
  } catch (error: unknown) {
    console.error('[Anthropic_v2414] Error:', error);
    if (error instanceof AnthropicError) {
      throw error;
    }
    throw new AnthropicError('Failed to generate questions', 'question_generation_failed_v2414');
  }
}

export { extractJSONFromText, cleanContent };

export default generateQuestions;
