import type { LayerProps, SourceProps } from 'react-map-gl';

import { formatAxis } from '@/lib/format';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { Visibility } from '@/types/layers';
import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import { COLORS, LABELS, OVERALL_ASSESSMENT } from './constants';
import type { CategoryId } from './constants';
import CustomTooltip from './tooltip';
import type { CategoryIds } from './types';

type ColorKeys = Partial<Record<CategoryId, string>>;

type Data = {
  indicator: CategoryIds;
  value: number;
  color: string;
  category: CategoryIds;
};

const toCategoryId = (category: CategoryIds) => category.toLowerCase() as CategoryId;

type Metadata = {
  total: number;
  reports: { name: string; url: string }[];
};

type DataResponse = {
  data: Data[];
  metadata: Metadata;
};

const getColorKeys = (data: Data[]): ColorKeys =>
  data?.reduce<ColorKeys>((acc, d) => {
    const key = toCategoryId(d.category);
    return { ...acc, [key]: COLORS[key] };
  }, {});

const REPORTS = [
  {
    name: 'RLE Mangroves of the Sunda Shelf (pdf)',
    url: 'https://ecoevorxiv.org/repository/view/5866/',
  },
  {
    name: 'RLE Mangroves of the Western Coral Triangle (pdf)',
    url: 'https://ecoevorxiv.org/repository/view/5867/',
  },
  {
    name: 'RLE Mangroves of the Andaman (pdf)',
    url: 'https://ecoevorxiv.org/repository/view/5862/',
  },
  {
    name: 'RLE Mangroves of the South China Sea (pdf)',
    url: 'https://ecoevorxiv.org/repository/view/5865/',
  },
];

const getChartData = (data: Data[], colorKeys: ColorKeys) => {
  const total = data?.reduce((acc, d) => acc + d.value, 0);
  return data?.map((d) => {
    const percentage = (d.value * 100) / total;
    const key = toCategoryId(d.category);

    return {
      ...d,
      label: LABELS[key],
      percentage,
      percentageFormatted: formatAxis(percentage),
      showValue: false,
      highlightValue: false,
      color: colorKeys[key],
    };
  });
};

type DataParsed = {
  total: number;
  ecoregion_total?: number;
  reports: { name: string; url: string }[];
  config: {
    type: string;
    data: any[];
    legend: any[];
    chartBase: any;
    tooltip: any;
  };
};

// widget data
export function useMangroveEcoregions(
  params?: UseParamsOptions,
  queryOptions?: Omit<UseQueryOptions<DataResponse, Error, DataParsed>, 'queryKey' | 'queryFn'>
) {
  const fetchMangroveIUCNEcoregions = () =>
    API.request({
      method: 'GET',
      url: '/widgets/ecoregions',
      params: {
        ...params,
      },
    }).then((response) => response.data);

  return useQuery({
    queryKey: ['iucn-ecoregion', params],
    queryFn: fetchMangroveIUCNEcoregions,
    select: ({ data, metadata }) => {
      const colorKeys = getColorKeys(data);
      const dataWithColors = getChartData(data, colorKeys);

      return {
        ...metadata,
        reports: metadata?.reports.length ? metadata?.reports : REPORTS,
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
    id: 'mangrove-iucn-ecoregion',
    type: 'vector',
    url: 'mapbox://globalmangrovewatch.v2xt8m',
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
  const matchColors = Object.entries(OVERALL_ASSESSMENT).flat();

  return [
    {
      id: `${id}-layer`,
      source: 'mangrove-iucn-ecoregion',
      'source-layer': 'ecoregions_data',
      filter: ['has', 'overall_assessment'],
      type: 'fill',
      paint: {
        'fill-color': ['match', ['get', 'overall_assessment'], ...matchColors, '#ccc'],

        'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, opacity * 0.55],
      },
      layout: {
        visibility,
      },
    },
    {
      id: `${id}-border`,
      source: 'mangrove-iucn-ecoregion',
      'source-layer': 'ecoregions_data',
      filter: ['has', 'overall_assessment'],
      type: 'line',
      paint: {
        'line-color': ['match', ['get', 'overall_assessment'], ...matchColors, '#ccc'],
        'line-width': 1.75,
        'line-offset': -0.3,
        'line-opacity': opacity * 0.55,
      },
      layout: {
        visibility,
      },
    },
  ];
}
