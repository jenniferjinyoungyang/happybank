import { makeMock } from '../../../test-helper/makeMock';

export const makeFetchResponseMock = makeMock<Response>({
  json: async () => ({}),
  ok: true,
  status: 200,
} as Response);
