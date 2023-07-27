import type { SourceProps, LayerProps } from 'react-map-gl';

import { formatAxis } from 'lib/format';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import { COLORS, LABELS } from './constants';
import CustomTooltip from './tooltip';
import type { CategoryIds } from './types';

type ColorKey = CategoryIds[];

type Data = {
  indicator: CategoryIds;
  value: number;
  color: string;
  category: CategoryIds;
};

type Metadata = {
  total: number;
  reports: { name: string; url: string }[];
};

type DataResponse = {
  data: Data[];
  metadata: Metadata;
};

const getColorKeys = (data: Data[]) =>
  data.reduce(
    (acc, d) => ({
      ...acc,
      [d.category]: COLORS[d.category],
    }),
    []
  );

const getChartData = (data: Data[], colorKeys: ColorKey[]) => {
  const total = data?.reduce((acc, d) => acc + d.value, 0);
  return data?.map((d) => {
    const percentage = (d.value * 100) / total;

    return {
      ...d,
      label: LABELS[d.category],
      value: percentage,
      showValue: false,
      highlightValue: false,
      valueFormatted: formatAxis(percentage),
      color: colorKeys[d.category],
    };
  });
};

type DataParsed = {
  total: number;
  reports: { name: string; url: string }[];
  config: unknown;
};

// widget data
export function useMangroveEcoregions(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse, Error, DataParsed>
) {
  const fetchMangroveIUCNEcoregions = () =>
    API.request({
      method: 'GET',
      url: '/widgets/ecoregions',
      params: {
        ...params,
      },
    }).then((response) => response.data);

  return useQuery(['iucn-ecoregion', params], fetchMangroveIUCNEcoregions, {
    select: ({ data, metadata }) => {
      const colorKeys = getColorKeys(data);
      const dataWithColors = getChartData(data, colorKeys);

      return {
        ...metadata,
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
      };
    },
    ...queryOptions,
  });
}

export function useSource(): SourceProps {
  return {
    id: 'mangrove-iucn-ecoregion-layer',
    type: 'vector',
    url: 'mapbox://globalmangrovewatch.20gft2fx',
  };
}

export function useLayers({ id }: { id: LayerProps['id'] }): LayerProps[] {
  const OVERALL_ASSESMENT = {
    CE: '#EE4D5A',
    EN: '#F97B57',
    VU: '#F3AD6A',
    NT: '#ECDA9A',
    LC: '#B4DCAA',
    DD: '#ECECEF',
  };
  const COLORS = Object.keys(OVERALL_ASSESMENT).reduce(
    (acc, value) => [...acc, [value, OVERALL_ASSESMENT[value]]].flat(),
    []
  );

  return [
    {
      id: `${id}-layer`,
      'source-layer': 'ecoregions_data',
      filter: ['has', 'overall_assessment'],
      type: 'fill',
      paint: {
        'fill-color': ['match', ['get', 'overall_assessment'], ...COLORS, '#ccc'],
        'fill-opacity': 0.65,
      },
    },
    {
      id: `${id}-border`,
      'source-layer': 'ecoregions_data',
      filter: ['has', 'overall_assessment'],
      type: 'line',
      paint: {
        'line-color': ['match', ['get', 'overall_assessment'], ...COLORS, '#ccc'],
        'line-width': 1.5,
      },
    },
  ];
}
