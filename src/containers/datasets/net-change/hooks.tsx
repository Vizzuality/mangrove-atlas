import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import orderBy from 'lodash-es/orderBy';

import { netChangeStartYearAtom, netChangeEndYearAtom } from 'store/widgets';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { format } from 'd3-format';
import { CartesianGridProps } from 'recharts';
import { useRecoilValue } from 'recoil';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

type Data = Readonly<{
  year: number;
  net_change: number;
  gain: number;
  loss: number;
}>;

type Metadata = Readonly<{
  location_id: string;
  note: string;
  total_area: number;
  total_lenght: number;
  units: { [key: string]: string };
  year: number[];
}>;

type DataResponse = {
  data: Data[];
  metadata: Metadata;
};

type ChartData = {
  label: number;
  year: number;
  gain: number;
  loss: number;
};

type chartBaseTypes = {
  lines: {
    netChange: {
      stroke: string;
      legend: string;
      isAnimationActive: boolean;
    };
  };
};

type ChartConfig = {
  type: string;
  data: ChartData[];
  cartesianGrid: CartesianGridProps;
  chartBase: chartBaseTypes;
};

type NetChangeData = {
  direction: string;
  netChange: string;
  isLoading: boolean;
  config: ChartConfig;
};

export const numberFormat = format(',.2~f');
export const smallNumberFormat = format('.4~f');
export const formatAxis = format(',.0d');

const getFormat = (v) => {
  const decimalCount = -Math.floor(Math.log10(v) + 1) + 1;
  const formatByDecimals = format(`.${decimalCount === Infinity ? 1 : Math.abs(decimalCount)}~f`);
  return formatByDecimals(v);
};

const getWidgetData = (data: Data[], unit = '') => {
  if (!data.length) return null;
  const firstYear = Math.min(...data.map((d) => d.year));
  const netChangeValues = data.map((d) => d.net_change);
  netChangeValues.shift();

  const cumulativeValuesNetChange = [0, ...netChangeValues]?.reduce(
    (acc, value, i) => {
      acc.push((acc[i] += value));
      return acc;
    },
    [0]
  );

  return orderBy(
    data.map((l, i) => {
      return {
        label: l.year,
        year: l.year,
        netChange:
          unit === 'ha' ? cumulativeValuesNetChange[i] * 100 : cumulativeValuesNetChange[i],
        gain: l.year === firstYear ? 0 : unit === 'ha' ? l.gain * 100 : l.gain,
        loss: l.year === firstYear ? 0 : unit === 'ha' ? -l.loss * 100 : -l.loss,
      };
    }),
    (l) => l.year
  );
};

// widget data
export function useMangroveNetChange(
  params: UseParamsOptions,
  queryOptions: UseQueryOptions<DataResponse>
): NetChangeData {
  const fetchMangroveNetChange = () =>
    API.request({
      method: 'GET',
      url: '/widgets/net_change',
      params,
    }).then((response: AxiosResponse<DataResponse>) => response.data);

  const query = useQuery(['net-change', params], fetchMangroveNetChange, {
    placeholderData: {
      data: [],
      metadata: null,
    },
    ...queryOptions,
  });

  const { data, isLoading } = query;

  const startYearUi = useRecoilValue(netChangeStartYearAtom);
  const endYearUi = useRecoilValue(netChangeEndYearAtom);
  return useMemo(() => {
    const years = data.metadata?.year.sort();
    const unit = data.metadata?.units.net_change;

    // const startYear = years.includes(startYearUi) ? startYearUi : years[0];
    // const endYear = years.includes(endYearUi) ? endYearUi : years?.[years?.length - 1];
    const DATA = getWidgetData(data.data, unit) || [];

    const change = DATA[DATA.length - 1]?.netChange;

    const chartConfig = {
      type: 'composed',
      data: DATA,
      xAxis: {
        tick: { fontSize: 12, fill: 'rgba(0, 0, 0, 0.54)' },
      },
      yAxis: {
        tick: { fontSize: 12, fill: 'rgba(0, 0, 0, 0.54)' },
        tickFormatter: (v) => {
          const parsedNumber = unit === 'ha' ? v * 100 : v;
          const result = Number(getFormat(Math.abs(parsedNumber)));
          return result === 0 ? 0 : result;
        },
        tickMargin: 10,
        orientation: 'right',
        label: {
          value: unit === 'km²' ? 'km²' : unit,
          position: 'top',
          offset: 35,
        },
      },
      xKey: 'year',
      cartesianGrid: {
        vertical: false,
        strokeDasharray: '5 20',
      },
      chartBase: {
        lines: {
          netChange: {
            stroke: 'rgba(0,0,0,0.7)',
            legend: 'Net change',
            isAnimationActive: false,
          },
        },
      },
    };
    const direction = change > 0 ? 'increased' : 'decreased';
    return {
      isLoading,
      config: chartConfig,
      netChange: numberFormat(Math.abs(change)),
      direction,
    };
  }, [data, data.metadata, query]);
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
