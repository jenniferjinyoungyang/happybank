import { makeFetchResponseMock } from '../../../_shared/__mocks__/fetchResponse.mock';
import { createUser, UserCreationFields } from '../createUser';

describe('createUser', () => {
  let fetchSpy: jest.SpyInstance<ReturnType<typeof fetch>>;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  const mockUser: UserCreationFields = {
    email: 'test@example.com',
    name: 'Test User',
    password: 'password123!',
  };

  test('returns success when API call is successful', async () => {
    fetchSpy.mockResolvedValueOnce(
      makeFetchResponseMock({
        ok: true,
      }),
    );

    const result = await createUser(mockUser);

    expect(result).toStrictEqual({
      data: null,
      isSuccess: true,
    });
  });

  test('returns error when API call fails with a message', async () => {
    const errorMessage = 'User already exists';
    fetchSpy.mockResolvedValueOnce(
      makeFetchResponseMock({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ message: errorMessage }),
      }),
    );

    const result = await createUser(mockUser);

    expect(result).toStrictEqual({ isSuccess: false, error: errorMessage });
  });

  test('returns unknown error when fetch throws an error', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('Network error'));

    const result = await createUser(mockUser);

    expect(result).toStrictEqual({ isSuccess: false, error: 'unknown error' });
  });
});
