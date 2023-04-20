import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

// widget data
export function useMangroveBlueCarbon(
  params: UseParamsOptions,
  queryOptions: UseQueryOptions = {}
) {
  const fetchMangroveBlueCarbon = () =>
    API.request({
      method: 'GET',
      url: '/widgets/blue_carbon',
      params,
    }).then((response) => response);

  const query = useQuery(['blue-carbon', params], fetchMangroveBlueCarbon, {
    placeholderData: [],
    select: (data) => ({
      data,
    }),
    ...queryOptions,
  });

  return useMemo(() => {
    return {
      ...query,
    } as typeof query;
  }, [query]);
}

export function useSource(): SourceProps {
  return {
    id: 'blue-carbon-source',
    type: 'raster',
    tiles: [
      'https://mangrove_atlas.storage.googleapis.com/tilesets/toc_co2eha-1_2016_z0z12/{z}/{x}/{y}.png',
    ],
    minzoom: 0,
    maxzoom: 12,
  };
}
export function useLayer(): LayerProps {
  return {
    id: 'blue-carbon-layer',
    type: 'raster',
  };
}
