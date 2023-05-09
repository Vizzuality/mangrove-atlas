import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { numberFormat } from 'lib/format';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import type { Data, DataResponse } from './types';

const COLORS = ['#C9BB42', '#8BA205', '#428710', '#0A6624', '#103C1F'];

const getColorKeys = (data: Data[]) =>
  data.reduce((acc, d, i) => {
    return {
      ...acc,
      [d.indicator]: COLORS[i],
    };
  }, {} satisfies ColorKeysTypes);
const getData = (data) => {
  if (!data || !data.length) return null;
  const barsValues = data?.map(({ value }) => value);
  const total = barsValues.reduce((previous, current) => current + previous);
  return [
    data.reduce(
      (acc, d) => ({
        ...acc,
        year: d.year,
        [`${d.indicator} m`]: (d.value / total) * 100,
      }),
      {}
    ),
  ];
};

// widget data
export function useMangroveHeight(
  params: UseParamsOptions,
  queryOptions: UseQueryOptions<DataResponse>
) {
  const fetchMangroveHeight = () =>
    API.request({
      method: 'GET',
      url: '/widgets/tree_height',
      params,
    }).then((response: AxiosResponse<DataResponse>) => response.data);

  const query = useQuery(['tree-height', params], fetchMangroveHeight, {
    placeholderData: {
      data: [],
      metadata: {
        avg_height: null,
      },
    },
    select: (data) => {
      return data;
    },
    ...queryOptions,
  });

  const { data } = query;
  const mean = data?.metadata?.avg_height?.[0].value;

  return useMemo(() => {
    return {
      ...query,
      mean: numberFormat(mean),
      unit: data?.metadata?.units?.value,
      year: data?.metadata?.year?.[0],
    };
  }, [query, data]);
}

export function useSource(years: number[]): SourceProps {
  const tiles = years.map<string>((year: number) => {
    return `https://mangrove_atlas.storage.googleapis.com/staging/tilesets/mangrove_canopy_height-v3/${year}/{z}/{x}/{y}.png`;
  });

  return {
    id: 'mangrove_canopy_height-v3-source',
    type: 'raster',
    tiles,
    minzoom: 0,
    maxzoom: 12,
  };
}
export function useLayer(): LayerProps {
  return {
    id: 'mangrove_canopy_height-v3-layer',
    type: 'raster',
  };
}
