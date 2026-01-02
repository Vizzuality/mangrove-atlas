import { useMemo } from 'react';

import groupBy from 'lodash-es/groupBy';

import { useRouter } from 'next/router';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import { COLORS, RED_LIST_CATEGORIES } from './constants';
import CustomTooltip from './tooltip';

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
  threatenedLegend: number | string;
  total: number;
  location: string;
  isLoading: boolean;
  isFetched: boolean;
  isPlaceholderData: boolean;
  tooltip?: unknown;
  chartData;
};
const getThreatened = (th: number, total: number) => {
  if (th === total) {
    return 'all';
  }
  if (th === 0) {
    return 'none';
  } else if (th !== total) {
    return th;
  }
};
// widget data
export function useMangroveSpeciesThreatened(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse>
): SpeciesData {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];
  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(id, locationType);

  const fetchMangroveSpecies = () =>
    API.request({
      method: 'GET',
      url: '/widgets/biodiversity',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...params,
      },
    }).then((response: AxiosResponse<DataResponse>) => response.data);

  const query = useQuery(['biodiversity', params, location_id], fetchMangroveSpecies, {
    placeholderData: {
      metadata: null,
      data: null,
    },
    ...queryOptions,
  });
  const { data, isLoading, isFetched, isPlaceholderData } = query;

  const DATA = useMemo(() => {
    const { data: speciesData } = data;
    if (!speciesData) return null;
    const { categories, total, species, threatened } = speciesData;

    const threatenedLegend: number | string = getThreatened(threatened, total);
    const speciesByGroup = groupBy(species, (s) => s?.red_list_cat);

    const chartData = Object.entries(categories)?.map((item) => ({
      value: item[1],
      color: COLORS[item[0]],
      label: `${RED_LIST_CATEGORIES[item[0]]}`,
      species: speciesByGroup[item[0]].sort(),
    }));

    return {
      threatenedLegend,
      total,
      location,
      chartData,

      tooltip: {
        content: (properties) => <CustomTooltip {...properties} />,
      },
    };
  }, [data, location]);

  return useMemo(() => {
    return {
      ...DATA,
      isLoading,
      isFetched,
      isPlaceholderData,
    } satisfies SpeciesData;
  }, [DATA, isLoading, isFetched, isPlaceholderData]);
}
