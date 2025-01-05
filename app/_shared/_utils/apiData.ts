import { match } from 'ts-pattern';

export type ApiDataNotLoaded = {
  readonly status: 'not loaded';
  readonly data: null;
  readonly error: null;
  readonly isLoading: boolean;
};

export type ApiDataLoaded<T> = {
  readonly status: 'loaded';
  readonly data: T;
  readonly error: null;
  readonly isLoading: boolean;
};

export type ApiDataError = {
  readonly status: 'error';
  readonly data: null;
  readonly error: string;
};

export type ApiData<T> = ApiDataNotLoaded | ApiDataLoaded<T> | ApiDataError;

export const getInitialApiDataStatus: <T>() => ApiData<T> = () => ({
  status: 'not loaded',
  data: null,
  error: null,
  isLoading: false,
});

export const setLoadingStatus: <T>(currentStatus?: ApiData<T>) => ApiData<T> = <T>(
  currentStatus?: ApiData<T>,
): ApiData<T> =>
  match(currentStatus)
    .with(
      undefined,
      { status: 'error' },
      { status: 'not loaded' },
      (): ApiDataNotLoaded => ({
        status: 'not loaded',
        data: null,
        error: null,
        isLoading: true,
      }),
    )
    .with(
      { status: 'loaded' },
      ({ data }): ApiDataLoaded<T> => ({
        status: 'loaded',
        data,
        error: null,
        isLoading: true,
      }),
    )
    .exhaustive();

export const isLoadingStatus = <T>(currentStatus: ApiData<T>): boolean =>
  match(currentStatus)
    .with({ status: 'error' }, () => false)
    .with({ status: 'not loaded' }, { status: 'loaded' }, ({ isLoading }) => isLoading)
    .exhaustive();
