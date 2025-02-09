import { describe, expect, test, jest } from '@jest/globals';
import generateQuestions from '../../anthropic';
import { Question_v2414 } from '../../anthropic';

type MessageContent = {
  type: 'text';
  text: string;
};

type Message = {
  id: string;
  type: string;
  role: string;
  content: MessageContent[];
  model: string;
  stop_reason: string | null;
  stop_sequence: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
};

describe('AI Question Generation', () => {
  const mockQuestion: Question_v2414 = {
    questionText_v2414: 'Test question?',
    type_v2414: 'multiple_choice',
    options_v2414: ['A) One', 'B) Two', 'C) Three', 'D) Four'],
    correctOption_v2414: 'A',
    explanation_v2414: 'Test explanation'
  };

  const mockResponse: Message = {
    id: 'msg_123',
    type: 'message',
    role: 'assistant',
    content: [{
      type: 'text',
      text: JSON.stringify([mockQuestion])
    }],
    model: 'claude-2',
    stop_reason: null,
    stop_sequence: null,
    usage: { input_tokens: 100, output_tokens: 200 }
  };

  const testDocument = {
    title: 'Test Document',
    content: 'Test content'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should generate questions successfully', async () => {
    const mockFetch = jest.fn().mockImplementation(async () => ({
      ok: true,
      json: () => Promise.resolve(mockResponse),
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      body: null,
      bodyUsed: false,
      url: '',
      type: 'default',
      redirected: false,
      clone: () => ({} as Response),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
      text: () => Promise.resolve('')
    }));
    global.fetch = mockFetch as unknown as typeof global.fetch;

    const result = await generateQuestions({
      documents: [testDocument],
      numberOfQuestions: 1,
      questionTypes: ['multiple_choice'],
      difficulty: 'medium'
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(mockQuestion);
  });

  test('should handle API error', async () => {
    const mockError = new Error('API Error') as Error & { cause?: { retryable: boolean } };
    mockError.cause = { retryable: true };
    const mockFetch = jest.fn().mockImplementation(async () => {
      throw mockError;
    });
    global.fetch = mockFetch as unknown as typeof global.fetch;

    await expect(generateQuestions({
      documents: [testDocument],
      numberOfQuestions: 1,
      questionTypes: ['multiple_choice'],
      difficulty: 'medium'
    })).rejects.toThrow('API Error');
  });

  test('should handle non-200 response', async () => {
    const mockFetch = jest.fn().mockImplementation(async () => ({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      headers: new Headers(),
      body: null,
      bodyUsed: false,
      url: '',
      type: 'default',
      redirected: false,
      json: () => Promise.resolve({}),
      clone: () => ({} as Response),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
      text: () => Promise.resolve('')
    }));
    global.fetch = mockFetch as unknown as typeof global.fetch;

    await expect(generateQuestions({
      documents: [testDocument],
      numberOfQuestions: 1,
      questionTypes: ['multiple_choice'],
      difficulty: 'medium'
    })).rejects.toThrow('500 Internal Server Error');
  });

  test('should handle invalid JSON response', async () => {
    const invalidResponse: Message = {
      id: 'msg_123',
      type: 'message',
      role: 'assistant',
      content: [{
        type: 'text',
        text: 'Invalid JSON'
      }],
      model: 'claude-2',
      stop_reason: null,
      stop_sequence: null,
      usage: { input_tokens: 100, output_tokens: 200 }
    };

    const mockFetch = jest.fn().mockImplementation(async () => ({
      ok: true,
      json: () => Promise.resolve(invalidResponse),
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      body: null,
      bodyUsed: false,
      url: '',
      type: 'default',
      redirected: false,
      clone: () => ({} as Response),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
      text: () => Promise.resolve('')
    }));
    global.fetch = mockFetch as unknown as typeof global.fetch;

    await expect(generateQuestions({
      documents: [testDocument],
      numberOfQuestions: 1,
      questionTypes: ['multiple_choice'],
      difficulty: 'medium'
    })).rejects.toThrow();
  });
});
