import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';
type Categories = Readonly<{
  cr: number;
  en: number;
  vu: number;
  nt: number;
  lc: number;
  dd: number;
}>;

type Category = 'cr' | 'en' | 'vu' | 'nt' | 'lc' | 'dd';

type Specie = Readonly<{
  common_name: null | string;
  created_at: string;
  id: number;
  iucn_url: string;
  red_list_cat: Category;
  scientific_name: string;
  updated_at: string;
}>;

type Data = { total: number; threatened: number; categories: Categories; species: Specie[] };

type Metadata = {
  note: 'nº of species';
  unit: null | string;
};
type DataResponse = {
  data: Data;
  metadata: Metadata;
};
type SpeciesData = {
  total: number;
  legend: number[];
  isLoading: boolean;
};
// widget data
export function useMangroveSpecies(
  params: UseParamsOptions,
  queryOptions: UseQueryOptions<DataResponse>
): SpeciesData {
  const fetchMangroveSpecies = () =>
    API.request({
      method: 'GET',
      url: '/widgets/biodiversity',
      params,
    }).then((response: AxiosResponse<DataResponse>) => response.data);

  const query = useQuery(['biodiversity', params], fetchMangroveSpecies, {
    placeholderData: {
      metadata: null,
      data: {
        total: null,
      },
    },
    ...queryOptions,
  });
  const { data, isLoading } = query;

  return useMemo(() => {
    const total = data.data.total;
    const legend = [1, Math.ceil(total / 2), total];
    return {
      total: total,
      legend,
      isLoading,
    };
  }, [query, params]);
}

export function useSource(): SourceProps {
  return {
    id: 'Species_richness',
    type: 'vector',
    url: 'mapbox://globalmangrovewatch.bkpfnh68',
  };
}

export function useLayer(): LayerProps {
  const maxValue = 51;
  return {
    id: 'Species_richness',
    'source-layer': 'Species_richness',
    // filter: ['==', 'sp_count', '<0'],
    type: 'fill',
    paint: {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'sp_count'],
        0,
        '#F9FDB7',
        5,
        '#E0F1B2',
        10,
        '#C7E6AC',
        15,
        '#B0DAA9',
        20,
        '#99CFA6',
        25,
        '#7CBCA2',
        30,
        '#59A29C',
        35,
        '#3B8793',
        40,
        '#2D6D82',
        maxValue,
        '#205272',
      ],
      'fill-opacity': 0.5,
    },
  };
}