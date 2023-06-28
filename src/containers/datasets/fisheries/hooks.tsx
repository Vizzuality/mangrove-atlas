import { useCallback } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { useRouter } from 'next/router';

import { numberFormat } from 'lib/format';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { PolarViewBox } from 'recharts/types/util/types';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import CustomTooltip from './tooltip';
import type { DataResponse } from './types';

const COLORS = {
  '0 - 100': '#FCDE9C',
  '100 - 500': '#FAA476',
  '500 - 1500': '#F0746E',
  '1500 - 5000': '#E34F6F',
  '5000 - 10000': '#B9257A',
  '> 10000': '#7C1D6F',
};

const getColor = (percentage) => {
  let color;
  switch (true) {
    case percentage <= 20:
      color = COLORS['0 - 100'];
      break;
    case percentage <= 40 && percentage > 20:
      color = COLORS['100 - 500'];
      break;
    case percentage <= 60 && percentage > 40:
      color = COLORS['500 - 1500'];
      break;
    case percentage <= 80 && percentage > 60:
      color = COLORS['1500 - 5000'];
      break;
    case percentage <= 100 && percentage > 80:
      color = COLORS['5000 - 10000'];
      break;
    case percentage > 10000:
      color = COLORS['> 10000'];
    default:
      color = '#ECECEF';
      break;
  }
  return color;
};

type ProtectionType = {
  location: string;
};
// widget data
export function useMangroveFisheries(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse, Error, ProtectionType>
) {
  const units = ['ha', 'km²'];

  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];
  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(locationType, id);

  const fetchMangroveFisheries = () =>
    API.request({
      method: 'GET',
      url: '/widgets/fisheries',
      params: {
        ...(!!location_id && { location_id: currentLocation }),
        ...params,
      },
      ...queryOptions,
    }).then((response) => response.data);
  const getChartData = (data) => {
    const protectedPercentage = (data.protected_area * 100) / data.total_area;
    const nonProtectedPercentage = 100 - protectedPercentage;

    return [
      {
        indicator: 'protected',
        value: data.protected_area,
        valueFormatted: numberFormat(data.protected_area),
        color: getColor(protectedPercentage),
        percentage: numberFormat(protectedPercentage),
      },
      {
        indicator: 'unprotected',
        value: data.total_area - data.protected_area,
        valueFormatted: numberFormat(data.total_area - data.protected_area),
        color: '#ECECEF',
        percentage: numberFormat(nonProtectedPercentage),
      },
    ];
  };

  const getLegendData = useCallback(
    () =>
      Object.keys(COLORS).map((key) => ({
        label: key,
        color: COLORS[key],
      })),
    []
  );
  return useQuery(['fisheries', location_id], fetchMangroveFisheries, {
    select: (data) => ({
      ...data?.data[0],
      ...data?.metadata,
      units,
      location,
      protectedArea: numberFormat(data?.data[0]?.protected_area),
      totalArea: numberFormat(data?.data[0]?.total_area),
      currentYear: 2020,
      config: {
        type: 'pie',
        totalArea: data?.data?.total_area,
        data: getChartData(data?.data[0]),
        chartBase: {
          type: 'pie',
          pies: {
            y: {
              value: 'protected',
              dataKey: 'value',

              customLabel: ({ viewBox }: { viewBox: PolarViewBox }) => {
                const { cx, cy } = viewBox;
                return (
                  <g>
                    <text
                      x={cx}
                      y={cy - 10}
                      className="recharts-text recharts-label-large"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      <tspan alignmentBaseline="middle" fill="rgba(0,0,0,0.85)" fontSize="28">
                        {numberFormat(
                          (data?.data?.[0].protected_area * 100) / data?.data?.[0].total_area
                        )}{' '}
                        %
                      </tspan>
                    </text>
                    <text
                      x={cx}
                      y={cy + 15}
                      className="recharts-text recharts-label-medium"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      <tspan alignmentBaseline="middle" fill="rgba(0,0,0,0.85)" fontSize="14">
                        Mangrove protected
                      </tspan>
                    </text>
                  </g>
                );
              },
            },
          },
        },
        tooltip: {
          content: (properties) => {
            const { active, payload } = properties;
            if (!active) return null;
            return <CustomTooltip {...properties} payload={payload[0].payload} />;
          },
        },
      },
      legend: getLegendData(),
    }),
    ...queryOptions,
  });
}

export function useSource(): SourceProps {
  return {
    id: 'fisheries-source',
    type: 'vector',
    url: 'mapbox://globalmangrovewatch.0i6otzu4',
  };
}

export function useLayers({ id }: { id: LayerProps['id'] }): LayerProps[] {
  return [
    {
      id,
      source: 'fisheries-source',
      'source-layer': 'protected_area_pct',
      type: 'fill',
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          '#cf597e',
          0.2,
          '#eeb479',
          0.4,
          '#e9e29c',
          0.6,
          '#9ccb86',
          0.8,
          '#009392',
        ],
        'fill-outline-color': [
          'interpolate',
          ['linear'],
          '#cf597e',
          0.2,
          '#eeb479',
          0.4,
          '#e9e29c',
          0.6,
          '#9ccb86',
          0.8,
          '#009392',
        ],
        'fill-opacity': 0.7,
      },
    },
  ];
}
