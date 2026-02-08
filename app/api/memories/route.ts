import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { MemoriesDbEntity, MemoriesDbCreationFields, memoriesDb } from './memoriesDb';

const secret = process.env.NEXTAUTH_SECRET;

export const GET = async (
  req: NextRequest,
): Promise<NextResponse<MemoriesDbEntity | null | { message: string }>> => {
  const token = await getToken({ req, secret });

  if (!token?.sub) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const memories = await memoriesDb.findAll(token.sub);

    if (memories.length === 0) {
      return NextResponse.json(null, { status: 200 });
    }

    const randomIndex = Math.floor(Math.random() * memories.length);
    const memory = memories[randomIndex];

    return NextResponse.json(memory, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'Oops! Something went wrong :(' }, { status: 500 });
  }
};

const createMemorySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  message: z.string().min(1, 'Email is required').max(1000),
  hashtag: z.string().max(20),
  imageId: z.string().max(265).optional(), // taking into account max filename length for Mac/Windows
});

export const POST = async (req: NextRequest): Promise<NextResponse<{ message: string }>> => {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Only POST requests are allowed' }, { status: 405 });
  }

  const body = await req.json();
  const token = await getToken({ req, secret });

  if (!token?.sub) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { title, message, hashtag, imageId = null } = createMemorySchema.parse(body);

  const inputFields: MemoriesDbCreationFields = {
    title,
    message,
    hashtag,
    imageId,
  };

  try {
    await memoriesDb.create(token.sub, inputFields);
    return NextResponse.json({ message: 'successfully created a new memory' }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Oops! Something went wrong :(' }, { status: 500 });
  }
};
