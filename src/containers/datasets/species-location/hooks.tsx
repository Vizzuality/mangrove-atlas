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
