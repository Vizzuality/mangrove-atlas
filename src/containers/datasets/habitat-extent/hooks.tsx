import { useCallback, useMemo } from 'react';

import type { LayerProps, SourceProps } from 'react-map-gl';

import { analysisAtom } from '@/store/analysis';
import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError, CanceledError } from 'axios';
import { useAtomValue } from 'jotai';

import type { AnalysisResponse } from 'hooks/analysis';
import { useSyncLocation } from 'hooks/use-sync-location';

import { useLocation } from '@/containers/datasets/locations/hooks';

import { Visibility } from '@/types/layers';
import type { UseParamsOptions } from 'types/widget';

import API, { AnalysisAPI } from 'services/api';

import { getHabitatExtentData } from './get-data';
import type { DataResponse, ExtentData } from './types';

export const widgetSlug = 'habitat-extent';

// widget data
export function useMangroveHabitatExtent(
  params: UseParamsOptions,
  queryOptions: Omit<UseQueryOptions<ExtentData>, 'queryKey' | 'queryFn'> = {},
  onCancel?: () => void
) {
  const { type: locationType, id } = useSyncLocation();
  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(id, locationType);
  const { enabled: isAnalysisEnabled } = useAtomValue(analysisAtom);
  const { customGeojson } = useAtomValue(drawingToolAtom);
  const { uploadedGeojson } = useAtomValue(drawingUploadToolAtom);

  const geojson = customGeojson || uploadedGeojson;

  const fetchHabitatExtent = useCallback(
    ({ signal }: { signal?: AbortSignal }) => {
      if (isAnalysisEnabled) {
        return AnalysisAPI.request<AnalysisResponse<DataResponse> | AxiosError>({
          method: 'post',
          url: '',
          data: {
            geometry: geojson,
          },
          params: {
            'widgets[]': 'mangrove_extent',
          },
          signal,
        })
          .then(({ data }) => data['mangrove_extent'])
          .catch((err: CanceledError<unknown> | AxiosError) => {
            if (err.code === 'ERR_CANCELED') onCancel?.();
            return err;
          });
      }

      return API.request<DataResponse>({
        method: 'GET',
        url: 'widgets/habitat_extent',
        params: {
          ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
          ...params,
        },
      }).then((response) => response.data);
    },
    [isAnalysisEnabled, geojson, location_id, currentLocation, params, onCancel]
  );

  const query = useQuery({
    queryKey: [widgetSlug, location_id, geojson],
    queryFn: fetchHabitatExtent,
    placeholderData: {
      data: [],
      metadata: {
        units: {
          habitat_extent_area: null,
          linear_coverage: null,
        },
      },
    },
    ...queryOptions,
  });

  const { data, isFetched, isFetching, isError, refetch } = query;
  const noData =
    location_id === 'custom-area'
      ? isFetched && data?.data?.reduce((acc, value) => acc + value.value, 0) === 0
      : isFetched && !data?.data?.length;

  const { unit, year } = params;
  const DATA = useMemo(
    () => getHabitatExtentData({ data, unit, year, location, noData, widgetSlug }),
    [data, unit, year, location, noData]
  );

  return useMemo(() => {
    return {
      isFetching,
      isError,
      refetch,
      data: DATA,
    };
  }, [data, isFetching, isError, refetch, DATA]);
}

// NOTE: the habitat-extent layer defines its sources inline in layer.tsx, not
// via this hook. Kept for parity with other datasets / potential reuse.
export function useSource({ year }: { year: number }): SourceProps {
  return {
    id: `habitat_extent_${year}`,
    type: 'vector',
    url: `mapbox://globalmangrovewatch.gmw-v4-extent-${year}`,
  };
}

export function useLayers({
  year,
  id,
  opacity,
  visibility = 'visible',
}: {
  year: number;
  id: LayerProps['id'];
  opacity?: number;
  visibility?: Visibility;
}): LayerProps[] {
  return year
    ? [
        {
          id: `${id}_${year}_fill`,
          type: 'fill',
          source: `habitat_extent_${year}`,
          'source-layer': `gmw_v4_extent_${year}`,
          paint: {
            'fill-color': '#06C4BD',
            'fill-opacity': ['interpolate', ['linear'], ['zoom'], 0, opacity * 1.2, 12, opacity],
            'fill-opacity-transition': { duration: 600, delay: 0 },
          },
          layout: {
            visibility,
          },
        },
        {
          id: `${id}_${year}_line`,
          type: 'line',
          source: `habitat_extent_${year}`,
          'source-layer': `gmw_v4_extent_${year}`,
          paint: {
            'line-color': '#06C4BD',
            'line-opacity': opacity,
            'line-width': ['interpolate', ['linear'], ['zoom'], 0, 8, 12, 1],
            'line-blur': ['interpolate', ['linear'], ['zoom'], 0, 50, 12, 0],
            'line-opacity-transition': { duration: 600, delay: 0 },
          },
          layout: {
            visibility,
          },
        },
      ]
    : null;
}
