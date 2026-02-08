import { ApiResult } from '../../_shared/_types/apiResult';
import { Memory } from '../../_shared/_types/memory';

export const getMemory = async (): Promise<ApiResult<Memory | null>> => {
  try {
    const response = await fetch('/api/memories');

    if (!response.ok) {
      const { message } = (await response.json()) as { message: string };
      return {
        isSuccess: false,
        error: message,
      };
    }

    return { isSuccess: true, data: await response.json() };
  } catch {
    return { isSuccess: false, error: 'unknown error' };
  }
};
