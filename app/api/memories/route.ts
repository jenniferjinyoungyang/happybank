import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

const savingsQuery = (userId: string) =>
  prisma.saving.findMany({
    where: {
      userId: userId ?? 'cm0ll6qxq00003b6se4csrall',
    },
    select: {
      createdAt: true,
      title: true,
      message: true,
      hashTags: true,
    },
  });

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return NextResponse.json(
      { message: 'Only POST requests are allowed' },
      { status: 405 },
    );
  }

  const res = await req.json();

  try {
    const savings = await savingsQuery(res);
    return NextResponse.json({ savings }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Oops! Something went wrong :(' },
      { status: 500 },
    );
  }
}
