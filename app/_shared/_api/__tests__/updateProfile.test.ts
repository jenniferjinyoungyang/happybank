import { updateProfileImage } from '../updateProfile';

describe('updateProfileImage', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('returns success result when profile update succeeds', async () => {
    const mockUser = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      image: 'https://example.com/avatar.jpg',
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ user: mockUser }),
    } as unknown as Response);

    const result = await updateProfileImage('https://example.com/avatar.jpg');

    expect(result).toEqual({
      isSuccess: true,
      data: mockUser,
    });
    expect(global.fetch).toHaveBeenCalledWith('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: 'https://example.com/avatar.jpg' }),
    });
  });

  it('returns error result with server message when response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ message: 'Database error' }),
    } as unknown as Response);

    const result = await updateProfileImage('https://example.com/avatar.jpg');

    expect(result).toEqual({
      isSuccess: false,
      error: 'Database error',
    });
  });

  it('returns fallback error result when response is not ok and json parse fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
    } as unknown as Response);

    const result = await updateProfileImage('https://example.com/avatar.jpg');

    expect(result).toEqual({
      isSuccess: false,
      error: 'Failed to update profile image',
    });
  });

  it('returns error result when fetch throws an exception', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    const result = await updateProfileImage('https://example.com/avatar.jpg');

    expect(result).toEqual({
      isSuccess: false,
      error: 'An unexpected error occurred while updating profile image',
    });
  });
});
