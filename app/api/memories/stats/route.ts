import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { memoriesDb } from '../memoriesDb';

const secret = process.env.NEXTAUTH_SECRET;

type MemoryStatsResponse = {
  readonly totalMemories: number;
  readonly hashtagCount: number;
  readonly oldestMemoryDate: string | null;
  readonly latestMemoryDate: string | null;
};

export const GET = async (
  req: NextRequest,
): Promise<NextResponse<MemoryStatsResponse | { message: string }>> => {
  const token = await getToken({ req, secret });

  if (!token?.sub) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const stats = await memoriesDb.getStats(token.sub);

    return NextResponse.json(
      {
        totalMemories: stats.memoryCount,
        hashtagCount: stats.hashtagCount,
        oldestMemoryDate: stats.oldestMemoryDate?.toISOString() ?? null,
        latestMemoryDate: stats.latestMemoryDate?.toISOString() ?? null,
      },
      { status: 200 },
    );
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
