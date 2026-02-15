import { Memory, Hashtag } from '@prisma/client';
import prisma from '../../../lib/prisma';

export type MemoriesDbEntity = Omit<Memory, 'id' | 'userId'> & {
  hashtagRelations?: Array<{ hashtag: Hashtag }>;
};
export type MemoriesDbCreationFields = Omit<MemoriesDbEntity, 'createdAt' | 'hashtagRelations'> & {
  hashtags: string[]; // Array of hashtag names (e.g., ["happy", "memory"]) - used for input only
};

/**
 * Normalize hashtag name: remove #, lowercase, trim
 */
function normalizeHashtag(hashtag: string): string | null {
  const normalized = hashtag.replace(/^#+/, '').toLowerCase().trim();
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

const create = async (userId: string, fields: MemoriesDbCreationFields): Promise<Memory> => {
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
  create,
};
