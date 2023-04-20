import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

// widget data
export function useMangroveNetChange(params: UseParamsOptions, queryOptions: UseQueryOptions = {}) {
  const fetchMangroveNetChange = () =>
    API.request({
      method: 'GET',
      url: '/widgets/net_change',
      params,
    }).then((response) => response);

  const query = useQuery(['net-change', params], fetchMangroveNetChange, {
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

export function useSources(years): SourceProps[] {
  return years.map((year) => ({
    id: `net-change-${year}`,
    type: 'raster',
    tiles: [
      `https://mangrove_atlas.storage.googleapis.com/staging/tilesets/gain/${year}/{z}/{x}/{y}.png`,
      `https://mangrove_atlas.storage.googleapis.com/staging/tilesets/loss/${year}/{z}/{x}/{y}.png`,
    ],
    minZoom: 0,
    maxZoom: 12,
  }));
}
export function useLayer(): LayerProps {
  return {
    id: 'net-change-layer',
    type: 'raster',
  };
}
