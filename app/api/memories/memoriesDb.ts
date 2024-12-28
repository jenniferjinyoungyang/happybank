import { Memory } from '@prisma/client';
import prisma from '../../../lib/prisma';

export declare namespace MemoriesDb {
  type Entity = Omit<Memory, 'id' | 'userId'>;
  type CreationFields = Omit<Entity, 'createdAt'>;
}

const findAll = async (userId: string): Promise<MemoriesDb.Entity[]> =>
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

const create = async (
  userId: string,
  fields: MemoriesDb.CreationFields,
): Promise<Memory> =>
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
