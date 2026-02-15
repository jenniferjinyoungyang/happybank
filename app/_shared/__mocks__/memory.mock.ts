import { makeMock } from '../../../test-helper/makeMock';
import { Memory } from '../_types/memory';

export const makeMemoryMock = makeMock<Memory>({
  title: 'Test title',
  message: 'mock memory for testing purposes',
  createdAt: new Date('2024-12-30T10:00:00.000-05:00'),
  hashtagRelations: [],
  imageId: 'ginger_hello',
});
