import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import * as z from 'zod';
import { AuthType } from '@prisma/client';
import prisma from '../../../lib/prisma';

// Define a schema for input validation
const reqBodySchema = z.object({
  name: z.string().min(1, 'Username is required').max(50),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must have 6 characters'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password } = reqBodySchema.parse(body);

    // check if email already exists
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: 'User with this email already exists' },
        { status: 409 },
      );
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        authType: AuthType.CREDENTIALS,
      },
    });

    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json(
      { user: rest, message: 'User created successfully' },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Oops! Something went wrong :(' },
      { status: 500 },
    );
  }
}
