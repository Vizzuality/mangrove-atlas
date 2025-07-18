import type { LayerProps, SourceProps } from 'react-map-gl';

import { useRouter } from 'next/router';

import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { Visibility } from 'mapbox-gl';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import type { Data, DataResponse } from './types';

const MOCK: Data[] = [
  {
    indicator: 'fish',
    value: 565.826,
    indicator_type: 'absolute',
  },
  {
    indicator: 'fish',
    value: 1234,
    indicator_type: 'density',
  },
  {
    indicator: 'shrimp',
    value: null,
    indicator_type: 'absolute',
  },
  {
    indicator: 'shrimp',
    value: null,
    indicator_type: 'density',
  },
  {
    indicator: 'crab',
    value: null,
    indicator_type: 'absolute',
  },
  {
    indicator: 'crab',
    value: null,
    indicator_type: 'density',
  },
  {
    indicator: 'bivalve',
    value: 65824,
    indicator_type: 'absolute',
  },
  {
    indicator: 'bivalve',
    value: 123,
    indicator_type: 'density',
  },
];

export function useMangroveFisheryMitigationPotentials<TData = Data[]>(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse, Error, TData>
): UseQueryResult<TData, Error> {
  const {
    query: { params: queryParams },
  } = useRouter();

  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];

  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(id, locationType);

  const fetchMangroveFisheryMitigationPotentials = () =>
    API.request({
      method: 'GET',
      url: '/widgets/fishery_mitigation_potentials',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...params,
      },
    }).then((response) =>
      !!response.data.data.length
        ? response.data
        : {
            location,
            data: MOCK,
            metadata: response.data.metadata,
          }
    );

  return useQuery<DataResponse, Error, TData>(
    ['fishery-mitigation-potentials', params, location_id],
    fetchMangroveFisheryMitigationPotentials,
    {
      ...(queryOptions || {}),
    }
  );
}

export function useSource(): SourceProps {
  return {
    id: 'commercial_fisheries_production-source',
    type: 'vector',
    url: 'mapbox://globalmangrovewatch.dny2poqp',
  };
}

export function useLayer({
  id,
  opacity,
  visibility = 'visible',
  indicator,
}: {
  id: LayerProps['id'];
  opacity?: number;
  visibility?: Visibility;
  indicator?: Data['indicator'];
}): LayerProps {
  const Indicator = indicator?.charAt(0).toUpperCase() + indicator?.slice(1) || 'Total';

  return {
    id: `${id}-${indicator}`,
    source: 'commercial_fisheries_production',
    'source-layer': 'all_sp_fit_fn_totals',
    type: 'line',
    filter: ['>', ['get', Indicator], 0],
    minzoom: 0,
    paint: {
      'line-color': '#8800FF',
      'line-opacity': opacity,
      'line-width': 1,
    },
    layout: {
      visibility,
    },
  };
}
