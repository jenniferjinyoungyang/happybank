import { makeMock } from '../../../test-helper/makeMock';
import { MemoryCreationFields } from '../_types/memory';

export const makeMemoryCreationFieldsMock = makeMock<MemoryCreationFields>({
  title: 'Test title',
  message: 'mock memory for testing purposes',
  hashtags: ['test'], // Input format - will be normalized and converted to relations
  imageId: 'ginger_hello',
});
