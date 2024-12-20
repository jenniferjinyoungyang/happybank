import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '../../../lib/prisma';

const secret = process.env.NEXTAUTH_SECRET;

const savingsQuery = (userId: string) =>
  prisma.saving.findMany({
    where: {
      userId,
    },
    select: {
      createdAt: true,
      title: true,
      message: true,
      hashTags: true,
    },
  });

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret });

  try {
    const savings = await savingsQuery(token?.sub!);
    return NextResponse.json({ savings }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Oops! Something went wrong :(' },
      { status: 500 },
    );
  }
}
