import type { SourceProps, LayerProps } from 'react-map-gl';

import { useRouter } from 'next/router';

import { numberFormat, formatAxis } from 'lib/format';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { PolarViewBox } from 'recharts/types/util/types';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import CustomTooltip from './tooltip';
import type { DataResponse, Data } from './types';

const COLORS = ['#F3E79B', '#FAC484', '#F0746E', '#B9257A', '#701A64'];

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

// widget data
export function useMangroveFisheries(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse, Error, ProtectionType>
) {
  const getChartData = (data: Data[], colorKeys, unit) => {
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
        unit,
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
      const medianFormatted = median === 0 ? formatAxis(median) : median;
      const max = data?.data?.find((d) => d.category === 'range_max')?.value;
      const rangeMax = max === 0 ? max : formatAxis(max);
      const min = data?.data?.find((d) => d.category === 'range_min')?.value;
      const rangeMin = min === 0 ? min : formatAxis(min);
      const unit = data?.metadata?.unit;
      const categories = dataFiltered?.map((d) => d.category);
      const colorKeys = getColorKeys(categories);
      const dataWithColors = getChartData(dataFiltered, colorKeys, unit);

      return {
        ...data?.data,
        ...data?.metadata,
        config: {
          type: 'pie',
          data: dataWithColors,
          legend: dataWithColors,
          chartBase: {
            type: 'pie',
            pies: {
              y: {
                value: 'value',
                dataKey: 'value',

                customLabel: ({ viewBox }: { viewBox: PolarViewBox }) => {
                  const { cx, cy } = viewBox;
                  if (!median) return null;
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
                          {formatAxis(median)}
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
                          {/* {unit} */}
                          fisher days
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
        median: medianFormatted,
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
    id: 'allen-coral-reef',
    type: 'raster',
    tiles: [
      'https://mangrove_atlas.storage.googleapis.com/staging/tilesets/fishing_intensity_mangroves_updated/{z}/{x}/{y}.png',
    ],
    minzoom: 0,
    maxzoom: 12,
  };
}

export function useLayer({ id }: { id: LayerProps['id'] }): LayerProps {
  return {
    id,
    type: 'raster',
  };
}
