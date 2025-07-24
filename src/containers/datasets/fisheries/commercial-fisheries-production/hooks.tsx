import type { LayerProps, SourceProps } from 'react-map-gl';

import { useRouter } from 'next/router';

import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { Visibility } from 'mapbox-gl';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import type { Data, DataResponse } from './types';
import mapboxgl from 'mapbox-gl';

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
    id: 'mangrove_commercial_fisheries_production-source',
    type: 'vector',
    url: 'mapbox://globalmangrovewatch.dny2poqp',
  };
}

export function useLayers({
  id,
  opacity,
  visibility = 'visible',
  indicator,
}: {
  id: LayerProps['id'];
  opacity?: number;
  visibility?: Visibility;
  indicator?: Data['indicator'];
}): LayerProps[] {
  const Indicator = indicator?.charAt(0).toUpperCase() + indicator?.slice(1) || 'Total';
  const COLORS = {
    Fish: [
      'interpolate',
      ['linear'],
      ['get', Indicator],
      40,
      '#f0f2fb',
      80,
      '#c2d6db',
      105,
      '#7bacd1',
      115,
      '#4b7baf',
      120,
      '#234f97',
    ],
    Shrimp: [
      'interpolate',
      ['linear'],
      ['get', Indicator],
      170,
      '#fcede4',
      220,
      '#f0b7bc',
      240,
      '#e970a2',
      260,
      '#b73088',
      270,
      '#6e1375',
    ],
    Crab: [
      'interpolate',
      ['linear'],
      ['get', Indicator],
      0.5,
      '#fcede4',
      0.6,
      '#c2e2b8',
      1,
      '#84c27c',
      100,
      '#529b58',
      101,
      '#2e6b34',
    ],
    Bivalve: [
      'interpolate',
      ['linear'],
      ['get', Indicator],
      50,
      '#fdefe2',
      70,
      '#f4c28c',
      90,
      '#ed904e',
      110,
      '#d45e2b',
      111,
      '#9a3f1b',
    ],
    Total: [
      'interpolate',
      ['linear'],
      ['get', Indicator],
      1.5,
      '#f8e855',
      2.1,
      '#78c66e',
      2.2,
      '#468e95',
      3.3,
      '#405187',
      17.8,
      '#3e0751',
    ],
  };
  const COLOR = (COLORS[Indicator as keyof typeof COLORS] || '#8800FF') as
    | mapboxgl.StyleFunction
    | string;

  return [
    {
      id: `${id}-${indicator}`,
      source: 'mangrove_commercial_fisheries_production-line',
      'source-layer': 'all_sp_fit_fn_totals',
      type: 'line',
      filter: ['>', ['get', Indicator], 0],
      minzoom: 0,
      paint: {
        'line-color': COLOR,
        'line-opacity': opacity,
        'line-width': 1,
      },
      layout: {
        visibility,
      },
    },
    {
      id: `${id}-${indicator}`,
      type: 'fill',
      source: 'mangrove_commercial_fisheries_production-fill',
      'source-layer': 'all_sp_fit_fn_totals',
      filter: ['>', ['get', Indicator], 0],
      paint: {
        'fill-color': COLOR,
      },
    },
  ];
}
