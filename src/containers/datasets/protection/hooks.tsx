import { useCallback } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { useRouter } from 'next/router';

import { numberFormat } from 'lib/format';

import { widgetYearAtom } from 'store/widgets';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { PolarViewBox } from 'recharts/types/util/types';
import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import CustomTooltip from './tooltip';
import type { DataResponse } from './types';

const COLORS = {
  '0% - 20%': 'rgba(207, 89, 126, 0.7)',
  '20% - 40%': 'rgba(238, 180, 121, 0.7)',
  '40% - 60%': 'rgba(233, 226, 156, 0.7)',
  '60% - 80%': 'rgba(156, 203, 134, 0.7)',
  '80% - 100%': 'rgba(0, 147, 146, 0.7)',
};

const getColor = (percentage) => {
  let color;
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
export function useMangroveProtectedAreas(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse, Error, ProtectionType>
) {
  const currentYear = useRecoilValue(widgetYearAtom);
  const units = ['ha', 'km²'];

  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0];
  const id = queryParams?.[1];
  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(locationType, id);

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
    [location, unit, currentYear]
  );
  return useQuery(['protected-areas', restParams, location_id], fetchMangroveProtectedAreas, {
    select: (data) => ({
      ...data?.data[0],
      ...data?.metadata,
      units,
      location,
      protectedPercentage: numberFormat((data.protected_area * 100) / data.total_area),
      nonProtectedPercentage: numberFormat(100 - (data.protected_area * 100) / data.total_area),
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

export function useLayers({ id }: { id: LayerProps['id'] }): LayerProps[] {
  return [
    {
      id,
      source: 'protected-areas',
      'source-layer': 'protected_area_pct',
      type: 'fill',
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'pct_protected'],
          0,
          '#CF597E',
          0.4,
          '#EEB479',
          0.6,
          '#E9E29C',
          0.8,
          '#9CCB86',
          1,
          '#009392',
        ],
        'fill-outline-color': [
          'interpolate',
          ['linear'],
          ['get', 'pct_protected'],
          0,
          '#CF597E',
          0.4,
          '#EEB479',
          0.6,
          '#E9E29C',
          0.8,
          '#9CCB86',
          1,
          '#009392',
        ],
        'fill-opacity': 0.7,
      },
    },
  ];
}
