import { ApiResult } from '../../_shared/_utils/apiResult';

export type UserCreationFields = {
  email: string;
  name: string;
  password: string;
};

export const createUser = async (data: UserCreationFields): Promise<ApiResult<null>> => {
  try {
    const response = await fetch('/api/auth/sign-up', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json',
      },
    });

    if (!response.ok) {
      const { message } = (await response.json()) as { message: string };
      return {
        isSuccess: false,
        error: message,
      };
    }
    return { isSuccess: true, data: null };
  } catch (err) {
    return { isSuccess: false, error: 'unknown error' };
  }
};
