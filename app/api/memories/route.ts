import { Prisma, Saving } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '../../../lib/prisma';

const secret = process.env.NEXTAUTH_SECRET;

type DbMemory = Omit<Saving, 'id' | 'userId'>;

const memoriesQuery = (userId: string): Prisma.PrismaPromise<DbMemory[]> =>
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

export async function GET(
  req: NextRequest,
): Promise<NextResponse<DbMemory[] | { message: string }>> {
  const token = await getToken({ req, secret });

  try {
    const memories = await memoriesQuery(token?.sub!);
    return NextResponse.json(memories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Oops! Something went wrong :(' },
      { status: 500 },
    );
  }
}
