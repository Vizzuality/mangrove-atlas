import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { SpeciesLocationState } from 'store/widgets/species-location';

import { useQuery, QueryClient } from '@tanstack/react-query';
import type { QueryObserverOptions } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';

import { useLocations } from 'containers/datasets/locations/hooks';

import API from 'services/api';

import type { DataResponse } from './types';

const QUERY_KEY = 'species-location';

export function useMangroveSpeciesLocation<T>(
  queryOptions?: QueryObserverOptions<DataResponse, Error, T>
) {
  const queryClient = new QueryClient();

  const fetchMangroveSpecies = () =>
    API.request<DataResponse>({
      method: 'GET',
      url: '/species',
    }).then(({ data }) => data);

  return useQuery([QUERY_KEY], fetchMangroveSpecies, {
    placeholderData: queryClient.getQueryData([QUERY_KEY]) || {
      data: [],
    },
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
  const data = useRecoilValue<DataResponse['data'][number]>(SpeciesLocationState);
  const locationsIds = data?.location_ids;
  const { data: locations } = useLocations();

  const dataFiltered = useMemo(() => {
    return locations?.data
      ?.filter((location) => locationsIds.includes(location.id))
      .map((location) => location.location_id) satisfies string[];
  }, [locationsIds, locations]);

  return [
    {
      id: 'Species_location-layer-border',
      'source-layer': 'Species_richness',
      type: 'line',
      filter: ['any', ...dataFiltered?.map((id) => ['in', id, ['get', 'location_idn']])],
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
      filter: ['any', ...dataFiltered?.map((id) => ['in', id, ['get', 'location_idn']])],
      paint: {
        'fill-pattern': 'pattern',
        'fill-opacity': 0.5,
      },
    },
  ];
}
