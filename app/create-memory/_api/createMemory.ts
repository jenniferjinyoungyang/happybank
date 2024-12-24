import { MemoryCreationFields } from '../../_types/memory';

export const createMemory = async (
  data: MemoryCreationFields,
): Promise<void> => {
  try {
    fetch('/api/memories', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json',
      },
    });
  } catch (err) {
    console.log(err);
  }
};
