export type ApiDataLoadingStatus = {
  readonly status: 'loading';
  readonly data: null;
  readonly error: null;
};

export type ApiDataLoadedStatus<T> = {
  readonly status: 'loaded';
  readonly data: T;
  readonly error: null;
};

export type ApiDataErrorStatus = {
  readonly status: 'error';
  readonly data: null;
  readonly error: string;
};

export type ApiDataStatus<T> = ApiDataLoadingStatus | ApiDataLoadedStatus<T> | ApiDataErrorStatus;

export const getLoadingStatus: <T>() => ApiDataStatus<T> = () => ({
  status: 'loading',
  data: null,
  error: null,
});
