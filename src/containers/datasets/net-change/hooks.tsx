import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import orderBy from 'lodash-es/orderBy';

import { useRouter } from 'next/router';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { format } from 'd3-format';

import { useLocation } from 'containers/datasets/locations/hooks';

import CustomTooltip from 'components/chart/tooltip';

import API from 'services/api';

import { Data, DataResponse, UseParamsOptions } from './types';

export const numberFormat = format(',.2~f');
export const smallNumberFormat = format('.4~f');
export const formatAxis = format(',.0d');

const unitOptions = ['km²', 'ha'];

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
        color: 'rgba(0,0,0,0.7)',
        year: l.year,
        'Net change':
          unit === 'ha' ? cumulativeValuesNetChange[i] * 100 : cumulativeValuesNetChange[i],
        Gain: l.year === firstYear ? 0 : unit === 'ha' ? l.gain * 100 : l.gain,
        Loss: l.year === firstYear ? 0 : unit === 'ha' ? -l.loss * 100 : -l.loss,
        settings: [
          {
            color: 'rgba(0,0,0,0.7)',

            label: 'Net change',
            value: numberFormat(
              unit === 'ha' ? cumulativeValuesNetChange[i] * 100 : cumulativeValuesNetChange[i]
            ),
            unit,
          },
        ],
        direction: 'vertical',
      };
    }),
    (l) => l.year
  );
};

// widget data
export function useMangroveNetChange(
  params: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse>
) {
  const {
    query: { locationType, id },
  } = useRouter();
  const {
    data: { name, id: currentLocation, location_id },
  } = useLocation(locationType, id);

  const location = useMemo(() => {
    if (location_id === 'custom-area') return 'the area selected';
    if (location_id === 'worldwide') return 'the world';
    else return name;
  }, [location_id]);

  const { startYear, endYear, selectedUnit, ...restParams } = params;
  const fetchMangroveNetChange = () =>
    API.request({
      method: 'GET',
      url: '/widgets/net_change',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...restParams,
      },
    }).then((response: AxiosResponse<DataResponse>) => response.data);

  const query = useQuery(['net-change', restParams], fetchMangroveNetChange, {
    placeholderData: {
      data: [],
      metadata: null,
    },
    ...queryOptions,
  });

  const { data } = query;

  return useMemo(() => {
    const years = data.metadata?.year.sort();
    const unit = selectedUnit || data.metadata?.units.net_change;
    const currentStartYear = startYear || years?.[0];
    const currentEndYear = endYear || years?.[years?.length - 1];
    const dataFiltered = data.data.filter(
      (d) => d.year >= currentStartYear && d.year <= currentEndYear
    );
    const DATA = getWidgetData(dataFiltered, unit) || [];
    const TooltipData = {
      content: (properties) => <CustomTooltip {...properties} payload={properties?.payload[0]} />,
    };

    const change = DATA[DATA.length - 1]?.['Net change'];
    const chartConfig = {
      type: 'composed',
      data: DATA,
      margin: { top: 40, right: 20, bottom: 20, left: 0 },
      xAxis: {
        tick: { fontSize: 12, fill: 'rgba(0, 0, 0, 0.54)' },
        domain: [startYear, endYear],
        tickCount: 8,
        label: { value: unit, position: 'bottom', offset: 35 },
        interval: 'preserveStartEnd',
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
          value: unit === 'km2' ? 'km²' : unit,
          position: 'top',
          offset: 25,
        },
      },
      xKey: 'year',
      cartesianGrid: {
        vertical: false,
        strokeDasharray: '5 20',
      },
      tooltip: TooltipData,
      chartBase: {
        lines: {
          'Net change': {
            stroke: 'rgba(0,0,0,0.7)',
            isAnimationActive: false,
          },
        },
      },
    };
    const direction = change > 0 ? 'increased' : 'decreased';
    return {
      config: chartConfig,
      location,
      years,
      currentStartYear,
      currentEndYear,
      netChange: numberFormat(Math.abs(change)),
      direction,
      unitOptions,
      ...query,
    };
  }, [data, query, startYear, endYear, location, selectedUnit]);
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
