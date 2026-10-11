import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

const secret = process.env.NEXTAUTH_SECRET;

export const GET = async (req: NextRequest) => {
  const token = await getToken({ req, secret });

  if (!token?.sub) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: token.sub },
      select: { id: true, name: true, email: true, image: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'Failed to fetch profile' }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest) => {
  const token = await getToken({ req, secret });

  if (!token?.sub) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await req.json()) as { image?: string | null };
    const image = body.image !== undefined ? body.image : null;

    const updatedUser = await prisma.user.update({
      where: { id: token.sub },
      data: { image },
      select: { id: true, name: true, email: true, image: true },
    });

    return NextResponse.json(
      { message: 'Profile updated successfully', user: updatedUser },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 });
  }
};
