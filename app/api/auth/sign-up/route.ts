import { AuthType } from '@prisma/client';
import { hash } from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import prisma from '../../../../lib/prisma';

const createUserSchema = z.object({
  name: z.string().min(1, 'Username is required').max(50),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must have at least 6 characters')
    .max(100),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, password } = createUserSchema.parse(body);

    const isExistingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (isExistingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
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

    return NextResponse.json({ user: rest, message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Oops! Something went wrong :(' }, { status: 500 });
  }
}
