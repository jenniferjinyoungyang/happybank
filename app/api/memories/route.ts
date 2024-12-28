import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { MemoriesDb, memoriesDb } from './memoriesDb';

const secret = process.env.NEXTAUTH_SECRET;

export const GET = async (
  req: NextRequest,
): Promise<NextResponse<MemoriesDb.Entity[] | { message: string }>> => {
  const token = await getToken({ req, secret });

  try {
    const memories = await memoriesDb.findAll(token?.sub!);
    return NextResponse.json(memories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Oops! Something went wrong :(' },
      { status: 500 },
    );
  }
};

const createMemorySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  message: z.string().min(1, 'Email is required').max(1000),
  hashtag: z.string().max(20),
  imageId: z.string().max(265).optional(), // taking into account max filename length for Mac/Windows
});

export const POST = async (
  req: NextRequest,
): Promise<NextResponse<{ message: string }>> => {
  if (req.method !== 'POST') {
    return NextResponse.json(
      { message: 'Only POST requests are allowed' },
      { status: 405 },
    );
  }

  const body = await req.json();
  const token = await getToken({ req, secret });
  const {
    title,
    message,
    hashtag,
    imageId = null,
  } = createMemorySchema.parse(body);

  const inputFields: MemoriesDb.CreationFields = {
    title,
    message,
    hashtag,
    imageId,
  };

  try {
    await memoriesDb.create(token!.sub!, inputFields);
    return NextResponse.json(
      { message: 'successfully created a new memory' },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Oops! Something went wrong :(' },
      { status: 500 },
    );
  }
};
