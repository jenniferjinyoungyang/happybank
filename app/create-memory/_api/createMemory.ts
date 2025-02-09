import { ApiResult } from '../../_shared/_types/apiResult';
import { MemoryCreationFields } from '../../_shared/_types/memory';

export const createMemory = async (data: MemoryCreationFields): Promise<ApiResult<null>> => {
  try {
    const response = await fetch('/api/memories', {
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
