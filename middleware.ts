import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });

  if (!token) {
    return NextResponse.json(
      { message: 'Not authenticated.' },
      { status: 401 },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/memories/:path*'],
};
