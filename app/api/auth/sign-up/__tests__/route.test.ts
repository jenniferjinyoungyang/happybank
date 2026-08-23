import makeNextServerMock from '../../../../../test-helper/nextServer.mock';

jest.doMock('next/server', () => makeNextServerMock());

import { NextRequest } from 'next/server';
import { AuthType } from '@prisma/client';
import prisma from '../../../../../lib/prisma';
import { hash } from 'bcrypt';

jest.mock('../../../../../lib/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

let POST: (req: NextRequest) => Promise<Response>;

describe('/api/auth/sign-up', () => {
  beforeAll(async () => {
    const route = await import('../route');
    POST = route.POST;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockRequest = (body: unknown): NextRequest =>
    ({
      json: async () => body,
    }) as unknown as NextRequest;

  it('creates user successfully and returns 201', async () => {
    const signupData = { name: 'Alice', email: 'alice@example.com', password: 'password123' };
    const hashedPassword = 'hashed-password-123';
    const createdUser = {
      id: 'user-id-abc',
      email: 'alice@example.com',
      name: 'Alice',
      password: hashedPassword,
      authType: AuthType.CREDENTIALS,
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (hash as jest.Mock).mockResolvedValue(hashedPassword);
    (prisma.user.create as jest.Mock).mockResolvedValue(createdUser);

    const request = createMockRequest(signupData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual({
      user: {
        id: 'user-id-abc',
        email: 'alice@example.com',
        name: 'Alice',
        authType: AuthType.CREDENTIALS,
      },
      message: 'User created successfully',
    });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: signupData.email } });
    expect(hash).toHaveBeenCalledWith(signupData.password, 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: signupData.email,
        name: signupData.name,
        password: hashedPassword,
        authType: AuthType.CREDENTIALS,
      },
    });
  });

  it('returns 409 if user with email already exists', async () => {
    const signupData = { name: 'Alice', email: 'alice@example.com', password: 'password123' };
    const existingUser = {
      id: 'existing-id',
      email: 'alice@example.com',
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);

    const request = createMockRequest(signupData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data).toEqual({ message: 'User with this email already exists' });
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('returns 500 when database throws an error', async () => {
    const signupData = { name: 'Alice', email: 'alice@example.com', password: 'password123' };
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Prisma error'));

    const request = createMockRequest(signupData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ message: 'Oops! Something went wrong :(' });
  });

  it('returns 500 when input parsing throws a validation error', async () => {
    const invalidData = { name: '', email: 'invalid-email', password: '123' }; // password too short, invalid email, empty name

    const request = createMockRequest(invalidData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ message: 'Oops! Something went wrong :(' });
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });
});
