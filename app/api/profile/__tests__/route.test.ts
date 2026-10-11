import { NextRequest } from 'next/server';
import makeNextServerMock from '../../../../test-helper/nextServer.mock';
import { getToken } from 'next-auth/jwt';
import prisma from '../../../../lib/prisma';
import { GET, PUT } from '../route';

jest.mock('next/server', () => makeNextServerMock());

jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(),
}));

jest.mock('../../../../lib/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('/api/profile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXTAUTH_SECRET = 'test-secret';
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
    it('returns 401 when token or token.sub is missing', async () => {
      (getToken as jest.Mock).mockResolvedValue(null);
      const req = createMockRequest('GET');

      const response = await GET(req);
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data).toEqual({ message: 'Unauthorized' });
    });

    it('returns 404 when user is not found in database', async () => {
      (getToken as jest.Mock).mockResolvedValue({ sub: 'user-123' });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      const req = createMockRequest('GET');

      const response = await GET(req);
      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toEqual({ message: 'User not found' });
    });

    it('returns 200 with user profile data when user exists', async () => {
      const mockUser = {
        id: 'user-123',
        name: 'Jane Doe',
        email: 'jane@example.com',
        image: 'https://example.com/avatar.jpg',
      };
      (getToken as jest.Mock).mockResolvedValue({ sub: 'user-123' });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      const req = createMockRequest('GET');

      const response = await GET(req);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(mockUser);
    });

    it('returns 500 when database operation fails', async () => {
      (getToken as jest.Mock).mockResolvedValue({ sub: 'user-123' });
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('DB error'));
      const req = createMockRequest('GET');

      const response = await GET(req);
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ message: 'Failed to fetch profile' });
    });
  });

  describe('PUT', () => {
    it('returns 401 when token or token.sub is missing', async () => {
      (getToken as jest.Mock).mockResolvedValue(null);
      const req = createMockRequest('PUT', { image: 'https://example.com/new.jpg' });

      const response = await PUT(req);
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data).toEqual({ message: 'Unauthorized' });
    });

    it('returns 200 and updates profile image', async () => {
      const mockUpdatedUser = {
        id: 'user-123',
        name: 'Jane Doe',
        email: 'jane@example.com',
        image: 'https://example.com/new.jpg',
      };
      (getToken as jest.Mock).mockResolvedValue({ sub: 'user-123' });
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

      const req = createMockRequest('PUT', { image: 'https://example.com/new.jpg' });

      const response = await PUT(req);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({
        message: 'Profile updated successfully',
        user: mockUpdatedUser,
      });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { image: 'https://example.com/new.jpg' },
        select: { id: true, name: true, email: true, image: true },
      });
    });

    it('returns 200 and sets image to null when image field is missing or null', async () => {
      const mockUpdatedUser = {
        id: 'user-123',
        name: 'Jane Doe',
        email: 'jane@example.com',
        image: null,
      };
      (getToken as jest.Mock).mockResolvedValue({ sub: 'user-123' });
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

      const req = createMockRequest('PUT', {});

      const response = await PUT(req);
      expect(response.status).toBe(200);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { image: null },
        select: { id: true, name: true, email: true, image: true },
      });
    });

    it('returns 500 when database update fails', async () => {
      (getToken as jest.Mock).mockResolvedValue({ sub: 'user-123' });
      (prisma.user.update as jest.Mock).mockRejectedValue(new Error('Update failed'));

      const req = createMockRequest('PUT', { image: 'https://example.com/new.jpg' });

      const response = await PUT(req);
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ message: 'Failed to update profile' });
    });
  });
});
