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
  const normalized = hashtag.trim().replace(/^#+/, '');
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
      .map((tag) => tag.trim().replace(/^#+/, ''))
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

type MemoryStats = {
  readonly memoryCount: number;
  readonly hashtagCount: number;
  readonly oldestMemoryDate: Date | null;
  readonly latestMemoryDate: Date | null;
};

const getStats = async (userId: string): Promise<MemoryStats> => {
  const [memoryCount, oldestMemory, latestMemory, hashtagCount] = await Promise.all([
    prisma.memory.count({ where: { userId } }),
    prisma.memory.findFirst({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true },
    }),
    prisma.memory.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    }),
    prisma.hashtag.count({
      where: {
        memories: {
          some: {
            memory: {
              userId,
            },
          },
        },
      },
    }),
  ]);

  return {
    memoryCount,
    hashtagCount,
    oldestMemoryDate: oldestMemory?.createdAt ?? null,
    latestMemoryDate: latestMemory?.createdAt ?? null,
  };
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

export type TopHashtag = {
  readonly id: number;
  readonly name: string;
  readonly count: number;
  readonly imageId: string | null;
};

const getTopHashtags = async (userId: string): Promise<TopHashtag[]> => {
  const topTags = await prisma.memoryHashtag.groupBy({
    by: ['hashtagId'],
    where: {
      memory: {
        userId,
      },
    },
    _count: {
      memoryId: true,
    },
    orderBy: {
      _count: {
        memoryId: 'desc',
      },
    },
    take: 3,
  });

  const result: TopHashtag[] = [];

  for (const tag of topTags) {
    const hashtag = await prisma.hashtag.findUnique({
      where: { id: tag.hashtagId },
      select: { name: true },
    });

    if (!hashtag) {
      continue;
    }

    // Try to find the latest memory with an image for this user and hashtag
    let latestMemory = await prisma.memory.findFirst({
      where: {
        userId,
        imageId: { not: null },
        hashtagRelations: {
          some: {
            hashtagId: tag.hashtagId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        imageId: true,
      },
    });

    // Fallback to absolute latest memory under this hashtag
    if (!latestMemory) {
      latestMemory = await prisma.memory.findFirst({
        where: {
          userId,
          hashtagRelations: {
            some: {
              hashtagId: tag.hashtagId,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          imageId: true,
        },
      });
    }

    result.push({
      id: tag.hashtagId,
      name: hashtag.name,
      count: tag._count.memoryId,
      imageId: latestMemory?.imageId ?? null,
    });
  }

  return result;
};

export const memoriesDb = {
  findAll,
  search,
  getStats,
  create,
  getTopHashtags,
};
