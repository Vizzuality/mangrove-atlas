import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import orderBy from 'lodash-es/orderBy';

import { numberFormat } from 'lib/format';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import type { DataResponse, BlueCarbon } from './types';

const COLORS = {
  '0-700': '#EEB66B',
  '700-1400': '#E68518',
  '1400-2100': '#B84E17',
  '2100-2800': '#933A06',
  '2800-3500': '#5C4A3D',
};

// widget data
export function useMangroveBlueCarbon(
  params: UseParamsOptions,
  queryOptions: UseQueryOptions<DataResponse>
): BlueCarbon {
  const fetchMangroveBlueCarbon = () =>
    API.request({
      method: 'GET',
      url: '/widgets/blue_carbon',
      params,
    }).then((response: AxiosResponse<DataResponse>) => response.data);

  const query = useQuery(['blue-carbon', params], fetchMangroveBlueCarbon, {
    placeholderData: {
      data: [],
      metadata: {
        soc: null,
        toc: null,
        agb: null,
        units: null,
      },
    },
    // select: (data) => ({
    //   data,
    // }),
    ...queryOptions,
  });
  const { data, isLoading } = query;
  return useMemo(() => {
    const orderedData = orderBy(
      data.data.map((d) => ({
        ...d,
        shortLabel: Number(d.indicator.split('-', 1)[0]),
      })),
      'shortLabel'
    );

    const ChartData = orderedData.map((d) => ({
      label: d.indicator,
      value: d.value,
      color: COLORS[d.indicator],
    }));

    const { agb, toc, soc } = data.metadata;
    const config = {
      type: 'pie',
      data: ChartData,
      // tooltip: TooltipData,
      chartBase: {
        pies: {
          value: 'blue-carbon',
        },
      },
    };
    return {
      isLoading,
      agb: numberFormat(agb / 1000000),
      toc: numberFormat(toc / 1000000),
      soc: numberFormat(soc / 1000000),
      config,
    };
  }, [query]);
}

export function useSource(): SourceProps {
  return {
    id: 'blue-carbon-source',
    type: 'raster',
    tiles: [
      'https://mangrove_atlas.storage.googleapis.com/tilesets/toc_co2eha-1_2016_z0z12/{z}/{x}/{y}.png',
    ],
    minzoom: 0,
    maxzoom: 12,
  };
}
export function useLayer(): LayerProps {
  return {
    id: 'blue-carbon-layer',
    type: 'raster',
  };
}
