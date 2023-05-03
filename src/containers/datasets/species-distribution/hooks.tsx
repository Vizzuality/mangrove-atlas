import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

// widget data
export function useMangroveSpecies(params: UseParamsOptions, queryOptions: UseQueryOptions = {}) {
  const fetchMangroveSpecies = () =>
    API.request({
      method: 'GET',
      url: '/widgets/biodiversity',
      params,
    }).then((response) => response.data);

  const query = useQuery(['biodiversity', params], fetchMangroveSpecies, {
    placeholderData: [],
    ...queryOptions,
  });
  const {
    data: { data },
  } = query;

  const legend = [1, Math.ceil(data?.total / 2), data?.total];

  return useMemo(() => {
    return {
      ...query,
      data,
      total: data?.total,
      legend,
    } as typeof query;
  }, [query, params]);
}

export function useSource(): SourceProps {
  return {
    id: 'Species_richness',
    type: 'vector',
    url: 'mapbox://globalmangrovewatch.bkpfnh68',
  };
}

export function useLayer(): LayerProps {
  const minValue = 0;
  const maxValue = 51;
  return {
    id: 'Species_richness',
    'source-layer': 'Species_richness',
    type: 'fill',
    paint: {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'sp_count'],
        minValue,
        '#F9FDB7',
        maxValue,
        '#205272',
      ],
      'fill-outline-color': '#B6B7B1',
      'fill-opacity': 0.5,
    },
    layout: {
      visibility: 'visible',
    },
  };
}
