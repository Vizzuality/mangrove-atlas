import { analysisAtom } from 'store/analysis';
import { drawingToolAtom } from 'store/drawing-tool';

import { useQuery } from '@tanstack/react-query';
import type { QueryObserverOptions } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';

import { WidgetSlugType } from 'types/widget';

import API, { AnalysisAPI } from 'services/api';

type UploadFileResponse = {
  data: GeoJSON.FeatureCollection;
};

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
  const data = new FormData();
  data.append('file', file);

  return useQuery(['converter'], () => fetchUploadFile(data), {
    ...queryOptions,
    enabled: !!file,
    onSuccess: (geojson) => {
      onUploadFile?.(geojson);
    },
  });
};

const fetchAnalysis = (
  geojson: UploadFileResponse['data'],
  widgetKey: Extract<
    WidgetSlugType,
    | 'mangrove_habitat_extent'
    | 'mangrove_height'
    | 'mangrove_biomass'
    | 'mangrove_net_change'
    | 'mangrove_blue_carbon'
  >
) =>
  AnalysisAPI.request<UploadFileResponse>({
    method: 'post',
    url: '/analysis',
    data: {
      geometry: geojson,
    },
    params: {
      'widgets[]': widgetKey,
    },
  }).then(({ data }) => data);

export const useGenericAnalysisData = (
  widgetKey: Parameters<typeof fetchAnalysis>[1],
  queryOptions?: QueryObserverOptions
) => {
  const { uploadedGeojson, customGeojson } = useRecoilValue(drawingToolAtom);
  const { enabled: analysisEnabled } = useRecoilValue(analysisAtom);

  return useQuery(
    ['analysis', widgetKey],
    () => fetchAnalysis(customGeojson || uploadedGeojson, widgetKey),
    {
      enabled: analysisEnabled,
      ...queryOptions,
    }
  );
};
