import { makeMock } from '../../../test-helper/makeMock';
import { MemoryCreationFields } from '../_types/memory';

// Type for API input (includes hashtags which gets converted to relations)
type MemoryCreationInput = MemoryCreationFields & {
  hashtags: string[];
};

export const makeMemoryCreationFieldsMock = makeMock<MemoryCreationInput>({
  title: 'Test title',
  message: 'mock memory for testing purposes',
  hashtags: ['test'], // Input format - will be normalized and converted to relations
  imageId: 'ginger_hello',
});
