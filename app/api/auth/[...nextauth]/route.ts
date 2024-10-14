import NextAuth, { Account, Profile, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import Credentials, { CredentialInput } from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { AdapterUser } from 'next-auth/adapters';
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
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials;
        // Fetch user and password hash from your database
        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (
          user &&
          user.password &&
          bcrypt.compareSync(password, user.password)
        ) {
          return { id: user.id, name: user.name, email: user.email };
        }
        throw new Error('Invalid credentials');
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: SignInProps) {
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
                email: user.email!,
                password: null,
                name: user.name,
              },
            });
          }
        } catch {
          return false;
        }
        return true;
      }
      return true;
    },
  },
});

export { handler as GET, handler as POST };
