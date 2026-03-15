import { NextRequest } from 'next/server';
import makeNextServerMock from '../../../../../test-helper/nextServer.mock';

jest.mock('next/server', () => makeNextServerMock());

const mockGetToken = jest.fn();
jest.doMock('next-auth/jwt', () => ({
  getToken: mockGetToken,
}));

const mockSearch = jest.fn();
jest.doMock('../../memoriesDb', () => ({
  memoriesDb: {
    search: mockSearch,
  },
}));

let GET: typeof import('../route').GET;

beforeAll(async () => {
  const routeModule = await import('../route');
  GET = routeModule.GET;
});

describe('/api/memories/search', () => {
  const mockToken = { sub: 'user-456' };

  const createMockRequest = (url = 'http://localhost/api/memories/search'): NextRequest =>
    ({
      url,
    }) as unknown as NextRequest;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXTAUTH_SECRET = 'test-secret';
    mockGetToken.mockResolvedValue(mockToken as never);
  });

  afterEach(() => {
    delete process.env.NEXTAUTH_SECRET;
  });

  describe('GET', () => {
    it('returns 401 when user is not authenticated', async () => {
      mockGetToken.mockResolvedValue(null);

      const request = createMockRequest();
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ message: 'Unauthorized' });
      expect(mockSearch).not.toHaveBeenCalled();
    });

    it('returns 401 when token has no sub', async () => {
      mockGetToken.mockResolvedValue({} as never);

      const request = createMockRequest();
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ message: 'Unauthorized' });
      expect(mockSearch).not.toHaveBeenCalled();
    });

    it('returns 200 with empty array when no memories match', async () => {
      mockSearch.mockResolvedValue([]);

      const request = createMockRequest();
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
      expect(mockSearch).toHaveBeenCalledWith('user-456', {
        hashtags: undefined,
        q: undefined,
        from: undefined,
        to: undefined,
      });
    });

    it('passes query params to memoriesDb.search and returns mapped memories', async () => {
      const dbMemories = [
        {
          title: 'Beach day',
          message: 'Had fun',
          createdAt: new Date('2024-06-15'),
          imageId: 'img1',
          hashtagRelations: [{ hashtag: { name: 'summer' } }, { hashtag: { name: 'fun' } }],
        },
      ];
      mockSearch.mockResolvedValue(dbMemories);

      const request = createMockRequest(
        'http://localhost/api/memories/search?hashtags=summer&hashtags=fun&q=beach&from=2024-01-01&to=2024-12-31',
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockSearch).toHaveBeenCalledWith('user-456', {
        hashtags: ['summer', 'fun'],
        q: 'beach',
        from: '2024-01-01',
        to: '2024-12-31',
      });
      expect(data).toHaveLength(1);
      expect(data[0].title).toBe('Beach day');
      expect(data[0].message).toBe('Had fun');
      expect(data[0].imageId).toBe('img1');
      expect(data[0].hashtags).toEqual(['summer', 'fun']);
      expect(new Date(data[0].createdAt).toISOString()).toBe('2024-06-15T00:00:00.000Z');
    });

    it('passes undefined for empty hashtags when no hashtags in URL', async () => {
      mockSearch.mockResolvedValue([]);

      const request = createMockRequest('http://localhost/api/memories/search');
      await GET(request);

      expect(mockSearch).toHaveBeenCalledWith('user-456', {
        hashtags: undefined,
        q: undefined,
        from: undefined,
        to: undefined,
      });
    });

    it('maps memories with empty hashtagRelations to empty hashtags array', async () => {
      mockSearch.mockResolvedValue([
        {
          title: 'No tags',
          message: 'Message',
          createdAt: new Date('2024-01-01'),
          imageId: null,
          hashtagRelations: [],
        },
      ]);

      const request = createMockRequest();
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data[0].hashtags).toEqual([]);
    });

    it('maps memories with undefined hashtagRelations to empty hashtags array', async () => {
      mockSearch.mockResolvedValue([
        {
          title: 'No relations',
          message: 'Message',
          createdAt: new Date('2024-01-01'),
          imageId: null,
          hashtagRelations: undefined,
        },
      ]);

      const request = createMockRequest();
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data[0].hashtags).toEqual([]);
    });

    it('returns 500 when memoriesDb.search throws an Error', async () => {
      mockSearch.mockRejectedValue(new Error('Database connection failed'));

      const request = createMockRequest();
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toContain('Oops! Something went wrong');
      expect(data.message).toContain('Database connection failed');
    });

    it('returns 500 when memoriesDb.search throws non-Error', async () => {
      mockSearch.mockRejectedValue('String error');

      const request = createMockRequest();
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toContain('Oops! Something went wrong');
      expect(data.message).toContain('String error');
    });
  });
});
