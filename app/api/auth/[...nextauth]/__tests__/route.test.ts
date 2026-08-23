import { AuthOptions, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { AuthType } from '@prisma/client';
import bcrypt from 'bcrypt';
import prisma from '../../../../../lib/prisma';

jest.mock('next-auth', () => {
  const nextAuthMock = (options: unknown) => {
    (global as typeof globalThis & { capturedOptions?: unknown }).capturedOptions = options;
    return {
      GET: jest.fn(),
      POST: jest.fn(),
    };
  };
  return {
    __esModule: true,
    default: nextAuthMock,
  };
});

jest.mock('next-auth/providers/google', () => {
  return jest.fn((config) => ({
    id: 'google',
    name: 'Google',
    type: 'oauth',
    ...config,
  }));
});

jest.mock('next-auth/providers/credentials', () => {
  return {
    __esModule: true,
    default: jest.fn((config) => ({
      id: 'credentials',
      name: 'Credentials',
      type: 'credentials',
      ...config,
    })),
  };
});

jest.mock('bcrypt', () => ({
  compareSync: jest.fn(),
}));

jest.mock('../../../../../lib/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

import '../route'; // Import route to trigger NextAuth initialization and capture options

describe('/api/auth/[...nextauth]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('NextAuth options configuration', () => {
    it('initializes NextAuth options and exports handlers', () => {
      const capturedOptions = (global as typeof globalThis & { capturedOptions?: AuthOptions })
        .capturedOptions;
      expect(capturedOptions).toBeDefined();
      expect(capturedOptions?.providers).toHaveLength(2);
      expect(capturedOptions?.session?.strategy).toBe('jwt');
      expect(capturedOptions?.session?.maxAge).toBe(30 * 60);
    });
  });

  describe('CredentialsProvider authorize', () => {
    let authorize: (credentials?: Record<string, string>) => Promise<unknown>;

    beforeAll(() => {
      const capturedOptions = (global as typeof globalThis & { capturedOptions?: AuthOptions })
        .capturedOptions;
      // Find the credentials provider and extract its authorize callback
      const credentialsProvider = capturedOptions?.providers.find(
        (p) => (p as { id: string }).id === 'credentials',
      ) as { authorize?: (credentials?: Record<string, string>) => Promise<unknown> } | undefined;
      if (!credentialsProvider || !credentialsProvider.authorize) {
        throw new Error('Credentials provider authorize not found');
      }
      authorize = credentialsProvider.authorize;
    });

    it('returns user if credentials are valid and user exists with CREDENTIALS type', async () => {
      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        authType: AuthType.CREDENTIALS,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

      const result = await authorize({
        email: 'john@example.com',
        password: 'correct-password',
      });

      expect(result).toEqual({
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        exp: 0,
        iat: 0,
        jti: '',
      });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(bcrypt.compareSync).toHaveBeenCalledWith('correct-password', 'hashed-password');
    });

    it('throws error if user is not found in database', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        authorize({ email: 'nonexistent@example.com', password: 'password' }),
      ).rejects.toThrow('Invalid credentials');
    });

    it('throws error if user authType is not CREDENTIALS', async () => {
      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: null,
        authType: AuthType.GOOGLE,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(authorize({ email: 'john@example.com', password: 'password' })).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('throws error if user password hash is missing', async () => {
      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: null,
        authType: AuthType.CREDENTIALS,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(authorize({ email: 'john@example.com', password: 'password' })).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('throws error if bcrypt.compareSync returns false', async () => {
      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        authType: AuthType.CREDENTIALS,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

      await expect(
        authorize({ email: 'john@example.com', password: 'wrong-password' }),
      ).rejects.toThrow('Invalid credentials');
    });

    it('throws error if database search throws exception', async () => {
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('DB connection failed'));

      await expect(authorize({ email: 'john@example.com', password: 'password' })).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  describe('signIn callback', () => {
    let signIn: (params: {
      user: { id: string; email?: string; name?: string };
      account: { provider: string } | null;
      profile?: { email_verified?: boolean };
    }) => Promise<boolean>;

    beforeAll(() => {
      const capturedOptions = (global as typeof globalThis & { capturedOptions?: AuthOptions })
        .capturedOptions;
      const callbackSignIn = capturedOptions?.callbacks?.signIn;
      if (!callbackSignIn) {
        throw new Error('callbacks.signIn not found');
      }
      signIn = callbackSignIn as (params: {
        user: { id: string; email?: string; name?: string };
        account: { provider: string } | null;
        profile?: { email_verified?: boolean };
      }) => Promise<boolean>;
    });

    it('returns true immediately for non-google provider', async () => {
      const result = await signIn({
        user: { id: '1' },
        account: { provider: 'credentials' },
      });
      expect(result).toBe(true);
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    it('returns false if google sign-in is not email_verified', async () => {
      const result = await signIn({
        user: { id: '1', email: 'john@example.com' },
        account: { provider: 'google' },
        profile: { email_verified: false },
      });
      expect(result).toBe(false);
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    it('creates a new user and returns true if email is verified and user does not exist', async () => {
      const mockUser = { id: 'google-uid', email: 'john@example.com', name: 'John' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await signIn({
        user: mockUser,
        account: { provider: 'google' },
        profile: { email_verified: true },
      });

      expect(result).toBe(true);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          id: 'google-uid',
          email: 'john@example.com',
          password: null,
          name: 'John',
          authType: AuthType.GOOGLE,
        },
      });
    });

    it('does not create user and returns true if user already exists with GOOGLE authType', async () => {
      const mockUser = { id: 'google-uid', email: 'john@example.com', name: 'John' };
      const existingUser = {
        id: 'existing-id',
        email: 'john@example.com',
        authType: AuthType.GOOGLE,
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);

      const result = await signIn({
        user: mockUser,
        account: { provider: 'google' },
        profile: { email_verified: true },
      });

      expect(result).toBe(true);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('returns false (throwing caught error) if user exists with non-GOOGLE authType', async () => {
      const mockUser = { id: 'google-uid', email: 'john@example.com', name: 'John' };
      const existingUser = {
        id: 'existing-id',
        email: 'john@example.com',
        authType: AuthType.CREDENTIALS,
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);

      const result = await signIn({
        user: mockUser,
        account: { provider: 'google' },
        profile: { email_verified: true },
      });

      expect(result).toBe(false);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
    });

    it('returns false if db throw error', async () => {
      const mockUser = { id: 'google-uid', email: 'john@example.com', name: 'John' };
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Prisma error'));

      const result = await signIn({
        user: mockUser,
        account: { provider: 'google' },
        profile: { email_verified: true },
      });

      expect(result).toBe(false);
    });
  });

  describe('jwt callback', () => {
    it('merges token and user', async () => {
      const capturedOptions = (global as typeof globalThis & { capturedOptions?: AuthOptions })
        .capturedOptions;
      const jwt = capturedOptions?.callbacks?.jwt;
      if (!jwt) {
        throw new Error('callbacks.jwt not found');
      }
      const result = await jwt({
        token: { name: 'TokenName' },
        user: { email: 'user@example.com' } as unknown as User,
        account: null,
        profile: undefined,
        isNewUser: false,
      });

      expect(result).toEqual({
        name: 'TokenName',
        email: 'user@example.com',
      });
    });
  });

  describe('session callback', () => {
    it('sets session.user to token and returns session', async () => {
      const capturedOptions = (global as typeof globalThis & { capturedOptions?: AuthOptions })
        .capturedOptions;
      const session = capturedOptions?.callbacks?.session;
      if (!session) {
        throw new Error('callbacks.session not found');
      }
      const mockSession = { user: null, expires: '' };
      const mockToken = { name: 'TokenName', email: 'user@example.com' };

      const result = await session({
        session: mockSession as unknown as Session,
        token: mockToken as unknown as JWT,
        user: {} as unknown as Parameters<typeof session>[0]['user'],
      } as unknown as Parameters<typeof session>[0]);

      expect(result).toEqual({
        user: mockToken,
        expires: '',
      });
    });
  });
});
