import { NextRequest } from 'next/server';
import makeNextServerMock from '../../../../test-helper/nextServer.mock';

jest.mock('next/server', () => makeNextServerMock());

// Provide manual mocks using doMock (not hoisted) so we can reference variables safely
const mockGetToken = jest.fn();
jest.doMock('next-auth/jwt', () => ({
  getToken: mockGetToken,
}));

const mockFindAll = jest.fn();
const mockCreate = jest.fn();
jest.doMock('../memoriesDb', () => ({
  memoriesDb: {
    findAll: mockFindAll,
    create: mockCreate,
  },
}));

// Import the route after mocks are configured so the module imports use the mocks
// Using dynamic import to ensure mocks are applied before module loads
let GET: typeof import('../route').GET;
let POST: typeof import('../route').POST;
beforeAll(async () => {
  const routeModule = await import('../route');
  GET = routeModule.GET;
  POST = routeModule.POST;
});

describe('/api/memories', () => {
  const mockToken = { sub: 'user-123' };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXTAUTH_SECRET = 'test-secret';
    mockGetToken.mockResolvedValue(mockToken as never);
  });

  afterEach(() => {
    delete process.env.NEXTAUTH_SECRET;
  });

  const createMockRequest = (method: string = 'GET', body?: unknown): NextRequest =>
    ({
      json: async () => body,
      method,
    }) as unknown as NextRequest;

  describe('GET', () => {
    it('should return a random memory when memories exist', async () => {
      const mockMemories = [
        {
          createdAt: new Date('2024-01-01'),
          title: 'Memory 1',
          message: 'Message 1',
          hashtags: [],
          imageId: null,
        },
        {
          createdAt: new Date('2024-01-02'),
          title: 'Memory 2',
          message: 'Message 2',
          hashtags: [],
          imageId: null,
        },
      ];

      mockFindAll.mockResolvedValue(mockMemories);

      const request = createMockRequest();
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockFindAll).toHaveBeenCalledWith('user-123');
      expect(mockMemories).toContainEqual(data);
    });

    it('should return null when no memories exist', async () => {
      mockFindAll.mockResolvedValue([]);

      const request = createMockRequest();
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toBeNull();
      expect(mockFindAll).toHaveBeenCalledWith('user-123');
    });

    it('should return 401 when user is not authenticated', async () => {
      mockGetToken.mockResolvedValue(null);

      const request = createMockRequest();
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ message: 'Unauthorized' });
      expect(mockFindAll).not.toHaveBeenCalled();
    });

    it('should return 401 when token has no sub', async () => {
      mockGetToken.mockResolvedValue({} as never);

      const request = createMockRequest();
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ message: 'Unauthorized' });
      expect(mockFindAll).not.toHaveBeenCalled();
    });

    it('should return 500 when database error occurs', async () => {
      const mockError = new Error('Database connection failed');
      mockFindAll.mockRejectedValue(mockError);

      const request = createMockRequest();
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toContain('Oops! Something went wrong');
      expect(data.message).toContain('Database connection failed');
    });

    it('should return 500 when non-Error is thrown', async () => {
      mockFindAll.mockRejectedValue('String error');

      const request = createMockRequest();
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toContain('Oops! Something went wrong');
      expect(data.message).toContain('String error');
    });
  });

  describe('POST', () => {
    it('should return 405 when request method is not POST', async () => {
      const request = createMockRequest('GET', {
        title: 'Memory',
        message: 'Message',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(405);
      expect(data).toEqual({ message: 'Only POST requests are allowed' });
      expect(mockCreate).not.toHaveBeenCalled();
      expect(mockGetToken).not.toHaveBeenCalled();
    });

    it('should create a memory successfully', async () => {
      mockCreate.mockResolvedValue({ id: 1 } as never);

      const request = createMockRequest('POST', {
        title: 'New Memory',
        message: 'New message',
        hashtags: ['happy', 'memory'],
        imageId: 'image123',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual({ message: 'successfully created a new memory' });
      expect(mockCreate).toHaveBeenCalledWith('user-123', {
        title: 'New Memory',
        message: 'New message',
        hashtags: ['happy', 'memory'],
        imageId: 'image123',
      });
    });

    it('should create a memory with default empty hashtags', async () => {
      mockCreate.mockResolvedValue({ id: 1 } as never);

      const request = createMockRequest('POST', {
        title: 'Memory without hashtags',
        message: 'Message',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual({ message: 'successfully created a new memory' });
      expect(mockCreate).toHaveBeenCalledWith('user-123', {
        title: 'Memory without hashtags',
        message: 'Message',
        hashtags: [],
        imageId: null,
      });
    });

    it('should create a memory with null imageId when not provided', async () => {
      mockCreate.mockResolvedValue({ id: 1 } as never);

      const request = createMockRequest('POST', {
        title: 'Memory',
        message: 'Message',
        hashtags: ['happy'],
      });

      const response = await POST(request);

      expect(response.status).toBe(201);
      expect(mockCreate).toHaveBeenCalledWith('user-123', {
        title: 'Memory',
        message: 'Message',
        hashtags: ['happy'],
        imageId: null,
      });
    });

    it('should return 401 when user is not authenticated', async () => {
      mockGetToken.mockResolvedValue(null);

      const request = createMockRequest('POST', {
        title: 'Memory',
        message: 'Message',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ message: 'Unauthorized' });
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('should return 401 when token has no sub', async () => {
      mockGetToken.mockResolvedValue({} as never);

      const request = createMockRequest('POST', {
        title: 'Memory',
        message: 'Message',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ message: 'Unauthorized' });
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('should return 500 when database error occurs', async () => {
      mockCreate.mockRejectedValue(new Error('Database error'));

      const request = createMockRequest('POST', {
        title: 'Memory',
        message: 'Message',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ message: 'Oops! Something went wrong :(' });
    });

    it('should validate title is required', async () => {
      const request = createMockRequest('POST', {
        message: 'Message',
      });

      await expect(POST(request)).rejects.toThrow();
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('should validate message is required', async () => {
      const request = createMockRequest('POST', {
        title: 'Title',
      });

      await expect(POST(request)).rejects.toThrow();
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('should validate title max length', async () => {
      const request = createMockRequest('POST', {
        title: 'a'.repeat(101), // Exceeds TITLE_MAX_LENGTH (100)
        message: 'Message',
      });

      await expect(POST(request)).rejects.toThrow();
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('should validate message max length', async () => {
      const request = createMockRequest('POST', {
        title: 'Title',
        message: 'a'.repeat(1001), // Exceeds MESSAGE_MAX_LENGTH (1000)
      });

      await expect(POST(request)).rejects.toThrow();
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('should validate hashtag max length', async () => {
      const request = createMockRequest('POST', {
        title: 'Title',
        message: 'Message',
        hashtags: ['a'.repeat(21)], // Exceeds HASHTAG_MAX_LENGTH (20)
      });

      await expect(POST(request)).rejects.toThrow();
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('should validate hashtag max count', async () => {
      const request = createMockRequest('POST', {
        title: 'Title',
        message: 'Message',
        hashtags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6'], // Exceeds HASHTAG_MAX_COUNT (5)
      });

      await expect(POST(request)).rejects.toThrow();
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('should validate imageId max length', async () => {
      const request = createMockRequest('POST', {
        title: 'Title',
        message: 'Message',
        imageId: 'a'.repeat(266), // Exceeds IMAGE_ID_MAX_LENGTH (265)
      });

      await expect(POST(request)).rejects.toThrow();
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });
});
