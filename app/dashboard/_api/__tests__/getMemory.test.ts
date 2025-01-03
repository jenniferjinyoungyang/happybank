import { makeFetchResponseMock } from '../../../_shared/__mocks__/fetchResponse.mock';
import { makeMemoryMock } from '../../../_shared/__mocks__/memory.mock';
import { getMemory } from '../getMemory';

describe('getMemory', () => {
  let fetchSpy: jest.SpyInstance<ReturnType<typeof fetch>>;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  it('should return a memory on success', async () => {
    fetchSpy.mockResolvedValue(makeFetchResponseMock({ json: async () => makeMemoryMock() }));

    const apiMemoryResult = await getMemory();

    expect(apiMemoryResult).toEqual({ isSuccess: true, data: makeMemoryMock() });
  });

  it('should return error message on error', async () => {
    fetchSpy.mockRejectedValue(makeFetchResponseMock({ ok: false, status: 500 }));

    const apiMemoryResult = await getMemory();

    expect(apiMemoryResult).toEqual({ isSuccess: false, error: 'unknown error' });
  });
});
