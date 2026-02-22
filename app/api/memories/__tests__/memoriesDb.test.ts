import { Memory } from '@prisma/client';
import prisma from '../../../../lib/prisma';
import { memoriesDb } from '../memoriesDb';

jest.mock('../../../../lib/prisma', () => ({
  __esModule: true,
  default: {
    memory: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as unknown as {
  memory: {
    findMany: jest.Mock;
    create: jest.Mock;
  };
};

describe('memoriesDb', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return memories with hashtagRelations for a user', async () => {
      const userId = 'user123';
      const mockMemories = [
        {
          createdAt: new Date('2024-01-01'),
          title: 'Test Memory',
          message: 'Test message',
          hashtagRelations: [
            {
              hashtag: {
                id: 1,
                name: 'Happy',
                createdAt: new Date('2024-01-01'),
              },
            },
          ],
          imageId: 'image123',
        },
      ];

      mockPrisma.memory.findMany.mockResolvedValue(mockMemories as never);

      const result = await memoriesDb.findAll(userId);

      expect(mockPrisma.memory.findMany).toHaveBeenCalledWith({
        where: { userId },
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

      expect(result).toEqual(mockMemories);
    });

    it('should return empty array when user has no memories', async () => {
      const userId = 'user123';
      mockPrisma.memory.findMany.mockResolvedValue([]);

      const result = await memoriesDb.findAll(userId);

      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create memory with hashtag relations', async () => {
      const userId = 'user123';
      const fields = {
        title: 'New Memory',
        message: 'New message',
        hashtags: ['Happy', 'Memory'],
        imageId: 'image123',
      };

      const mockCreatedMemory = {
        id: 1,
        userId,
        title: 'New Memory',
        message: 'New message',
        createdAt: new Date('2024-01-01'),
        imageId: 'image123',
        hashtagRelations: [
          {
            id: 1,
            memoryId: 1,
            hashtagId: 1,
            hashtag: {
              id: 1,
              name: 'Happy',
              createdAt: new Date('2024-01-01'),
            },
          },
          {
            id: 2,
            memoryId: 1,
            hashtagId: 2,
            hashtag: {
              id: 2,
              name: 'Memory',
              createdAt: new Date('2024-01-01'),
            },
          },
        ],
      } as Memory;

      mockPrisma.memory.create.mockResolvedValue(mockCreatedMemory);

      const result = await memoriesDb.create(userId, fields);

      expect(mockPrisma.memory.create).toHaveBeenCalledWith({
        data: {
          userId,
          title: 'New Memory',
          message: 'New message',
          imageId: 'image123',
          hashtagRelations: {
            create: [
              {
                hashtag: {
                  connectOrCreate: {
                    where: { name: 'Happy' },
                    create: { name: 'Happy' },
                  },
                },
              },
              {
                hashtag: {
                  connectOrCreate: {
                    where: { name: 'Memory' },
                    create: { name: 'Memory' },
                  },
                },
              },
            ],
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

      expect(result).toEqual(mockCreatedMemory);
    });

    it('should normalize hashtags by removing # prefix', async () => {
      const userId = 'user123';
      const fields = {
        title: 'Test',
        message: 'Test',
        hashtags: ['#Happy', '#Memory'],
        imageId: null,
      };

      const mockCreatedMemory = {
        id: 1,
        userId,
        title: 'Test',
        message: 'Test',
        createdAt: new Date(),
        imageId: null,
        hashtagRelations: [],
      } as Memory;

      mockPrisma.memory.create.mockResolvedValue(mockCreatedMemory);

      await memoriesDb.create(userId, fields);

      expect(mockPrisma.memory.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            hashtagRelations: {
              create: [
                expect.objectContaining({
                  hashtag: expect.objectContaining({
                    connectOrCreate: expect.objectContaining({
                      where: { name: 'Happy' },
                      create: { name: 'Happy' },
                    }),
                  }),
                }),
                expect.objectContaining({
                  hashtag: expect.objectContaining({
                    connectOrCreate: expect.objectContaining({
                      where: { name: 'Memory' },
                      create: { name: 'Memory' },
                    }),
                  }),
                }),
              ],
            },
          }),
        }),
      );
    });

    it('should preserve hashtag capitalization', async () => {
      const userId = 'user123';
      const fields = {
        title: 'Test',
        message: 'Test',
        hashtags: ['Happy', 'MEMORY', 'special'],
        imageId: null,
      };

      const mockCreatedMemory = {
        id: 1,
        userId,
        title: 'Test',
        message: 'Test',
        createdAt: new Date(),
        imageId: null,
        hashtagRelations: [],
      } as Memory;

      mockPrisma.memory.create.mockResolvedValue(mockCreatedMemory);

      await memoriesDb.create(userId, fields);

      const createCall = mockPrisma.memory.create.mock.calls[0][0];
      const hashtagNames = createCall.data.hashtagRelations.create.map(
        (rel: { hashtag: { connectOrCreate: { where: { name: string } } } }) =>
          rel.hashtag.connectOrCreate.where.name,
      );

      expect(hashtagNames).toEqual(['Happy', 'MEMORY', 'special']);
    });

    it('should remove duplicate hashtags', async () => {
      const userId = 'user123';
      const fields = {
        title: 'Test',
        message: 'Test',
        hashtags: ['Happy', 'happy', 'Happy'],
        imageId: null,
      };

      const mockCreatedMemory = {
        id: 1,
        userId,
        title: 'Test',
        message: 'Test',
        createdAt: new Date(),
        imageId: null,
        hashtagRelations: [],
      } as Memory;

      mockPrisma.memory.create.mockResolvedValue(mockCreatedMemory);

      await memoriesDb.create(userId, fields);

      const createCall = mockPrisma.memory.create.mock.calls[0][0];
      const hashtagNames = createCall.data.hashtagRelations.create.map(
        (rel: { hashtag: { connectOrCreate: { where: { name: string } } } }) =>
          rel.hashtag.connectOrCreate.where.name,
      );

      // Should preserve case but remove exact duplicates
      expect(hashtagNames).toEqual(['Happy', 'happy']);
    });

    it('should filter out empty hashtags', async () => {
      const userId = 'user123';
      const fields = {
        title: 'Test',
        message: 'Test',
        hashtags: ['Happy', '', '   ', '#'],
        imageId: null,
      };

      const mockCreatedMemory = {
        id: 1,
        userId,
        title: 'Test',
        message: 'Test',
        createdAt: new Date(),
        imageId: null,
        hashtagRelations: [],
      } as Memory;

      mockPrisma.memory.create.mockResolvedValue(mockCreatedMemory);

      await memoriesDb.create(userId, fields);

      const createCall = mockPrisma.memory.create.mock.calls[0][0];
      const hashtagCount = createCall.data.hashtagRelations.create.length;

      expect(hashtagCount).toBe(1);
      expect(createCall.data.hashtagRelations.create[0].hashtag.connectOrCreate.where.name).toBe(
        'Happy',
      );
    });
  });
});
