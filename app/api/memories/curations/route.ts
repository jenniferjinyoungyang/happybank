import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { memoriesDb, TopHashtag } from '../memoriesDb';

const secret = process.env.NEXTAUTH_SECRET;

export const GET = async (
  req: NextRequest,
): Promise<NextResponse<TopHashtag[] | { message: string }>> => {
  const token = await getToken({ req, secret });

  if (!token?.sub) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const curations = await memoriesDb.getTopHashtags(token.sub);

    return NextResponse.json(curations, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: `Oops! Something went wrong :( ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 },
    );
  }
};
