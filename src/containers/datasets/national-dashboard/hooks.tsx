import type { LayerProps, SourceProps } from 'react-map-gl';

import flatten from 'lodash-es/flatten';
import isEmpty from 'lodash-es/isEmpty';

import { useRouter } from 'next/router';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import type { Visibility } from 'mapbox-gl';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import type { Data, DataResponse, NationalDashboardLayerSettingsTypes } from './types';

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
    data: { id: currentLocation, location_id },
  } = useLocation(locationType, id);

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
      location: currentLocation,
    }),
    ...queryOptions,
  });
}

export function useSource({
  settings,
}: {
  settings: NationalDashboardLayerSettingsTypes;
}): SourceProps {
  const sources =
    !!settings &&
    !isEmpty(settings) &&
    (Object.values(settings).map((setting, index) =>
      index === 0 ? `mapbox://${setting.source}` : setting.source
    ) satisfies string[]);
  return {
    id: 'national-dashboard-sources',
    type: 'vector',
    url: sources[0],
  };
}

export function useLayers({
  id,
  settings,
  opacity = 1,
  visibility = 'visible',
}: {
  id: LayerProps['id'];
  settings: NationalDashboardLayerSettingsTypes;
  opacity?: number;
  visibility?: Visibility;
}): LayerProps[] {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const locationId = queryParams?.[1];
  const {
    data: { id: currentLocationId },
  } = useLocation(locationType, locationId);
  if (!settings) return null;

  return flatten(
    Object.values(settings)
      .filter((s) => s.locationId === currentLocationId)
      .map((setting) => ({
        id: `${id}-setting.source_layer`,
        key: `${setting.source_layer}`,
        source: 'national-dashboard-sources',
        'source-layer': setting.source_layer,
        type: 'fill',
        paint: {
          'fill-color': setting.color,
          'fill-opacity': opacity,
        },
        layout: {
          visibility,
        },
      }))
  );
}
