import { NextResponse } from 'next/server';
import bycypt from 'bcrypt';
import * as z from 'zod';
import prisma from '../../../lib/prisma';

const reqBodySchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(2, 'Password is required'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = reqBodySchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user && user.password) {
      const passwordMatches = await bycypt.compare(password, user.password);

      if (passwordMatches) {
        return NextResponse.json(
          { status: 'Success', message: 'Login successful' },
          { status: 200 },
        );
      }

      return NextResponse.json(
        { status: 'Error', message: 'Invalid password' },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { status: 'Error', message: 'User not found' },
      { status: 404 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Oops! Something went wrong :(' },
      { status: 500 },
    );
  }
}
