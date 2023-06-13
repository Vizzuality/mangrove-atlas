import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { useRouter } from 'next/router';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { useLocation } from 'containers/datasets/locations/hooks';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import type { SpeciesData, DataResponse } from './types';

// widget data
export function useMangroveSpecies(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse>
): SpeciesData {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0];
  const id = queryParams?.[1];
  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(locationType, id);
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

  const fetchMangroveSpeciesWorlwide = () =>
    API.request({
      method: 'GET',
      url: '/widgets/biodiversity',
      params: {
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
  const worldwideQuery = useQuery(
    ['biodiversity-worlwdide', params],
    fetchMangroveSpeciesWorlwide,
    {
      placeholderData: {
        metadata: null,
        data: {
          total: null,
        },
      },
      ...queryOptions,
    }
  );

  const { data } = query;
  const { data: worldwideData } = worldwideQuery;

  const noData = !data?.data?.total;

  return useMemo(() => {
    const total = data?.data?.total;
    const worldwideTotal = worldwideData.data.total;
    const legend = [1, Math.ceil(worldwideTotal / 2), worldwideTotal];
    return {
      noData,
      location,
      total: total,
      worldwideTotal,
      legend,
      ...query,
    };
  }, [query, params, data]);
}

export function useSource(): SourceProps {
  return {
    id: 'Species_richness',
    type: 'vector',
    url: 'mapbox://globalmangrovewatch.bkpfnh68',
  };
}

export function useLayers({ id }: { id: LayerProps['id'] }): LayerProps[] {
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
        'fill-opacity': 0.6,
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
        'line-opacity': 1,
      },
    },
  ];
}
