import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { numberFormat } from 'lib/format';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import type { Data, DataResponse, ColorKeysTypes } from './types';

const COLORS = ['#C9BB42', '#8BA205', '#428710', '#0A6624', '#103C1F'];

const getColorKeys = (data: Data[]) =>
  data.reduce((acc, d, i) => {
    return {
      ...acc,
      [d.indicator]: COLORS[i],
    };
  }, {} satisfies ColorKeysTypes);

const getData = (data: Data[], unit) => {
  if (!data || !data.length) return null;
  const barsValues = data?.map(({ value }) => value);
  const total = barsValues.reduce((previous, current) => current + previous);
  return [
    data.reduce(
      (acc, d) => ({
        ...acc,
        year: d.year,
        [`${d.indicator} ${unit}`]: (d.value / total) * 100,
      }),
      {}
    ),
  ];
};

const getBars = (data: Data[], COLORs_BY_INDICATOR: ColorKeysTypes) =>
  data.reduce(
    (acc, d) => ({
      ...acc,
      [`${d.indicator} m`]: {
        stackId: 'bar',
        barSize: 60,
        fill: COLORs_BY_INDICATOR[d.indicator],
        stroke: COLORs_BY_INDICATOR[d.indicator],
        isAnimationActive: false,
        indicator: Number(d.indicator.replace('-', '')),
      },
    }),
    {}
  );

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
        year: [],
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
  const unit = data?.metadata?.units?.value;
  const years = data?.metadata?.year;
  const year = Math.max(...years);
  const COLORs_BY_INDICATOR = getColorKeys(data?.data);

  const chartData = getData(data?.data, unit);

  const config = {
    chartData,
    chartBase: {
      type: 'bar',
      bars: getBars(data?.data, COLORs_BY_INDICATOR),
    },
    data: chartData,
    xKey: 'year',
    yKeys: {
      bars: getBars(data?.data, COLORs_BY_INDICATOR),
    },
    xAxis: {
      tick: {
        fontSize: 12,
        lineheight: 20,
        fill: 'rgba(0, 0, 0, 0.54)',
      },
      ticks: years,
      interval: 0,
    },
    yAxis: {
      tick: {
        fontSize: 12,
        fill: 'rgba(0,0,0,0.54)',
      },
      width: 40,
      // tickFormatter: (value) => Math.round(value),
      domain: [0, 100],
      interval: 0,
      orientation: 'right',
      label: {
        value: '%',
        position: 'top',
        offset: 25,
      },
      type: 'number',
    },

    cartesianAxis: {
      tick: false,
    },
  };

  return useMemo(() => {
    return {
      ...query,
      mean: numberFormat(mean),
      unit,
      year,
      config,
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
