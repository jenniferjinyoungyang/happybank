import { AuthType } from '@prisma/client';
import bcrypt from 'bcrypt';
import NextAuth, { Account, Profile, User } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import Credentials, { CredentialInput } from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import prisma from '../../../../lib/prisma';

type SignInProps = {
  readonly user: User | AdapterUser;
  readonly account: Account | null;
  readonly profile?: Profile & {
    readonly email_verified?: boolean;
  };
  readonly email?: {
    readonly verificationRequest?: boolean;
  };
  readonly credentials?: Record<string, CredentialInput>;
};

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User> {
        try {
          const { email, password } = credentials!;
          // Fetch user and password hash from your database
          const user = await prisma.user.findUnique({
            where: { email },
          });
          if (
            user &&
            user.authType === AuthType.CREDENTIALS &&
            user.password &&
            bcrypt.compareSync(password, user.password)
          ) {
            return {
              id: user.id,
              name: user.name!,
              email: user.email,
              exp: 0,
              iat: 0,
              jti: '',
            };
          }
          throw new Error('Invalid credentials');
        } catch (err) {
          throw new Error('Invalid credentials');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60,
  },
  callbacks: {
    signIn: async ({ user, account, profile }: SignInProps) => {
      if (account?.provider === 'google') {
        if (!profile?.email_verified) {
          return false;
        }

        try {
          const existingUserByEmail = await prisma.user.findUnique({
            where: { email: user.email! },
          });
          // if the user's google email doesn't exist in DB, should create a new user
          if (!existingUserByEmail) {
            await prisma.user.create({
              data: {
                id: user.id,
                email: user.email!,
                password: null,
                name: user.name,
                authType: AuthType.GOOGLE,
              },
            });
            // if the user had signed up as auth type === credentials with google email, but user tries to sign in with google, should throw an error
          } else if (existingUserByEmail.authType !== AuthType.GOOGLE) {
            throw new Error('You already have an account with this email');
          }
        } catch {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as unknown as User;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
