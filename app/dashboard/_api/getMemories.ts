import { Memory } from '../../_types/memory';

export const getMemories = async (): Promise<Memory[] | undefined> => {
  try {
    const res = await fetch('/api/memories');
    const data = await res.json();
    return data as Memory[]; // TODO proper mapping
  } catch (err) {
    console.log(err); // TODO error handling
    return undefined;
  }
};
