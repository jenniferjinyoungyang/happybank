import { memoriesDb } from '../memoriesDb';
import prisma from '../../../../lib/prisma';

jest.mock('../../../../lib/prisma', () => ({
  __esModule: true,
  default: {
    memory: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
    hashtag: {
      count: jest.fn(),
      findUnique: jest.fn(),
    },
    memoryHashtag: {
      groupBy: jest.fn(),
    },
  },
}));

describe('memoriesDb', () => {
  const userId = 'user-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('fetches all memories for a user and maps them', async () => {
      const mockMemories = [
        {
          createdAt: new Date('2026-01-01'),
          title: 'Memory 1',
          message: 'Message 1',
          hashtagRelations: [{ hashtag: { id: 1, name: 'tag1' } }],
          imageId: 'img1',
        },
      ];

      (prisma.memory.findMany as jest.Mock).mockResolvedValue(mockMemories);

      const result = await memoriesDb.findAll(userId);

      expect(result).toEqual(mockMemories);
      expect(prisma.memory.findMany).toHaveBeenCalledWith({
        where: { userId },
        select: {
          createdAt: true,
          title: true,
          message: true,
          hashtagRelations: {
            include: { hashtag: true },
          },
          imageId: true,
        },
      });
    });
  });

  describe('search', () => {
    it('handles query parameter q', async () => {
      const mockResult = [
        {
          createdAt: new Date('2026-01-01'),
          title: 'Happy Memory',
          message: 'Very happy day',
          hashtagRelations: [],
          imageId: 'img-happy',
        },
      ];
      (prisma.memory.findMany as jest.Mock).mockResolvedValue(mockResult);

      const result = await memoriesDb.search(userId, { q: 'happy' });

      expect(result).toEqual(mockResult);

      expect(prisma.memory.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          AND: [
            {
              OR: [
                { title: { contains: 'happy', mode: 'insensitive' } },
                { message: { contains: 'happy', mode: 'insensitive' } },
              ],
            },
          ],
        },
        orderBy: { createdAt: 'desc' },
        select: expect.any(Object),
      });
    });

    it('handles from and to date params', async () => {
      (prisma.memory.findMany as jest.Mock).mockResolvedValue([]);

      await memoriesDb.search(userId, { from: '2026-01-01', to: '2026-01-31' });

      expect(prisma.memory.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          AND: [
            {
              createdAt: {
                gte: new Date('2026-01-01'),
                lte: new Date('2026-01-31'),
              },
            },
          ],
        },
        orderBy: { createdAt: 'desc' },
        select: expect.any(Object),
      });
    });

    it('handles from date param alone', async () => {
      (prisma.memory.findMany as jest.Mock).mockResolvedValue([]);

      await memoriesDb.search(userId, { from: '2026-01-01' });

      expect(prisma.memory.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          AND: [
            {
              createdAt: {
                gte: new Date('2026-01-01'),
              },
            },
          ],
        },
        orderBy: { createdAt: 'desc' },
        select: expect.any(Object),
      });
    });

    it('handles to date param alone', async () => {
      (prisma.memory.findMany as jest.Mock).mockResolvedValue([]);

      await memoriesDb.search(userId, { to: '2026-01-31' });

      expect(prisma.memory.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          AND: [
            {
              createdAt: {
                lte: new Date('2026-01-31'),
              },
            },
          ],
        },
        orderBy: { createdAt: 'desc' },
        select: expect.any(Object),
      });
    });

    it('handles hashtags array parameter', async () => {
      (prisma.memory.findMany as jest.Mock).mockResolvedValue([]);

      await memoriesDb.search(userId, { hashtags: ['#first', 'second', '  '] });

      expect(prisma.memory.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          AND: [
            {
              hashtagRelations: {
                some: {
                  hashtag: {
                    name: { in: ['first', 'second'], mode: 'insensitive' },
                  },
                },
              },
            },
          ],
        },
        orderBy: { createdAt: 'desc' },
        select: expect.any(Object),
      });
    });

    it('handles empty hashtags filter array gracefully', async () => {
      (prisma.memory.findMany as jest.Mock).mockResolvedValue([]);

      await memoriesDb.search(userId, { hashtags: ['   ', '###'] }); // resolves to empty tagNames

      expect(prisma.memory.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: expect.any(Object),
      });
    });

    it('returns empty array search query when no parameters are passed', async () => {
      (prisma.memory.findMany as jest.Mock).mockResolvedValue([]);

      await memoriesDb.search(userId, {});

      expect(prisma.memory.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: expect.any(Object),
      });
    });
  });

  describe('getStats', () => {
    it('returns stats including counts and oldest/latest memory dates', async () => {
      const oldestDate = new Date('2026-01-01');
      const latestDate = new Date('2026-02-01');

      (prisma.memory.count as jest.Mock).mockResolvedValue(10);
      (prisma.memory.findFirst as jest.Mock)
        .mockResolvedValueOnce({ createdAt: oldestDate })
        .mockResolvedValueOnce({ createdAt: latestDate });
      (prisma.hashtag.count as jest.Mock).mockResolvedValue(5);

      const stats = await memoriesDb.getStats(userId);

      expect(stats).toEqual({
        memoryCount: 10,
        hashtagCount: 5,
        oldestMemoryDate: oldestDate,
        latestMemoryDate: latestDate,
      });
    });

    it('returns null for dates if no memories exist', async () => {
      (prisma.memory.count as jest.Mock).mockResolvedValue(0);
      (prisma.memory.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.hashtag.count as jest.Mock).mockResolvedValue(0);

      const stats = await memoriesDb.getStats(userId);

      expect(stats).toEqual({
        memoryCount: 0,
        hashtagCount: 0,
        oldestMemoryDate: null,
        latestMemoryDate: null,
      });
    });
  });

  describe('create', () => {
    it('normalizes, deduplicates hashtags and creates a memory', async () => {
      const fields = {
        title: 'New Memory',
        message: 'Hello world',
        hashtags: ['#fun', '  #joy  ', 'fun', '  ', '##super'],
        imageId: 'img-1',
      };

      (prisma.memory.create as jest.Mock).mockResolvedValue({
        id: 'new-id',
        userId,
        title: 'New Memory',
        message: 'Hello world',
        imageId: 'img-1',
      });

      await memoriesDb.create(userId, fields);

      expect(prisma.memory.create).toHaveBeenCalledWith({
        data: {
          userId,
          title: 'New Memory',
          message: 'Hello world',
          imageId: 'img-1',
          hashtagRelations: {
            create: [
              {
                hashtag: {
                  connectOrCreate: {
                    where: { name: 'fun' },
                    create: { name: 'fun' },
                  },
                },
              },
              {
                hashtag: {
                  connectOrCreate: {
                    where: { name: 'joy' },
                    create: { name: 'joy' },
                  },
                },
              },
              {
                hashtag: {
                  connectOrCreate: {
                    where: { name: 'super' },
                    create: { name: 'super' },
                  },
                },
              },
            ],
          },
        },
        include: {
          hashtagRelations: {
            include: { hashtag: true },
          },
        },
      });
    });
  });

  describe('getTopHashtags', () => {
    it('returns empty array if no group tags found', async () => {
      (prisma.memoryHashtag.groupBy as jest.Mock).mockResolvedValue([]);

      const result = await memoriesDb.getTopHashtags(userId);
      expect(result).toEqual([]);
    });

    it('returns mapped top hashtags, handles missing hashtags, latest image lookup, and fallback lookup', async () => {
      const mockTopTags = [
        { hashtagId: 1, _count: { memoryId: 10 } },
        { hashtagId: 2, _count: { memoryId: 5 } },
        { hashtagId: 3, _count: { memoryId: 2 } },
      ];

      (prisma.memoryHashtag.groupBy as jest.Mock).mockResolvedValue(mockTopTags);

      // hashtag findUnique results
      (prisma.hashtag.findUnique as jest.Mock)
        .mockResolvedValueOnce({ name: 'tag1' })
        .mockResolvedValueOnce(null) // test continue when hashtag not found
        .mockResolvedValueOnce({ name: 'tag3' });

      // memory findFirst results:
      // tag1 finds memory with image
      // tag3 does not find memory with image, falls back to absolute latest memory (without image)
      (prisma.memory.findFirst as jest.Mock)
        .mockResolvedValueOnce({ imageId: 'image-1' }) // tag1 with image
        .mockResolvedValueOnce(null) // tag3 with image (not found)
        .mockResolvedValueOnce({ imageId: null }); // tag3 fallback (found absolute latest)

      const result = await memoriesDb.getTopHashtags(userId);

      expect(result).toEqual([
        { id: 1, name: 'tag1', count: 10, imageId: 'image-1' },
        { id: 3, name: 'tag3', count: 2, imageId: null },
      ]);

      // Check specific calls
      expect(prisma.hashtag.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: { name: true },
      });
      expect(prisma.hashtag.findUnique).toHaveBeenCalledWith({
        where: { id: 2 },
        select: { name: true },
      });
      expect(prisma.hashtag.findUnique).toHaveBeenCalledWith({
        where: { id: 3 },
        select: { name: true },
      });

      // Verify tag1 image lookup calls
      expect(prisma.memory.findFirst).toHaveBeenNthCalledWith(1, {
        where: {
          userId,
          imageId: { not: null },
          hashtagRelations: { some: { hashtagId: 1 } },
        },
        orderBy: { createdAt: 'desc' },
        select: { imageId: true },
      });

      // Verify tag3 image lookup calls (with image first, then fallback)
      expect(prisma.memory.findFirst).toHaveBeenNthCalledWith(2, {
        where: {
          userId,
          imageId: { not: null },
          hashtagRelations: { some: { hashtagId: 3 } },
        },
        orderBy: { createdAt: 'desc' },
        select: { imageId: true },
      });

      expect(prisma.memory.findFirst).toHaveBeenNthCalledWith(3, {
        where: {
          userId,
          hashtagRelations: { some: { hashtagId: 3 } },
        },
        orderBy: { createdAt: 'desc' },
        select: { imageId: true },
      });
    });
  });
});
