import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import prisma from '../../../../lib/prisma';

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
});

export { handler as GET, handler as POST };
