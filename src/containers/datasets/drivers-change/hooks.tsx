import { useMemo } from 'react';

import type { LayerProps, SourceProps } from 'react-map-gl';

import { useRouter } from 'next/router';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import type { Visibility } from 'mapbox-gl';

import { COLORS, variables } from 'containers/datasets/drivers-change/constants';
import Tooltip from 'containers/datasets/drivers-change/tooltip';
import type {
  ColorKeysTypes,
  Data,
  DataResponse,
  DriversChangeData,
} from 'containers/datasets/drivers-change/types';
import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';

import API from 'services/api';

const getColorKeys = (data: Data[]) =>
  data?.reduce((acc, d, i) => {
    return {
      ...acc,
      [d.variable]: COLORS[i],
    };
  }, {} satisfies ColorKeysTypes);

export function useMangroveDriversChange(
  queryOptions?: UseQueryOptions<DataResponse>
): DriversChangeData {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];
  const {
    data: { name: location, id: currentLocation },
  } = useLocation(id, locationType);

  const fetchMangroveDriversChange = () =>
    API.request({
      method: 'GET',
      url: '/widgets/drivers_of_change',
      params: {
        location_id: currentLocation,
      },
      ...queryOptions,
    }).then((response: AxiosResponse<DataResponse>) => response.data);

  const query = useQuery(['drivers_of_change', currentLocation], fetchMangroveDriversChange, {
    placeholderData: {
      data: [],
      metadata: null,
    },
    ...queryOptions,
  });

  const { data, isLoading, isFetched, isPlaceholderData } = query;
  const noData = isFetched && !data?.data?.length;

  return useMemo(() => {
    const colorKeys = getColorKeys(data?.data);

    const primaryDriver = data?.data?.find((d) => d.primary_driver)?.primary_driver;

    const ChartData = data?.data?.map((d) => ({
      label: variables[d.variable],
      value: d.value,
      showValue: true,
      valueFormatted: d.value.toFixed(2) + '%',
      color: colorKeys[d.variable],
    }));

    const config = {
      type: 'pie',
      data: ChartData,
      dataKey: 'value',
      chartBase: {
        pies: {
          value: '',
        },
      },
      tooltip: {
        content: (properties) => {
          return <Tooltip {...properties} payload={properties.payload?.[0]?.payload?.payload} />;
        },
      },
      legend: {
        title: '',
        items: ChartData,
      },
    };

    return {
      noData,
      config,
      primaryDriver,
      isLoading,
      location,
      isFetched,
      isPlaceholderData,
    };
  }, [data, isLoading, isFetched, isPlaceholderData, location]);
}

export function useSource(): SourceProps {
  return {
    type: 'vector',
    id: 'main_loss_drivers',
    url: 'mapbox://globalmangrovewatch.4nuggpul',
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
  const PRIMARY_DRIVERS = [
    { id: 'Erosion', color: '#CC61B0' },
    { id: 'Episodic Disturbances', color: '#5D69B1' },
    { id: 'Commodities', color: '#DAA51B' },
    { id: 'Settlement', color: '#2F8AC4' },
    { id: 'NPC', color: '#52BCA3' },
  ];

  const COLORS = PRIMARY_DRIVERS.map(({ id: i, color }) => {
    return [i, color];
  }).flat();

  return [
    {
      id,
      type: 'fill',
      source: 'main_loss_drivers',
      'source-layer': 'main_loss_drivers',
      paint: {
        'fill-color': ['match', ['get', 'primary_driver'], ...COLORS, '#ccc'],
        'fill-opacity': opacity * 0.65,
      },
      layout: {
        visibility,
      },
    },
    {
      id: `${id}-line`,
      type: 'line',
      source: 'main_loss_drivers',
      'source-layer': 'main_loss_drivers',
      paint: {
        'line-color': ['match', ['get', 'primary_driver'], ...COLORS, '#ccc'],
        'line-opacity': opacity,
        'line-width': 1.5,
      },
      layout: {
        visibility,
      },
    },
  ];
}
