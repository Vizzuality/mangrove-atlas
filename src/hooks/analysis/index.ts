import { uploadFileAtom } from 'store/upload-file';

import { useQuery } from '@tanstack/react-query';
import type { QueryObserverOptions } from '@tanstack/react-query';
import { useRecoilState } from 'recoil';

import { AnalysisWidgetSlug } from 'types/widget';

import API from 'services/api';

type UploadFileResponse = {
  data: GeoJSON.FeatureCollection;
};

export type AnalysisResponse<T> = Record<AnalysisWidgetSlug, T>;

const fetchUploadFile = (data: FormData) =>
  API.request<UploadFileResponse>({
    method: 'post',
    url: '/spatial_file/converter',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(({ data }) => data);

export const useUploadFile = (
  file: File,
  onUploadFile?: (geojson: UploadFileResponse) => void,
  queryOptions?: QueryObserverOptions<UploadFileResponse>
) => {
  const [, setUploadErrorModal] = useRecoilState(uploadFileAtom);
  const data = new FormData();
  data.append('file', file);

  return useQuery(['converter'], () => fetchUploadFile(data), {
    ...queryOptions,
    enabled: !!file,
    onSuccess: (geojson) => {
      onUploadFile?.(geojson);
    },
    onError: setUploadErrorModal,
  });
};
