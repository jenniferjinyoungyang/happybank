import { Memory } from '../../_shared/_types/memory';
import { ApiResult } from '../../_shared/_utils/apiResult';

export const getMemory = async (): Promise<ApiResult<Memory[]>> => {
  try {
    const res = await fetch('/api/memories');
    const data = (await res.json()) as Memory[];
    return { isSuccess: true, data }; // TODO proper mapping
  } catch (err) {
    return { isSuccess: false, error: 'unknown error' }; // TODO proper error message
  }
};
