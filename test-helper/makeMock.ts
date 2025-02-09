import { ApiErrorResult, ApiSuccessResult } from '../app/_shared/_types/apiResult';

export const makeMock =
  <T>(baseEntity: T) =>
  (partialEntity?: Partial<T>): T => ({
    ...baseEntity,
    ...partialEntity,
  });

export const makeApiErrorMock = (error?: string): ApiErrorResult => ({
  isSuccess: false,
  error: error ?? 'error occurred',
});

export const makeApiSuccessMock = <T>(data: T): ApiSuccessResult<T> => ({
  isSuccess: true,
  data,
});
