import { makeFetchResponseMock } from '../../../_shared/__mocks__/fetchResponse.mock';
import { makeMemoryCreationFieldsMock } from '../../../_shared/__mocks__/memoryCreationFields.mock';
import { createMemory } from '../createMemory';

describe('createMemory', () => {
  let fetchSpy: jest.SpyInstance<ReturnType<typeof fetch>>;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  test('returns success when API call is successful', async () => {
    fetchSpy.mockResolvedValueOnce(makeFetchResponseMock());

    const result = await createMemory(makeMemoryCreationFieldsMock());

    expect(result).toStrictEqual({
      data: null,
      isSuccess: true,
    });
  });

  test('returns error when API call fails with a message', async () => {
    const errorMessage = 'failed to create a memory';
    fetchSpy.mockResolvedValueOnce(
      makeFetchResponseMock({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ message: errorMessage }),
      }),
    );

    const result = await createMemory(makeMemoryCreationFieldsMock());

    expect(result).toStrictEqual({ isSuccess: false, error: errorMessage });
  });

  test('returns unknown error when fetch throws an error', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('Network error'));

    const result = await createMemory(makeMemoryCreationFieldsMock());

    expect(result).toStrictEqual({ isSuccess: false, error: 'unknown error' });
  });
});
