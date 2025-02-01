import { makeMock } from '../../../test-helper/makeMock';
import { MemoryCreationFields } from '../_types/memory';

export const makeMemoryCreationFieldsMock = makeMock<MemoryCreationFields>({
  title: 'Test title',
  message: 'mock memory for testing purposes',
  hashtag: '#test',
  imageId: 'ginger_hello',
});
