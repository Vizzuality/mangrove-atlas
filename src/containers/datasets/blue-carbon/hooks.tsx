import type { LayerProps, SourceProps } from 'react-map-gl';

import { analysisAtom } from '@/store/analysis';
import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';

import { CancelledError, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError, CanceledError } from 'axios';
import { useAtomValue } from 'jotai';

import type { AnalysisResponse } from 'hooks/analysis';
import { useSyncLocation } from 'hooks/use-sync-location';

import { useLocation } from '@/containers/datasets/locations/hooks';

import { Visibility } from '@/types/layers';
import type { UseParamsOptions } from 'types/widget';

import API, { AnalysisAPI } from 'services/api';

import { getBlueCarbonData } from './get-data';
import type { BlueCarbon, DataResponse } from './types';

export const widgetSlug = 'blue-carbon';

// widget data
export function useMangroveBlueCarbon(
  params?: UseParamsOptions,
  queryOptions?: Omit<
    UseQueryOptions<DataResponse, AxiosError | CancelledError, BlueCarbon>,
    'queryKey' | 'queryFn'
  >,
  onCancel?: () => void
) {
  const { type: locationType, id } = useSyncLocation();

  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(id, locationType);
  const { customGeojson } = useAtomValue(drawingToolAtom);
  const { uploadedGeojson } = useAtomValue(drawingUploadToolAtom);
  const { enabled: isAnalysisEnabled } = useAtomValue(analysisAtom);
  const geojson = customGeojson || uploadedGeojson;

  const fetchMangroveBlueCarbon = ({ signal }: { signal?: AbortSignal }) => {
    if (isAnalysisEnabled) {
      return AnalysisAPI.request<AnalysisResponse<DataResponse> | AxiosError>({
        method: 'post',
        url: '',
        data: {
          geometry: geojson,
        },
        params: {
          'widgets[]': 'mangrove_blue_carbon',
        },
        signal,
      })
        .then(({ data }) => data['mangrove_blue_carbon'])
        .catch((err: CanceledError<unknown> | AxiosError) => {
          if (err.code === 'ERR_CANCELED') onCancel?.();
          return err;
        });
    }

    return API.request<DataResponse>({
      method: 'GET',
      url: '/widgets/blue_carbon',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...params,
      },
      ...queryOptions,
    }).then((response) => {
      return response.data;
    });
  };

  return useQuery({
    queryKey: [widgetSlug, params, geojson, location_id],
    queryFn: fetchMangroveBlueCarbon,
    select: (response) => getBlueCarbonData(response, location),
    placeholderData: {
      data: [],
      metadata: {
        soc: null,
        toc: null,
        agb: null,
        units: null,
      },
    },
    ...queryOptions,
  });
}

export function useSource(): SourceProps {
  return {
    id: 'blue-carbon-source',
    type: 'raster',
    tiles: [
      'https://mangrove_atlas.storage.googleapis.com/tilesets/toc_co2eha-1_2016_z0z12/{z}/{x}/{y}.png',
    ],
    minzoom: 0,
    maxzoom: 12,
  };
}
export function useLayer({
  id,
  opacity,
  visibility = 'visible',
}: {
  id: LayerProps['id'];
  opacity?: number;
  visibility?: Visibility;
}): LayerProps {
  return {
    id,
    type: 'raster',
    source: 'blue-carbon-source',
    paint: {
      'raster-opacity': opacity,
    },
    layout: {
      visibility,
    },
  };
}
