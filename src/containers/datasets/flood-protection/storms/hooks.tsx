import { useRouter } from 'next/router';

import { numberFormat, formatMillion } from 'lib/format';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import chroma from 'chroma-js';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';

import API from 'services/api';

import type {
  Data,
  DataResponse,
  FloodProtectionIndicatorId,
  FloodProtectionPeriodId,
} from '../types';

import { LABELS, UNITS_LABELS } from './constants';
import Tooltip from './tooltip';

type UseParamsOptions = {
  location_id?: string;
  indicator: 'area' | 'population' | 'stock';
};

const GRADIENTS_BY_INDICATOR = {
  area: ['#F3E0F7', '#E4C7F1', '#D1AFE8', '#AB91CF', '#9F82CE', '#826DBA', '#63589F'],
  population: ['#FFC6C4', '#F4A3A8', '#E38191', '#CC607D', '#AD466C', '#8B3058', '#672044'],
  stock: ['#D1EEEA', '#A8DBD9', '#85C4C9', '#68ABB8', '#4F90A6', '#3B738F', '#2A5674'],
};

const getColor = (data, selectedPeriod, indicator, metadata) => {
  const { min, max } = metadata;
  const indicatorData = data.filter((d) => d.period === selectedPeriod)[0];
  const { value } = indicatorData;
  const colorScale = chroma.scale(GRADIENTS_BY_INDICATOR[indicator]).domain([min, max]);
  return colorScale(value);
};

const getFormattedValue = (value: number, indicator: FloodProtectionIndicatorId) => {
  if (indicator === 'population') {
    const roundedValue = Math.round(value);
    return roundedValue > 1000000 ? formatMillion(roundedValue) : roundedValue;
  }
  return value > 1000000 ? formatMillion(value) : value % 2 === 0 ? value : numberFormat(value);
};

const getBars = (data, selectedPeriod, metadata, indicator) => {
  const color = getColor(data, selectedPeriod, indicator, metadata);
  return data.map((d) => ({
    ...d,
    barSize: 40,
    fill: d.period === selectedPeriod ? color : '#E1E1E1',
    isAnimationActive: false,
    value: d.value,
    period: LABELS[d.period].short,
    color: d.period === selectedPeriod ? color : '#E1E1E1',
    [LABELS[d.period]]: d.value,
    showValue: true,
    label: d.period,
    labelFormatted: LABELS[d.period].short,
    valueFormatted: getFormattedValue(d.value, indicator),
    unit: UNITS_LABELS[metadata.unit],
  }));
};

export function useMangrovesFloodProtection(
  selectedPeriod: FloodProtectionPeriodId,
  params: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse, Error, Data>
) {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];
  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(locationType, id);
  const fetchMangrovesFloodProtection = () =>
    API.request({
      method: 'GET',
      url: '/widgets/flood_protection',
      params: {
        ...(!!location_id && { location_id: currentLocation }),
        ...params,
      },
    }).then((response) => response.data);
  return useQuery(['flood-protection', params, location_id], fetchMangrovesFloodProtection, {
    select: (data) => {
      const ChartData = getBars(data.data, selectedPeriod, data.metadata, params.indicator);
      const selectedValue = ChartData.find((d) => d.label === selectedPeriod).value;
      const TooltipData = {
        content: (properties) => <Tooltip {...properties} />,
      };
      const min = data.metadata.min;
      const max = data.metadata.max;
      return {
        data: ChartData,
        config: {
          type: 'bar',
          dataKey: 'value',
          width: 275,
          margin: {
            top: 40,
            bottom: 0,
            left: 25,
            right: 40,
          },
          chartBase: {
            dataKey: 'value',
            type: 'bar',
            bar: ChartData,
          },
          data: ChartData,
          xKey: 'period',
          xAxis: {
            type: 'category',
            tick: {
              fontSize: 12,
              lineHeight: 20,
              fill: 'rgba(0, 0, 0, 0.54)',
            },
          },
          yAxis: {
            label: (props) => {
              return (
                <g>
                  <text
                    x={10}
                    y={15}
                    textAnchor="start"
                    fontSize={12}
                    fontWeight={700}
                    fill="rgba(0, 0, 0, 0.85)"
                  >
                    {UNITS_LABELS[data.metadata.unit]}
                  </text>
                </g>
              );
            },
            tick: {
              fontSize: 12,
              fill: 'rgba(0,0,0,0.54)',
            },
            tickFormatter: (value) => getFormattedValue(value, params.indicator),
            tickNumber: 5,
            width: 30,
            interval: 0,
            orientation: 'left',
          },
          tooltip: TooltipData,
          cartesianGrid: {
            vertical: false,
            strokeDasharray: '5 15',
          },
        },
        selectedValue,
        ...data.metadata,
        min,
        max,
        location,
        getFormattedValue,
      };
    },
    ...queryOptions,
  });
}
