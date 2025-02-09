export type ApiSuccessResult<T> = { isSuccess: true; data: T };

export type ApiErrorResult = { isSuccess: false; error: string };

export type ApiResult<T> = ApiSuccessResult<T> | ApiErrorResult;
