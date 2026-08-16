import { getMemoryStats } from '../getMemoryStats';

describe('getMemoryStats', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns stats when response is ok', async () => {
    const stats = {
      memoryCount: 10,
      hashtagCount: 3,
      oldestMemoryDate: '2024-01-01',
      latestMemoryDate: '2024-12-31',
    };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(stats),
    } as unknown as Response);

    const result = await getMemoryStats();

    expect(result).toEqual({ isSuccess: true, data: stats });
  });

  it('returns error message when response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ message: 'Failed to fetch stats' }),
    } as unknown as Response);

    const result = await getMemoryStats();

    expect(result).toEqual({ isSuccess: false, error: 'Failed to fetch stats' });
  });

  it('returns unknown error when fetch throws', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    const result = await getMemoryStats();

    expect(result).toEqual({ isSuccess: false, error: 'unknown error' });
  });
});
