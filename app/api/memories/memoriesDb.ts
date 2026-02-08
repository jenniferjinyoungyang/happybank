import { Memory } from '@prisma/client';
import prisma from '../../../lib/prisma';

export type MemoriesDbEntity = Omit<Memory, 'id' | 'userId'>;
export type MemoriesDbCreationFields = Omit<MemoriesDbEntity, 'createdAt'>;

const findAll = async (userId: string): Promise<MemoriesDbEntity[]> =>
  prisma.memory.findMany({
    where: {
      userId,
    },
    select: {
      createdAt: true,
      title: true,
      message: true,
      hashtag: true,
      imageId: true,
    },
  });

const create = async (userId: string, fields: MemoriesDbCreationFields): Promise<Memory> =>
  prisma.memory.create({
    data: {
      userId,
      ...fields,
    },
  });

export const memoriesDb = {
  findAll,
  create,
};
