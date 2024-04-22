import type { LayerProps, SourceProps } from 'react-map-gl';

import { useRouter } from 'next/router';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import chroma from 'chroma-js';
import type { Visibility } from 'mapbox-gl';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import { COLORS } from './constants';
import type { Data, DataResponse, LayerSettingsType } from './types';

const colorsScale = chroma.scale(COLORS).colors(COLORS.length);
// widget data
export function useNationalDashboard(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse, Error, Data>
) {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];
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

  return useQuery(['national_dashboard', params, location_id], fetchMangroveNationalDashboard, {
    select: (data) => ({
      ...data,
      locationIso: iso,
    }),
    ...queryOptions,
  });
}

export function useSource({ settings }: { settings: LayerSettingsType }): SourceProps {
  return {
    id: 'national-dashboard-sources',
    type: 'vector',
    url: `mapbox://${settings?.source}`,
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
}): LayerProps {
  const color = colorsScale.filter((c, i) => i === settings.layerIndex) as string[];
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const location = queryParams?.[1];

  const {
    data: { iso },
  } = useLocation(location, locationType);

  if (!settings || settings.location !== iso) return null;

  return {
    id,
    // key: `${settings.source_layer}`,
    source: 'national-dashboard-sources',
    'source-layer': settings.source_layer,
    type: 'fill',
    paint: {
      'fill-color': color[0],
      'fill-opacity': opacity,
    },
    layout: {
      visibility,
    },
  };
}
