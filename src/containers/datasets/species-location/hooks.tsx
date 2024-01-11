import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { useRouter } from 'next/router';

import { SpeciesLocationState } from 'store/widgets/species-location';

import { useQuery, QueryClient } from '@tanstack/react-query';
import type { QueryObserverOptions } from '@tanstack/react-query';
import type { Visibility } from 'mapbox-gl';
import { useRecoilValue } from 'recoil';

import { useLocations, useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';

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
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
      },
    }).then(({ data }) => data);

  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];
  const {
    data: { id: currentLocation, location_id },
  } = useLocation(id, locationType);

  return useQuery([QUERY_KEY, location_id], fetchMangroveSpecies, {
    placeholderData: queryClient.getQueryData<DataResponse>([QUERY_KEY, location_id]) || {
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

export function useLayer({
  id,
  opacity,
  visibility = 'visible',
}: {
  id: LayerProps['id'];
  opacity?: number;
  visibility?: Visibility;
}): LayerProps[] {
  const data = useRecoilValue(SpeciesLocationState);
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
