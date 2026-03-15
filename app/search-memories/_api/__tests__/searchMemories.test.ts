import { makeFetchResponseMock } from '../../../_shared/__mocks__/fetchResponse.mock';
import { makeMemoryMock } from '../../../_shared/__mocks__/memory.mock';
import { searchMemories } from '../searchMemories';

describe('searchMemories', () => {
  let fetchSpy: jest.SpyInstance<ReturnType<typeof fetch>>;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  it('returns success with data when API responds ok', async () => {
    const memories = [makeMemoryMock()];
    fetchSpy.mockResolvedValue(makeFetchResponseMock({ json: async () => memories }));

    const result = await searchMemories({});

    expect(result).toEqual({ isSuccess: true, data: memories });
    expect(fetchSpy).toHaveBeenCalledWith('/api/memories/search?');
  });

  it('appends hashtags to query string', async () => {
    fetchSpy.mockResolvedValue(makeFetchResponseMock({ json: async () => [] }));

    await searchMemories({ hashtags: ['family', 'gratitude'] });

    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/memories/search?hashtags=family&hashtags=gratitude',
    );
  });

  it('appends query (q), from, and to when provided', async () => {
    fetchSpy.mockResolvedValue(makeFetchResponseMock({ json: async () => [] }));

    await searchMemories({
      query: 'beach',
      from: '2024-01-01',
      to: '2024-12-31',
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/memories/search?q=beach&from=2024-01-01&to=2024-12-31',
    );
  });

  it('appends all params when provided', async () => {
    fetchSpy.mockResolvedValue(makeFetchResponseMock({ json: async () => [] }));

    await searchMemories({
      hashtags: ['tag1'],
      query: 'text',
      from: '2024-06-01',
      to: '2024-06-30',
    });

    const callUrl = (fetchSpy.mock.calls[0] as [string])[0];
    expect(callUrl).toContain('hashtags=tag1');
    expect(callUrl).toContain('q=text');
    expect(callUrl).toContain('from=2024-06-01');
    expect(callUrl).toContain('to=2024-06-30');
  });

  it('does not append empty hashtags array', async () => {
    fetchSpy.mockResolvedValue(makeFetchResponseMock({ json: async () => [] }));

    await searchMemories({ hashtags: [] });

    expect(fetchSpy).toHaveBeenCalledWith('/api/memories/search?');
  });

  it('returns error when response is not ok', async () => {
    const errorMessage = 'Server error';
    fetchSpy.mockResolvedValue(
      makeFetchResponseMock({
        ok: false,
        json: jest.fn().mockResolvedValue({ message: errorMessage }),
      }),
    );

    const result = await searchMemories({});

    expect(result).toEqual({ isSuccess: false, error: errorMessage });
  });

  it('returns unknown error when fetch throws', async () => {
    fetchSpy.mockRejectedValue(new Error('Network error'));

    const result = await searchMemories({});

    expect(result).toEqual({ isSuccess: false, error: 'unknown error' });
  });
});
