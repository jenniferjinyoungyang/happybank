import { Memory } from '@prisma/client';
import prisma from '../../../../lib/prisma';
import { memoriesDb } from '../memoriesDb';

jest.mock('../../../../lib/prisma', () => ({
  __esModule: true,
  default: {
    memory: {
      findMany: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
    },
    hashtag: {
      count: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as unknown as {
  memory: {
    findMany: jest.Mock;
    create: jest.Mock;
    count: jest.Mock;
    findFirst: jest.Mock;
  };
  hashtag: {
    count: jest.Mock;
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

  describe('stats', () => {
    it('should return memory stats with oldest/latest memory dates', async () => {
      const userId = 'user123';
      const oldest = { createdAt: new Date('2024-01-01T00:00:00.000Z') };
      const latest = { createdAt: new Date('2024-12-31T23:59:59.999Z') };

      mockPrisma.memory.count.mockResolvedValue(7);
      mockPrisma.memory.findFirst
        .mockResolvedValueOnce(oldest as never)
        .mockResolvedValueOnce(latest as never);
      mockPrisma.hashtag.count.mockResolvedValue(3);

      const result = await memoriesDb.getStats(userId);

      expect(mockPrisma.memory.count).toHaveBeenCalledWith({ where: { userId } });
      expect(mockPrisma.memory.findFirst).toHaveBeenNthCalledWith(1, {
        where: { userId },
        orderBy: { createdAt: 'asc' },
        select: { createdAt: true },
      });
      expect(mockPrisma.memory.findFirst).toHaveBeenNthCalledWith(2, {
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      });
      expect(mockPrisma.hashtag.count).toHaveBeenCalledWith({
        where: {
          memories: {
            some: {
              memory: {
                userId,
              },
            },
          },
        },
      });

      expect(result).toEqual({
        memoryCount: 7,
        hashtagCount: 3,
        oldestMemoryDate: oldest.createdAt,
        latestMemoryDate: latest.createdAt,
      });
    });

    it('should return null dates when no memories exist', async () => {
      const userId = 'user123';

      mockPrisma.memory.count.mockResolvedValue(0);
      mockPrisma.memory.findFirst.mockResolvedValue(null as never);
      mockPrisma.hashtag.count.mockResolvedValue(0);

      const result = await memoriesDb.getStats(userId);

      expect(result).toEqual({
        memoryCount: 0,
        hashtagCount: 0,
        oldestMemoryDate: null,
        latestMemoryDate: null,
      });
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
