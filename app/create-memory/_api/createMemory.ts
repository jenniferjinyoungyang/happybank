import { MemoryCreationFields } from '../../_types/memory';
import { ApiResult } from '../../_utils/apiResult';

export const createMemory = async (data: MemoryCreationFields): Promise<ApiResult<null>> => {
  try {
    fetch('/api/memories', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json',
      },
    });
    return { isSuccess: true, data: null };
  } catch (err) {
    return { isSuccess: false, error: 'unknown error' }; // TODO proper error message
  }
};
