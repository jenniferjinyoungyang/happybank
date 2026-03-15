import { Hashtag, Memory, Prisma } from '@prisma/client';
import prisma from '../../../lib/prisma';
import { MemoryCreationFields } from '../../_shared/_types/memory';

export type MemoriesDbEntity = Omit<Memory, 'id' | 'userId'> & {
  hashtagRelations?: Array<{ hashtag: Hashtag }>;
};

/**
 * Normalize hashtag name: remove #, trim
 */
function normalizeHashtag(hashtag: string): string | null {
  const normalized = hashtag.replace(/^#+/, '').trim();
  return normalized.length > 0 ? normalized : null;
}

const findAll = async (userId: string): Promise<MemoriesDbEntity[]> => {
  const memories = await prisma.memory.findMany({
    where: {
      userId,
    },
    select: {
      createdAt: true,
      title: true,
      message: true,
      hashtagRelations: {
        include: {
          hashtag: true,
        },
      },
      imageId: true,
    },
  });

  return memories.map((memory) => ({
    createdAt: memory.createdAt,
    title: memory.title,
    message: memory.message,
    hashtagRelations: memory.hashtagRelations,
    imageId: memory.imageId,
  }));
};

type SearchParams = {
  readonly hashtags?: string[];
  readonly q?: string;
  readonly from?: string;
  readonly to?: string;
};

const buildSearchWhere = (userId: string, params: SearchParams): Prisma.MemoryWhereInput => {
  const andConditions: Prisma.MemoryWhereInput[] = [];

  if (params.q) {
    andConditions.push({
      OR: [
        { title: { contains: params.q, mode: 'insensitive' } },
        { message: { contains: params.q, mode: 'insensitive' } },
      ],
    });
  }

  if (params.from || params.to) {
    andConditions.push({
      createdAt: {
        ...(params.from ? { gte: new Date(params.from) } : {}),
        ...(params.to ? { lte: new Date(params.to) } : {}),
      },
    });
  }

  if (params.hashtags && params.hashtags.length > 0) {
    const tagNames = params.hashtags
      .map((tag) => tag.replace(/^#+/, '').trim())
      .filter((tag) => tag.length > 0);
    if (tagNames.length > 0) {
      andConditions.push({
        hashtagRelations: {
          some: {
            hashtag: {
              name: { in: tagNames, mode: 'insensitive' },
            },
          },
        },
      });
    }
  }

  const where: Prisma.MemoryWhereInput = {
    userId,
    ...(andConditions.length > 0 ? { AND: andConditions } : {}),
  };
  return where;
};

const search = async (userId: string, params: SearchParams): Promise<MemoriesDbEntity[]> => {
  const where = buildSearchWhere(userId, params);

  const memories = await prisma.memory.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      createdAt: true,
      title: true,
      message: true,
      hashtagRelations: {
        include: {
          hashtag: true,
        },
      },
      imageId: true,
    },
  });

  return memories.map((memory) => ({
    createdAt: memory.createdAt,
    title: memory.title,
    message: memory.message,
    hashtagRelations: memory.hashtagRelations,
    imageId: memory.imageId,
  }));
};

const create = async (userId: string, fields: MemoryCreationFields): Promise<Memory> => {
  const { hashtags, ...memoryFields } = fields;

  // Normalize and deduplicate hashtags
  const normalizedHashtags = hashtags
    .map(normalizeHashtag)
    .filter((tag): tag is string => tag !== null);

  const uniqueHashtags = Array.from(new Set(normalizedHashtags));

  return prisma.memory.create({
    data: {
      userId,
      ...memoryFields,
      hashtagRelations: {
        create: uniqueHashtags.map((hashtagName) => ({
          hashtag: {
            connectOrCreate: {
              where: { name: hashtagName },
              create: { name: hashtagName },
            },
          },
        })),
      },
    },
    include: {
      hashtagRelations: {
        include: {
          hashtag: true,
        },
      },
    },
  });
};

export const memoriesDb = {
  findAll,
  search,
  create,
};
