import type { SourceProps, LayerProps } from 'react-map-gl';

import type { QueryObserverOptions } from '@tanstack/react-query';
import { useQuery, UseQueryOptions, Data } from '@tanstack/react-query';

import API from 'services/api';

import type { DataResponse } from './types';

export function useMangroveSpeciesLocation<T = { data: DataResponse['data']['species'] }>(
  queryOptions?: QueryObserverOptions<DataResponse, Error, T>
) {
  const fetchMangroveSpecies = () =>
    API.request<DataResponse>({
      method: 'GET',
      url: '/widgets/biodiversity',
    }).then((response) => response.data);

  return useQuery(['biodiversity'], fetchMangroveSpecies, {
    // placeholderData: {
    //   data: {
    //     species: [],
    //   },
    //   metatada: {},
    // } satisfies DataResponse & { data: Omit<DataResponse, 'data'> },
    select: ({ data }) => ({
      data: data.species,
    }),
    ...queryOptions,
  });
}

export function useSource(): SourceProps {
  return {
    id: 'Species_location-source',
    type: 'vector',
    url: 'mapbox://globalmangrovewatch.bkpfnh68',
  };
}

export function useLayer(): LayerProps[] {
  return [
    {
      id: 'Species_location-layer-border',
      'source-layer': 'Species_richness',
      type: 'line',
      paint: {
        'line-color': '#00857F',
        'line-width': 1.5,
        'line-opacity': 1,
      },
    },
    {
      id: 'Species_location-layer',
      'source-layer': 'Species_richness',
      type: 'fill',
      paint: {
        'fill-pattern': 'pattern',
        'fill-opacity': 0.5,
        'fill-color': 'red',
      },
    },
  ];
}
