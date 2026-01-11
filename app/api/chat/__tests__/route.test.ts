import { GoogleGenAI } from '@google/genai';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import makeNextServerMock from '../../../../test-helper/nextServer.mock';
import { POST } from '../route';

jest.mock('next/server', () => makeNextServerMock());

// Mock dependencies
jest.mock('next-auth/jwt');
jest.mock('@google/genai');

const mockGetToken = getToken as jest.MockedFunction<typeof getToken>;

describe('/api/chat', () => {
  const mockToken = { sub: 'user-123' };
  const mockApiKey = 'test-api-key';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GEMINI_API_KEY = mockApiKey;
    process.env.NEXTAUTH_SECRET = 'test-secret';

    // Setup default mocks
    mockGetToken.mockResolvedValue(mockToken as never);

    // Reset GoogleGenAI mock
    const MockedGoogleGenAI = GoogleGenAI as jest.MockedClass<typeof GoogleGenAI>;
    MockedGoogleGenAI.mockClear();
  });

  afterEach(() => {
    delete process.env.GEMINI_API_KEY;
  });

  const createMockRequest = (body: unknown): NextRequest =>
    ({
      json: async () => body,
      method: 'POST',
    }) as unknown as NextRequest;

  describe('POST', () => {
    test('returns response when API call is successful', async () => {
      const mockResponseText = 'Hello! How can I help you?';
      const mockGenerateContent = jest.fn().mockResolvedValue({
        text: mockResponseText,
      });

      const MockedGoogleGenAI = GoogleGenAI as jest.MockedClass<typeof GoogleGenAI>;
      const mockInstance = {
        models: {
          generateContent: mockGenerateContent,
        },
      };
      MockedGoogleGenAI.mockImplementation(() => mockInstance as unknown as GoogleGenAI);

      const request = createMockRequest({
        message: 'Hello',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ response: mockResponseText });
      expect(mockGenerateContent).toHaveBeenCalledWith({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            role: 'user',
            parts: [{ text: 'Hello' }],
          },
        ],
      });
    });

    test('includes conversation history when provided', async () => {
      const mockResponseText = 'I remember our conversation!';
      const mockGenerateContent = jest.fn().mockResolvedValue({
        text: mockResponseText,
      });

      const MockedGoogleGenAI = GoogleGenAI as jest.MockedClass<typeof GoogleGenAI>;
      const mockInstance = {
        models: {
          generateContent: mockGenerateContent,
        },
      };
      MockedGoogleGenAI.mockImplementation(() => mockInstance as unknown as GoogleGenAI);

      const request = createMockRequest({
        message: 'What did we talk about?',
        history: [
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi there!' },
        ],
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ response: mockResponseText });
      expect(mockGenerateContent).toHaveBeenCalledWith({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            role: 'user',
            parts: [{ text: 'Hello' }],
          },
          {
            role: 'model',
            parts: [{ text: 'Hi there!' }],
          },
          {
            role: 'user',
            parts: [{ text: 'What did we talk about?' }],
          },
        ],
      });
    });

    test('returns unauthorized when token is missing', async () => {
      mockGetToken.mockResolvedValue(null);

      const request = createMockRequest({
        message: 'Hello',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ message: 'Unauthorized' });
    });

    test('returns error when API key is not configured', async () => {
      delete process.env.GEMINI_API_KEY;

      const request = createMockRequest({
        message: 'Hello',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ message: 'Gemini API key is not configured' });
    });

    test('returns error when message is missing', async () => {
      const request = createMockRequest({});

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBeDefined();
      // Zod returns "Required" when field is missing, "Message is required" when empty
      expect(data.message).toMatch(/Required|Message is required/);
    });

    test('returns error when message is empty', async () => {
      const request = createMockRequest({
        message: '',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toContain('Message is required');
    });

    test('returns error when message exceeds max length', async () => {
      const longMessage = 'a'.repeat(5001);

      const request = createMockRequest({
        message: longMessage,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBeDefined();
    });

    test('returns error when history contains invalid role', async () => {
      const request = createMockRequest({
        message: 'Hello',
        history: [{ role: 'invalid-role', content: 'Test' }],
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBeDefined();
    });

    test('returns error when history message content is empty', async () => {
      const request = createMockRequest({
        message: 'Hello',
        history: [{ role: 'user', content: '' }],
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBeDefined();
    });

    test('returns error when Gemini API throws an error', async () => {
      const mockGenerateContent = jest.fn().mockRejectedValue(new Error('API Error'));

      const MockedGoogleGenAI = GoogleGenAI as jest.MockedClass<typeof GoogleGenAI>;
      const mockInstance = {
        models: {
          generateContent: mockGenerateContent,
        },
      };
      MockedGoogleGenAI.mockImplementation(() => mockInstance as unknown as GoogleGenAI);

      const request = createMockRequest({
        message: 'Hello',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ message: 'Oops! Something went wrong :(' });
    });

    test('returns default message when API response has no text', async () => {
      const mockGenerateContent = jest.fn().mockResolvedValue({
        text: undefined,
      });

      const MockedGoogleGenAI = GoogleGenAI as jest.MockedClass<typeof GoogleGenAI>;
      const mockInstance = {
        models: {
          generateContent: mockGenerateContent,
        },
      };
      MockedGoogleGenAI.mockImplementation(() => mockInstance as unknown as GoogleGenAI);

      const request = createMockRequest({
        message: 'Hello',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        response: 'Sorry, I could not generate a response.',
      });
    });
  });
});
