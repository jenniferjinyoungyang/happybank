import { ApiResult } from '../_types/apiResult';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

export const updateProfileImage = async (image: string | null): Promise<ApiResult<UserProfile>> => {
  try {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image }),
    });

    if (!response.ok) {
      const { message } = (await response.json()) as { message: string };
      return {
        isSuccess: false,
        error: message,
      };
    }

    const { user } = (await response.json()) as { user: UserProfile };
    return {
      isSuccess: true,
      data: user,
    };
  } catch {
    return {
      isSuccess: false,
      error: 'An unexpected error occurred while updating profile image',
    };
  }
};
