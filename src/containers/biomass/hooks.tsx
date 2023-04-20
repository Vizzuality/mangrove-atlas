import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import { years } from './constants';

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

export function useSource(): SourceProps {
  const tiles = years.map<string>((year: number) => {
    return `https://mangrove_atlas.storage.googleapis.com/staging/tilesets/mangrove_aboveground_biomass-v3/${year}/{z}/{x}/{y}.png`;
  });
  return {
    id: 'aboveground_biomass-source',
    type: 'raster',
    tiles,
    minzoom: 0,
    maxzoom: 12,
  };
}
export function useLayer(): LayerProps {
  return {
    id: 'aboveground_biomass-layer',
    type: 'raster',
  };
}
