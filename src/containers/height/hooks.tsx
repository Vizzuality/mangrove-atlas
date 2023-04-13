import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

// widget data
export function useMangroveHeight(params: UseParamsOptions, queryOptions: UseQueryOptions = {}) {
  const fetchMangroveHeight = () =>
    API.request({
      method: 'GET',
      url: '/widgets/tree_height',
      params,
    }).then((response) => response);

  const query = useQuery(['tree-height', params], fetchMangroveHeight, {
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

export function useSource(years): SourceProps[] {
  return years.map((year) => ({
    id: `mangrove_canopy_height-v3-${year}`,
    type: 'raster',
    tiles: [
      `https://mangrove_atlas.storage.googleapis.com/staging/tilesets/mangrove_canopy_height-v3/${year}/{z}/{x}/{y}.png`,
    ],
    minZoom: 0,
    maxZoom: 12,
  }));
}
export function useLayer(): LayerProps {
  return {
    id: 'mangrove_canopy_height-v3-layer',
    type: 'raster',
  };
}
