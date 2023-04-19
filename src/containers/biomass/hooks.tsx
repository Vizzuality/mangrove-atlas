import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

// widget data
export function useMangroveBiomass(params: UseParamsOptions, queryOptions: UseQueryOptions = {}) {
  const fetchMangroveBiomass = () =>
    API.request({
      method: 'GET',
      url: '/widgets/aboveground_biomass',
      params,
    }).then((response) => response);

  const query = useQuery(['aboveground_biomass', params], fetchMangroveBiomass, {
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
    id: `aboveground_biomass-${year}`,
    type: 'raster',
    tiles: [
      `https://mangrove_atlas.storage.googleapis.com/staging/tilesets/mangrove_aboveground_biomass-v3/${year}/{z}/{x}/{y}.png`,
    ],
    minZoom: 0,
    maxZoom: 12,
  }));
}
export function useLayer(): LayerProps {
  return {
    id: 'aboveground_biomass-layer',
    type: 'raster',
  };
}
