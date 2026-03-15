import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { Memory } from '../../../_shared/_types/memory';
import { memoriesDb } from '../memoriesDb';

const secret = process.env.NEXTAUTH_SECRET;

type SearchParams = {
  readonly hashtags?: string[];
  readonly q?: string;
  readonly from?: string;
  readonly to?: string;
};

export const GET = async (
  req: NextRequest,
): Promise<NextResponse<Memory[] | { message: string }>> => {
  const token = await getToken({ req, secret });

  if (!token?.sub) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const hashtags = url.searchParams.getAll('hashtags');
  const q = url.searchParams.get('q') ?? undefined;
  const from = url.searchParams.get('from') ?? undefined;
  const to = url.searchParams.get('to') ?? undefined;

  const searchParams: SearchParams = {
    hashtags: hashtags.length > 0 ? hashtags : undefined,
    q,
    from,
    to,
  };

  try {
    const memories = await memoriesDb.search(token.sub, searchParams);

    const mappedMemories: Memory[] = memories.map((memory) => ({
      title: memory.title,
      createdAt: memory.createdAt,
      message: memory.message,
      imageId: memory.imageId,
      hashtags: memory.hashtagRelations?.map((relation) => relation.hashtag.name) ?? [],
    }));

    return NextResponse.json(mappedMemories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: `Oops! Something went wrong :( ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    );
  }
};

