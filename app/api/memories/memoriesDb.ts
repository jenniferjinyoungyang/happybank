import { Memory } from '@prisma/client';
import prisma from '../../../lib/prisma';

export declare namespace MemoriesDb {
  type Entity = Omit<Memory, 'id' | 'userId'>;
  type CreationInputFields = Omit<Entity, 'createdAt'>;
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
    },
  });

const create = async (
  userId: string,
  fields: MemoriesDb.CreationInputFields,
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
