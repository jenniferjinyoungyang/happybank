import { ApiResult } from '../../_shared/_types/apiResult';
import { Memory } from '../../_shared/_types/memory';

export type SearchMemoriesRequest = {
  readonly hashtags?: string[];
  readonly query?: string;
  readonly from?: string;
  readonly to?: string;
};

export const searchMemories = async (
  params: SearchMemoriesRequest,
): Promise<ApiResult<Memory[]>> => {
  try {
    const searchParams = new URLSearchParams();

    if (params.hashtags && params.hashtags.length > 0) {
      params.hashtags.forEach((tag) => searchParams.append('hashtags', tag));
    }

    if (params.query) {
      searchParams.set('q', params.query);
    }

    if (params.from) {
      searchParams.set('from', params.from);
    }

    if (params.to) {
      searchParams.set('to', params.to);
    }

    const response = await fetch(`/api/memories/search?${searchParams.toString()}`);

    if (!response.ok) {
      const { message } = (await response.json()) as { message: string };
      return {
        isSuccess: false,
        error: message,
      };
    }

    return { isSuccess: true, data: (await response.json()) as Memory[] };
  } catch {
    return { isSuccess: false, error: 'unknown error' };
  }
};

