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
import type { DataResponse, Data } from './types';

const COLORS = ['#FCDE9C', '#FAA476', '#F0746E', '#E34F6F', '#B9257A', '#7C1D6F'];

const getChartDataFiltered = (array) => {
  const updated = [];

  for (const element of array) {
    const value = 100 - element.value;

    const modifiedObject = {
      ...element,
      value: value,
      category: null,
      label: null,
      color: '#ECECEF',
    };

    updated.push(element, modifiedObject);
  }

  return updated;
};
const getColorKeys = (data) =>
  data.reduce(
    (acc, d, index) => ({
      ...acc,
      [d]: COLORS[index],
    }),
    []
  );

type ProtectionType = {
  location: string;
};

const getCategory = (value) => {
  let category;
  switch (true) {
    case value > 0 && value <= 50:
      category = '0 - 50';
      break;
    case value > 50 && value <= 200:
      category = '>50 - 200';
      break;
    case value > 200 && value <= 700:
      category = '>200 - 700';
      break;
    case value > 700 && value <= 2000:
      category = '>700 - 2000';
      break;
    case value > 2000:
      category = '>2000';
      break;
    default:
      category = '>2000';
      break;
  }
  return category;
};
// widget data
export function useMangroveFisheries(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse, Error, ProtectionType>
) {
  const getChartData = (data: Data[], colorKeys, min, max) => {
    const total = data?.reduce((acc, d) => acc + d.value, 0);
    return data?.map((d) => {
      const percentage = (d.value * 100) / total;
      return {
        ...d,
        label: d.category,
        value: percentage,
        showValue: false,
        valueFormatted: `${numberFormat(percentage)} %`,
        color: colorKeys[d.category],
        min,
        max,
      };
    });
  };

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

  return useQuery(['fisheries', location_id], fetchMangroveFisheries, {
    select: (data) => {
      const dataFiltered = data?.data?.filter(
        (d) => d.category !== 'median' && d.category !== 'range_max' && d.category !== 'range_min'
      );
      const median = data?.data?.find((d) => d.category === 'median')?.value;
      const rangeMax = data?.data?.find((d) => d.category === 'range_max')?.value;
      const rangeMin = data?.data?.find((d) => d.category === 'range_min')?.value;
      const unit = data?.metadata?.unit;
      const categories = dataFiltered?.map((d) => d.category);
      const colorKeys = getColorKeys(categories);
      const category = getCategory(median);
      const dataWithColors = getChartData(dataFiltered, colorKeys, rangeMin, rangeMax);

      const dataToShow = dataWithColors.filter((d) => d.category === category);

      return {
        ...data?.data,
        ...data?.metadata,
        config: {
          type: 'pie',
          data: getChartDataFiltered(dataToShow),
          legend: dataWithColors,
          chartBase: {
            type: 'pie',
            pies: {
              y: {
                value: 'value',
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
                          {median}
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
                          {unit}
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
        median,
        rangeMax,
        rangeMin,
        location,
      };
    },
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
