import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { MEMORY_VALIDATION } from '../../_shared/_constants/memory';
import { MemoriesDbCreationFields, MemoriesDbEntity, memoriesDb } from './memoriesDb';

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
  } catch (error) {
    return NextResponse.json(
      {
        message: `Oops! Something went wrong :( ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    );
  }
};

const createMemorySchema = z.object({
  title: z.string().min(1, 'Title is required').max(MEMORY_VALIDATION.TITLE_MAX_LENGTH),
  message: z.string().min(1, 'Email is required').max(MEMORY_VALIDATION.MESSAGE_MAX_LENGTH),
  hashtags: z
    .array(
      z
        .string()
        .max(
          MEMORY_VALIDATION.HASHTAG_MAX_LENGTH,
          `Each hashtag cannot exceed ${MEMORY_VALIDATION.HASHTAG_MAX_LENGTH} characters`,
        ),
    )
    .max(
      MEMORY_VALIDATION.HASHTAG_MAX_COUNT,
      `You can only add up to ${MEMORY_VALIDATION.HASHTAG_MAX_COUNT} hashtags`,
    )
    .default([]),
  imageId: z.string().max(MEMORY_VALIDATION.IMAGE_ID_MAX_LENGTH).nullable().optional(),
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

  const { title, message, hashtags = [], imageId = null } = createMemorySchema.parse(body);

  const inputFields: MemoriesDbCreationFields = {
    title,
    message,
    hashtags,
    imageId,
  };

  try {
    await memoriesDb.create(token.sub, inputFields);
    return NextResponse.json({ message: 'successfully created a new memory' }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Oops! Something went wrong :(' }, { status: 500 });
  }
};
