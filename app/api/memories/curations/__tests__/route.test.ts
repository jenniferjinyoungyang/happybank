import { NextRequest } from 'next/server';
import makeNextServerMock from '../../../../../test-helper/nextServer.mock';

jest.mock('next/server', () => makeNextServerMock());

const mockGetToken = jest.fn();
jest.doMock('next-auth/jwt', () => ({
  getToken: mockGetToken,
}));

const mockGetTopHashtags = jest.fn();
jest.doMock('../../memoriesDb', () => ({
  memoriesDb: {
    getTopHashtags: mockGetTopHashtags,
  },
}));

let GET: typeof import('../route').GET;

beforeAll(async () => {
  const routeModule = await import('../route');
  GET = routeModule.GET;
});

describe('/api/memories/curations', () => {
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
      url: 'http://localhost/api/memories/curations',
    }) as unknown as NextRequest;

  it('should return top hashtags for authenticated user', async () => {
    const mockCurations = [
      { id: 1, name: 'travel', count: 15, imageId: 'img1' },
      { id: 2, name: 'food', count: 10, imageId: null },
    ];
    mockGetTopHashtags.mockResolvedValue(mockCurations);

    const request = createMockRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockCurations);
    expect(mockGetTopHashtags).toHaveBeenCalledWith('user-123');
  });

  it('should return 401 when user is not authenticated', async () => {
    mockGetToken.mockResolvedValue(null);

    const request = createMockRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ message: 'Unauthorized' });
    expect(mockGetTopHashtags).not.toHaveBeenCalled();
  });

  it('should return 500 when the database throws an error', async () => {
    mockGetTopHashtags.mockRejectedValue(new Error('Database error'));

    const request = createMockRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toContain('Oops! Something went wrong');
    expect(data.message).toContain('Database error');
  });
});
