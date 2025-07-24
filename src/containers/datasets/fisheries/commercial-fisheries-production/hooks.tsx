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
import { useMemo } from 'react';

const COLORS = {
  total: [
    'interpolate',
    ['linear'],
    ['get', 'Total'],
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

  fish: [
    'interpolate',
    ['linear'],
    ['get', 'Fish'],
    0,
    '#f0f2fb',
    40,
    '#c2d6db',
    80,
    '#7bacd1',
    105,
    '#4b7baf',
    115,
    '#234f97',
  ],

  shrimp: [
    'interpolate',
    ['linear'],
    ['get', 'Shrimp'],
    0,
    '#fcede4',
    170,
    '#f0b7bc',
    220,
    '#e970a2',
    240,
    '#b73088',
    260,
    '#6e1375',
  ],

  crab: [
    'interpolate',
    ['linear'],
    ['get', 'Crab'],
    0,
    '#effaec',
    0.5,
    '#c2e2b8',
    0.6,
    '#84c27c',
    1,
    '#529b58',
    100,
    '#2e6b34',
  ],

  bivalve: [
    'interpolate',
    ['linear'],
    ['get', 'Bivalve'],
    0,
    '#fdefe2',
    50,
    '#f4c28c',
    70,
    '#ed904e',
    90,
    '#d45e2b',
    110,
    '#9a3f1b',
  ],
};

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
    value: 34,
    indicator_type: 'absolute',
  },
  {
    indicator: 'shrimp',
    value: 34,
    indicator_type: 'density',
  },
  {
    indicator: 'crab',
    value: 6767,
    indicator_type: 'absolute',
  },
  {
    indicator: 'crab',
    value: 567,
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
    }).then((response) => ({
      location,
      ...response.data,
    }));
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

  const COLOR = useMemo(() => {
    return COLORS[indicator] || COLORS.total || '#8800FF';
  }, [indicator, COLORS]);

  if (!Indicator) return null;

  return [
    {
      id: `${id}-${indicator}-line`,
      source: 'mangrove_commercial_fisheries_production',
      'source-layer': 'all_sp_fit_fn_totals',
      type: 'line',
      filter: ['>', ['get', Indicator], 0],
      minzoom: 0,
      paint: {
        'line-color': COLOR as mapboxgl.StyleFunction,
        'line-opacity': opacity,
        'line-width': 1,
      },
      layout: {
        visibility,
      },
    },
    {
      id: `${id}-${indicator}-fill`,
      source: 'mangrove_commercial_fisheries_production',
      'source-layer': 'all_sp_fit_fn_totals',
      type: 'fill',
      filter: ['>', ['get', Indicator], 0],
      minzoom: 0,
      paint: {
        'fill-color': COLOR as mapboxgl.StyleFunction,
        'fill-opacity': opacity,
      },
      layout: {
        visibility,
      },
    },
  ];
}
