import { getCurations } from '../getCurations';

describe('getCurations', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns data when response is ok', async () => {
    const curations = [{ id: 1, name: 'tag', count: 5, imageId: null }];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(curations),
    } as unknown as Response);

    const result = await getCurations();

    expect(result).toEqual({ isSuccess: true, data: curations });
  });

  it('returns error message when response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ message: 'Failed to fetch curations' }),
    } as unknown as Response);

    const result = await getCurations();

    expect(result).toEqual({ isSuccess: false, error: 'Failed to fetch curations' });
  });

  it('returns unknown error when fetch throws', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    const result = await getCurations();

    expect(result).toEqual({ isSuccess: false, error: 'unknown error' });
  });
});
