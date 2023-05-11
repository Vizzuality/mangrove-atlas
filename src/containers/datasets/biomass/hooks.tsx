import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { numberFormat } from 'lib/format';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import { years } from './constants';
import type { DataResponse, Data, BiomassData, ColorKeysTypes } from './types';

const COLORS = ['#EAF19D', '#B8E98E', '#1B97C1', '#1C52A3', '#13267F'];

const getColorKeys = (data: Data[]) =>
  data.reduce((acc, d, i) => {
    return {
      ...acc,
      [d.indicator]: COLORS[i],
    };
  }, {} satisfies ColorKeysTypes);
// widget data
export function useMangroveBiomass(
  params: UseParamsOptions,
  queryOptions: UseQueryOptions<DataResponse>
): BiomassData {
  const fetchMangroveBiomass = () =>
    API.request({
      method: 'GET',
      url: '/widgets/aboveground_biomass',
      params,
    }).then((response: AxiosResponse<DataResponse>) => response.data);

  const query = useQuery(['aboveground_biomass', params], fetchMangroveBiomass, {
    placeholderData: {
      data: [],
      metadata: {
        avg_aboveground_biomass: [
          {
            value: null,
          },
        ],
      },
    },
    // select: (data) => ({
    //   data,
    // }),
    ...queryOptions,
  });
  const { data, isLoading } = query;

  return useMemo(() => {
    const currentYear = 2020;
    const dataFiltered = data.data.filter(
      ({ indicator, year }) => indicator !== 'total' && year === currentYear
    );

    const avgBiomassFiltered = data?.metadata.avg_aboveground_biomass.find(
      ({ year }) => year === currentYear
    )?.value;

    const unit = data?.metadata.units?.value;

    const colorKeys = getColorKeys(dataFiltered);
    const ChartData = dataFiltered.map((d) => {
      if (d.indicator !== 'total')
        return {
          label: d.indicator,
          value: d.value,
          color: colorKeys[d.indicator],
        };
    });

    const config = {
      type: 'pie',
      data: ChartData,
      // tooltip: TooltipData,
      chartBase: {
        pies: {
          value: 'biomass',
        },
      },
      tooltip: [],
      legend: [],
    };

    return {
      mean: numberFormat(avgBiomassFiltered),
      unit,
      year: currentYear,
      config,
      isLoading,
    };
  }, [data]);
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
