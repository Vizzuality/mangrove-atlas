import { useMemo } from 'react';

import type { LayerProps, SourceProps } from 'react-map-gl';

import { locationTypeAtom, locationIdAtom } from '@/store/locations';
import { SpeciesLocationState } from '@/store/widgets/species-location';

import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import { useLocation, useLocations } from '@/containers/datasets/locations/hooks';
import type { LocationTypes } from '@/containers/datasets/locations/types';

import { Visibility } from '@/types/layers';

import API from 'services/api';

import type { DataResponse } from './types';

const QUERY_KEY = 'species-location';

export function useMangroveSpeciesLocation<T = DataResponse>(
  queryOptions?: Omit<UseQueryOptions<DataResponse, Error, T>, 'queryKey' | 'queryFn'>
) {
  const fetchMangroveSpecies = () =>
    API.request<DataResponse>({
      method: 'GET',
      url: '/species',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
      },
    }).then(({ data }) => data);

  const locationType = useAtomValue(locationTypeAtom) as LocationTypes;
  const id = useAtomValue(locationIdAtom);
  const {
    data: { id: currentLocation, location_id },
  } = useLocation(id, locationType);

  return useQuery({
    queryKey: [QUERY_KEY, location_id],
    queryFn: fetchMangroveSpecies,
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

export function useLayer({
  id,
  opacity,
  visibility = 'visible',
}: {
  id: LayerProps['id'];
  opacity?: number;
  visibility?: Visibility;
}): LayerProps[] {
  const data = useAtomValue(SpeciesLocationState);
  const locationsIds = data?.location_ids;
  const { data: locations } = useLocations();

  const dataFiltered = useMemo(() => {
    return locations.data
      .filter((location) => locationsIds?.includes(location.id))
      .map((location) => location.location_id);
  }, [locationsIds, locations]);

  return [
    {
      id: `${id}-border`,
      source: 'species_location-source',
      'source-layer': 'Species_richness',
      type: 'line',
      filter: ['any', ...dataFiltered?.map((id) => ['in', id, ['get', 'location_idn']])],
      paint: {
        'line-color': '#00857F',
        'line-width': 1.5,
        'line-opacity': opacity,
      },
      layout: {
        visibility,
      },
    },
    {
      id,
      source: 'species_location-source',
      'source-layer': 'Species_richness',
      type: 'fill',
      filter: ['any', ...dataFiltered?.map((id) => ['in', id, ['get', 'location_idn']])],
      paint: {
        'fill-pattern': 'pattern',
        'fill-opacity': opacity * 0.5,
      },
      layout: {
        visibility,
      },
    },
  ];
}
