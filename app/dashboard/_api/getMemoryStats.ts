import { ApiResult } from '../../_shared/_types/apiResult';

export type MemoryStats = {
  readonly memoryCount: number;
  readonly hashtagCount: number;
  readonly oldestMemoryDate: string | null;
  readonly latestMemoryDate: string | null;
};

export const getMemoryStats = async (): Promise<ApiResult<MemoryStats>> => {
  try {
    const response = await fetch('/api/memories/stats');

    if (!response.ok) {
      const { message } = (await response.json()) as { message: string };
      return { isSuccess: false, error: message };
    }

    return { isSuccess: true, data: await response.json() };
  } catch {
    return { isSuccess: false, error: 'unknown error' };
  }
};
