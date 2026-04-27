import { useMemo } from 'react';

import type { LayerProps, SourceProps } from 'react-map-gl';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import chroma from 'chroma-js';

import { useSyncLocation } from 'hooks/use-sync-location';

import { useLocation } from '@/containers/datasets/locations/hooks';

import { Visibility } from '@/types/layers';
import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import { COLORS } from './constants';
import type { DataResponse, LayerSettingsType } from './types';

type NationalDashboardResult = DataResponse & { locationIso: string };

const colorsScale = chroma.scale(COLORS).colors(COLORS.length);

// widget data
export function useNationalDashboard(
  params?: UseParamsOptions,
  queryOptions?: Omit<
    UseQueryOptions<DataResponse, Error, NationalDashboardResult>,
    'queryKey' | 'queryFn' | 'select'
  >
) {
  const { type: locationType, id } = useSyncLocation();

  const {
    data: { id: currentLocation, location_id, iso },
  } = useLocation(id, locationType);

  const fetchMangroveNationalDashboard = () =>
    API.request({
      method: 'GET',
      url: '/widgets/national_dashboard',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...params,
      },
    }).then((response) => response.data);

  const queryKey = useMemo(() => {
    return ['national_dashboard', JSON.stringify(params), location_id];
  }, [params, location_id]);

  return useQuery<DataResponse, Error, NationalDashboardResult>({
    queryKey,
    queryFn: fetchMangroveNationalDashboard,
    select: (data: DataResponse) => ({
      ...data,
      locationIso: iso,
    }),
    ...queryOptions,
  });
}

export function useSource({
  settings,
}: {
  settings: LayerSettingsType;
}): (SourceProps & { url: string }) | null {
  if (!settings?.source) return null;

  const url = settings.source.startsWith('mapbox://')
    ? settings.source
    : `mapbox://${settings.source}`;

  return {
    id: 'national-dashboard-sources',
    type: 'vector',
    url,
  };
}

export function useLayers({
  id,
  opacity = 1,
  visibility = 'visible',
  settings,
}: {
  id: LayerProps['id'];
  opacity?: number;
  visibility?: Visibility;
  settings: LayerSettingsType;
}): LayerProps | null {
  if (!settings?.source_layer || settings.layerIndex == null) return null;

  const color = colorsScale[settings.layerIndex] ?? colorsScale[0];

  return {
    id,
    source: 'national-dashboard-sources',
    'source-layer': settings.source_layer,
    type: 'fill',
    paint: {
      'fill-color': color,
      'fill-opacity': opacity,
    },
    layout: {
      visibility,
    },
  };
}
