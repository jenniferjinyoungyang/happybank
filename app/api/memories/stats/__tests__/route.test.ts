import { NextRequest } from 'next/server';
import makeNextServerMock from '../../../../../test-helper/nextServer.mock';

jest.mock('next/server', () => makeNextServerMock());

const mockGetToken = jest.fn();
jest.doMock('next-auth/jwt', () => ({
  getToken: mockGetToken,
}));

const mockStats = jest.fn();
jest.doMock('../../memoriesDb', () => ({
  memoriesDb: {
    getStats: mockStats,
  },
}));

let GET: typeof import('../route').GET;

beforeAll(async () => {
  const routeModule = await import('../route');
  GET = routeModule.GET;
});

describe('/api/memories/stats', () => {
  const mockToken = { sub: 'user-123' };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXTAUTH_SECRET = 'test-secret';
    mockGetToken.mockResolvedValue(mockToken as never);
  });

  afterEach(() => {
    delete process.env.NEXTAUTH_SECRET;
  });

  const createMockRequest = (): NextRequest =>
    ({
      url: 'http://localhost/api/memories/stats',
    }) as unknown as NextRequest;

  it('should return memory stats for authenticated user', async () => {
    mockStats.mockResolvedValue({
      memoryCount: 12,
      hashtagCount: 4,
      oldestMemoryDate: new Date('2024-01-01T00:00:00.000Z'),
      latestMemoryDate: new Date('2024-12-31T23:59:59.999Z'),
    });

    const request = createMockRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      totalMemories: 12,
      hashtagCount: 4,
      oldestMemoryDate: '2024-01-01T00:00:00.000Z',
      latestMemoryDate: '2024-12-31T23:59:59.999Z',
    });
    expect(mockStats).toHaveBeenCalledWith('user-123');
  });

  it('should return null for oldest/latest dates when values are missing', async () => {
    mockStats.mockResolvedValue({
      memoryCount: 5,
      hashtagCount: 2,
      oldestMemoryDate: null,
      latestMemoryDate: null,
    });

    const request = createMockRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      totalMemories: 5,
      hashtagCount: 2,
      oldestMemoryDate: null,
      latestMemoryDate: null,
    });
  });

  it('should return 401 when user is not authenticated', async () => {
    mockGetToken.mockResolvedValue(null);

    const request = createMockRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ message: 'Unauthorized' });
    expect(mockStats).not.toHaveBeenCalled();
  });

  it('should return 500 when the database throws an error', async () => {
    mockStats.mockRejectedValue(new Error('Database unavailable'));

    const request = createMockRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toContain('Oops! Something went wrong');
    expect(data.message).toContain('Database unavailable');
  });

  it('should return 500 when the thrown error is not an Error object', async () => {
    mockStats.mockRejectedValue('Unexpected failure');

    const request = createMockRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toContain('Oops! Something went wrong');
    expect(data.message).toContain('Unexpected failure');
  });
});
