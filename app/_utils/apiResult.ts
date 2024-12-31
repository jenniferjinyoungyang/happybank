type ApiSuccessResult<T> = { isSuccess: true; data: T };

type ApiErrorResult = { isSuccess: false; error: string };

export type ApiResult<T> = ApiSuccessResult<T> | ApiErrorResult;
