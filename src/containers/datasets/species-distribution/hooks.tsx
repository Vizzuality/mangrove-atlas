import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { useRouter } from 'next/router';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import type { Visibility } from 'mapbox-gl';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';
import API from 'services/api';
import type { UseParamsOptions } from 'types/widget';

import type { SpeciesData, DataResponse } from './types';

// widget data
export function useMangroveSpecies(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse>,
): SpeciesData {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];
  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(id, locationType);
  const fetchMangroveSpecies = () =>
    API.request({
      method: 'GET',
      url: '/widgets/biodiversity',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...params,
      },
      ...queryOptions,
    }).then((response: AxiosResponse<DataResponse>) => response.data);

  const query = useQuery(['biodiversity', params, location_id], fetchMangroveSpecies, {
    placeholderData: {
      metadata: null,
      data: {
        total: null,
      },
    },

    ...queryOptions,
  });

  const { data, isFetched } = query;

  const noData = isFetched && !data?.data?.total;

  return useMemo(() => {
    const total = data?.data?.total;
    const worldwideTotal = data?.metadata?.worldwide_total;
    const legend = [1, Math.ceil(worldwideTotal / 2), worldwideTotal];
    return {
      noData,
      location,
      total: total,
      worldwideTotal,
      legend,
      ...query,
    };
  }, [query, data, location, noData]);
}

export function useSource(): SourceProps {
  return {
    id: 'Species_richness',
    type: 'vector',
    url: 'mapbox://globalmangrovewatch.bkpfnh68',
  };
}

export function useLayers({
  id,
  opacity,
  visibility = 'visible',
}: {
  id: LayerProps['id'];
  opacity?: number;
  visibility?: Visibility;
}): LayerProps[] {
  const maxValue = 51;

  return [
    {
      id,
      'source-layer': 'Species_richness',
      filter: ['has', 'sp_count'],
      type: 'fill',
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'sp_count'],
          0,
          '#F9FDB7',
          5,
          '#E0F1B2',
          10,
          '#C7E6AC',
          15,
          '#B0DAA9',
          20,
          '#99CFA6',
          25,
          '#7CBCA2',
          30,
          '#59A29C',
          35,
          '#3B8793',
          40,
          '#2D6D82',
          maxValue,
          '#205272',
        ],
        'fill-outline-color': [
          'interpolate',
          ['linear'],
          ['get', 'sp_count'],
          0,
          '#F9FDB7',
          5,
          '#E0F1B2',
          10,
          '#C7E6AC',
          15,
          '#B0DAA9',
          20,
          '#99CFA6',
          25,
          '#7CBCA2',
          30,
          '#59A29C',
          35,
          '#3B8793',
          40,
          '#2D6D82',
          maxValue,
          '#205272',
        ],
        'fill-opacity': opacity * 0.6,
      },
      layout: {
        visibility,
      },
    },
    {
      id: `${id}-border`,
      'source-layer': 'Species_richness',
      type: 'line',
      paint: {
        'line-color': [
          'interpolate',
          ['linear'],
          ['get', 'sp_count'],
          0,
          '#F9FDB7',
          5,
          '#E0F1B2',
          10,
          '#C7E6AC',
          15,
          '#B0DAA9',
          20,
          '#99CFA6',
          25,
          '#7CBCA2',
          30,
          '#59A29C',
          35,
          '#3B8793',
          40,
          '#2D6D82',
          maxValue,
          '#205272',
        ],
        'line-width': 1,
        'line-opacity': opacity * 0.6,
      },
    },
  ];
}
