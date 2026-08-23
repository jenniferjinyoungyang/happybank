import { NextRequest } from 'next/server';
import * as z from 'zod';
import makeNextServerMock from '../../../../test-helper/nextServer.mock';

jest.mock('next/server', () => makeNextServerMock());
// Provide manual mocks using doMock (not hoisted) so we can reference variables safely
const mockGetToken = jest.fn();
const mockGoogleGenAI = jest.fn();
const actualZod = jest.requireActual('zod');
let chatRequestSchemaInstance: z.ZodType;
jest.doMock('zod', () => ({
  __esModule: true,
  ...actualZod,
  object: (shape: Parameters<typeof actualZod.object>[0]) => {
    const schema = actualZod.object(shape);
    const shapeObj = shape as Record<string, unknown>;
    if (shapeObj && shapeObj.message) {
      chatRequestSchemaInstance = schema;
    }
    return schema;
  },
}));
jest.doMock('@google/genai', () => ({
  __esModule: true,
  GoogleGenAI: mockGoogleGenAI,
  default: mockGoogleGenAI,
}));
jest.doMock('next-auth/jwt', () => ({
  getToken: mockGetToken,
}));

// Import the route after mocks are configured so the module imports use the mocks
// Using dynamic import to ensure mocks are applied before module loads
let POST: typeof import('../route').POST;
beforeAll(async () => {
  const routeModule = await import('../route');
  POST = routeModule.POST;
});

describe('/api/chat', () => {
  const mockToken = { sub: 'user-123' };
  const mockApiKey = 'test-api-key';
  // `mockGoogleGenAI` is declared above and configured in tests

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GEMINI_API_KEY = mockApiKey;
    process.env.NEXTAUTH_SECRET = 'test-secret';

    // Setup default mocks
    mockGetToken.mockResolvedValue(mockToken as never);

    // Reset GoogleGenAI mock implementation (re-use the top-level mock reference)
    mockGoogleGenAI.mockImplementation(() => ({
      models: {
        generateContent: jest.fn(),
      },
    }));
    mockGoogleGenAI.mockClear();
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

      mockGoogleGenAI.mockImplementation(() => ({
        models: {
          generateContent: mockGenerateContent,
        },
      }));
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

      mockGoogleGenAI.mockImplementation(() => ({
        models: {
          generateContent: mockGenerateContent,
        },
      }));

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
      // Zod v4 returns different error format - check for validation error indicators
      expect(data.message).toMatch(/Required|Message is required|Invalid input|expected string/);
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

      mockGoogleGenAI.mockImplementation(() => ({
        models: {
          generateContent: mockGenerateContent,
        },
      }));

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

      mockGoogleGenAI.mockImplementation(() => ({
        models: {
          generateContent: mockGenerateContent,
        },
      }));

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

    test('returns detailed error message and logs error when Gemini API throws and NODE_ENV is development', async () => {
      const originalNodeEnv = process.env.NODE_ENV;
      (process.env as Record<string, string | undefined>).NODE_ENV = 'development';
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const mockGenerateContent = jest.fn().mockRejectedValue(new Error('API Connection Timeout'));
      mockGoogleGenAI.mockImplementation(() => ({
        models: {
          generateContent: mockGenerateContent,
        },
      }));

      const request = createMockRequest({
        message: 'Hello',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ message: 'API Connection Timeout' });
      expect(consoleSpy).toHaveBeenCalledWith('Error calling Gemini API:', expect.any(Error));

      consoleSpy.mockRestore();
      (process.env as Record<string, string | undefined>).NODE_ENV = originalNodeEnv;
    });

    test('returns fallback error message when ZodError has no issues', async () => {
      const originalParse = chatRequestSchemaInstance.parse;
      chatRequestSchemaInstance.parse = jest.fn(() => {
        throw new z.ZodError([]);
      });

      const request = createMockRequest({
        message: 'Hello',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ message: 'Invalid request format' });

      chatRequestSchemaInstance.parse = originalParse;
    });
  });
});
