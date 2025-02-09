/**
 * @jest-environment node
 */

import { extractJSONFromText, cleanContent } from '../anthropic';
import { AnthropicError } from '../anthropic';
import type { Question_v2414 } from '../anthropic';

jest.mock('@anthropic-ai/sdk');
jest.mock('../prisma');
jest.mock('limiter');

describe('Anthropic Question Generation', () => {
  describe('cleanContent', () => {
    it('should clean and normalize content', () => {
      const input = `Here is some text\r\nwith Windows\rline endings\t\tand tabs
      
      and multiple

      line breaks`;
      
      const expected = 'Here is some text\nwith Windows\nline endings and tabs\n\nand multiple\n\nline breaks';
      const result = cleanContent(input);
      expect(result).toBe(expected);
    });

    it('should remove non-printable characters', () => {
      const input = 'Text with\x00\x01\x02non-printable\x1F\x7Fchars';
      const expected = 'Text with non-printable chars';
      const result = cleanContent(input);
      expect(result).toBe(expected);
    });
  });

  describe('extractJSONFromText', () => {
    it('should extract and validate valid questions', () => {
      const input = `Here's some text before
      [
        {
          "questionText_v2414": "What is the main concept discussed?",
          "type_v2414": "multiple_choice",
          "options_v2414": [
            "A) First option",
            "B) Second option",
            "C) Third option",
            "D) Fourth option"
          ],
          "correctOption_v2414": "A",
          "explanation_v2414": "First option is correct because..."
        }
      ]
      and some text after`;

      const result = extractJSONFromText(input);
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        questionText_v2414: "What is the main concept discussed?",
        type_v2414: "multiple_choice",
        options_v2414: [
          "A) First option",
          "B) Second option",
          "C) Third option",
          "D) Fourth option"
        ],
        correctOption_v2414: "A",
        explanation_v2414: "First option is correct because..."
      });
    });

    it('should handle string options format', () => {
      const input = `[{
        "questionText_v2414": "Test question?",
        "type_v2414": "multiple_choice",
        "options_v2414": "A) One\\nB) Two\\nC) Three\\nD) Four",
        "correctOption_v2414": "B",
        "explanation_v2414": "Two is correct because..."
      }]`;

      const result = extractJSONFromText(input);
      expect(result).toHaveLength(1);
      expect(result[0].options_v2414).toEqual([
        "A) One",
        "B) Two",
        "C) Three",
        "D) Four"
      ]);
    });

    it('should add option prefixes if missing', () => {
      const input = `[{
        "questionText_v2414": "Test question?",
        "type_v2414": "multiple_choice",
        "options_v2414": ["One", "Two", "Three", "Four"],
        "correctOption_v2414": "B",
        "explanation_v2414": "Two is correct because..."
      }]`;

      const result = extractJSONFromText(input);
      expect(result).toHaveLength(1);
      expect(result[0].options_v2414).toEqual([
        "A) One",
        "B) Two",
        "C) Three",
        "D) Four"
      ]);
    });

    it('should throw AnthropicError for invalid JSON', () => {
      const input = 'Not a JSON array';
      
      let error: AnthropicError | null = null;
      try {
        extractJSONFromText(input);
      } catch (e) {
        error = e as AnthropicError;
      }
      expect(error).toBeInstanceOf(AnthropicError);
      expect(error?.code).toBe('no_json_array_found_v2414');
    });

    it('should throw AnthropicError for missing required fields', () => {
      const input = '[{"questionText_v2414": "Test?"}]';
      
      let error: AnthropicError | null = null;
      try {
        extractJSONFromText(input);
      } catch (e) {
        error = e as AnthropicError;
      }
      expect(error).toBeInstanceOf(AnthropicError);
      expect(error?.code).toBe('missing_required_fields_v2414');
    });

    it('should throw AnthropicError for invalid correct option', () => {
      const input = `[{
        "questionText_v2414": "Test question?",
        "type_v2414": "multiple_choice",
        "options_v2414": ["A) One", "B) Two", "C) Three", "D) Four"],
        "correctOption_v2414": "E",
        "explanation_v2414": "Invalid option"
      }]`;
      
      let error: AnthropicError | null = null;
      try {
        extractJSONFromText(input);
      } catch (e) {
        error = e as AnthropicError;
      }
      expect(error).toBeInstanceOf(AnthropicError);
      expect(error?.code).toBe('invalid_correct_option_v2414');
    });
  });
});
