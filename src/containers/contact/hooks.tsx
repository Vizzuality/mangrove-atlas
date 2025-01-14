import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

type ErrorType<Error> = AxiosError<Error>;
export const AXIOS_INSTANCE = Axios.create({ baseURL: env.NEXT_PUBLIC_API_URL });

export const API = <T,>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then((response) => response.data);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export type DatasetEditSuggestionRequestData = {
  name: string;
  organization: string;
  email: string;
  topic: string;
  message: string;
};

export interface DatasetEditSuggestionRequest {
  data: DatasetEditSuggestionRequestData;
}

type SecondParameter<T extends (...args: any) => any> = T extends (
  config: any,
  args: infer P
) => any
  ? P
  : never;

export const postDatasetEditSuggestions = (
  datasetEditSuggestionRequest: DatasetEditSuggestionRequest,
  options?: SecondParameter<typeof API>
) => {
  return API<any>(
    {
      url: `/dataset-edit-suggestions`,
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: datasetEditSuggestionRequest,
    },
    options
  );
};

export const usePostDatasetEditSuggestions = <
  TError = ErrorType<Error>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postDatasetEditSuggestions>>,
    TError,
    { data: DatasetEditSuggestionRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getPostDatasetEditSuggestionsMutationOptions(options);

  return useMutation(mutationOptions);
};
