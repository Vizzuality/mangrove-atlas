import { useCallback } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { useRouter } from 'next/router';

import { numberFormat } from 'lib/format';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import type { Visibility } from 'mapbox-gl';
import { PolarViewBox } from 'recharts/types/util/types';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import { COLORS } from './constants';
import CustomTooltip from './tooltip';
import type { DataResponse } from './types';

const getColor = (percentage) => {
  let color: string;
  switch (true) {
    case percentage <= 20:
      color = COLORS['0% - 20%'];
      break;
    case percentage <= 40 && percentage > 20:
      color = COLORS['20% - 40%'];
      break;
    case percentage <= 60 && percentage > 40:
      color = COLORS['40% - 60%'];
      break;
    case percentage <= 80 && percentage > 60:
      color = COLORS['60% - 80%'];
      break;
    case percentage <= 100 && percentage > 80:
      color = COLORS['80% - 100%'];
      break;
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
export function useMangrovesInProtectedAreas(
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
  } = useLocation(id, locationType);

  const { unit, ...restParams } = params;
  const fetchMangroveProtectedAreas = () =>
    API.request({
      method: 'GET',
      url: '/widgets/protected-areas',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        unit,
        ...restParams,
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
        unit,
      },
      {
        indicator: 'unprotected',
        value: data.total_area - data.protected_area,
        valueFormatted: numberFormat(data.total_area - data.protected_area),
        color: '#ECECEF',
        percentage: numberFormat(nonProtectedPercentage),
        unit,
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
  return useQuery(['protected-areas', restParams, location_id], fetchMangroveProtectedAreas, {
    select: (data) => ({
      ...data?.data[0],
      ...data?.metadata,
      units,
      location,
      protectedArea:
        unit === 'ha'
          ? numberFormat(data?.data[0]?.protected_area)
          : numberFormat(data?.data[0]?.protected_area / 100),
      totalArea:
        unit === 'ha'
          ? numberFormat(data?.data[0]?.total_area)
          : numberFormat(data?.data[0]?.total_area / 100),
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
    id: 'protection-source',
    type: 'vector',
    url: 'mapbox://globalmangrovewatch.0i6otzu4',
  };
}

export function useLayers({
  id,
  opacity,
  visibility = 'visible',
}: {
  id: LayerProps['id'];
  opacity?: number;
  visibility?: Visibility;
}): LayerProps[] {
  return [
    {
      id,
      source: 'protected-areas',
      'source-layer': 'protected_area_pct',
      type: 'fill',
      paint: {
        'fill-color': [
          'step',
          ['get', 'pct_protected'],
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
          'step',
          ['get', 'pct_protected'],
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
        'fill-opacity': opacity,
      },
      layout: {
        visibility,
      },
    },
  ];
}
