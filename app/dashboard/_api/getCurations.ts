import { ApiResult } from '../../_shared/_types/apiResult';

export type TopHashtag = {
  readonly id: number;
  readonly name: string;
  readonly count: number;
  readonly imageId: string | null;
};

export const getCurations = async (): Promise<ApiResult<TopHashtag[]>> => {
  try {
    const response = await fetch('/api/memories/curations');

    if (!response.ok) {
      const { message } = (await response.json()) as { message: string };
      return { isSuccess: false, error: message };
    }

    return { isSuccess: true, data: await response.json() };
  } catch {
    return { isSuccess: false, error: 'unknown error' };
  }
};
