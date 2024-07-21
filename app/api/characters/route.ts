import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET() {
  const user = await prisma.user.findFirst();
  return NextResponse.json({ characters: user?.email });
}
