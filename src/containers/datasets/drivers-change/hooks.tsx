import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { useRouter } from 'next/router';

import { percentFormat } from 'lib/format';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { variables } from 'containers/datasets/drivers-change/constants';
import Tooltip from 'containers/datasets/drivers-change/tooltip';
import type {
  DataResponse,
  Data,
  DriversChangeData,
  ColorKeysTypes,
} from 'containers/datasets/drivers-change/types';
import { useLocation } from 'containers/datasets/locations/hooks';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

const COLORS = ['#52BCA3', '#CC61B0', '#5D69B1', '#2F8AC4', '#DAA51B'];

const getColorKeys = (data: Data[]) =>
  data?.reduce((acc, d, i) => {
    return {
      ...acc,
      [d.variable]: COLORS[i],
    };
  }, {} satisfies ColorKeysTypes);

export function useMangroveDriversChange(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse>
): DriversChangeData {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0];
  const id = queryParams?.[1];
  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(locationType, id);

  const fetchMangroveDriversChange = () =>
    API.request({
      method: 'GET',
      url: '/widgets/drivers_of_change',
      params: {
        // ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...(!!location_id && location_id === 'worldwide' && { location_id: 2029 }),
        ...params,
      },
      ...queryOptions,
    }).then((response: AxiosResponse<DataResponse>) => response.data);

  const query = useQuery(['drivers_of_change', params], fetchMangroveDriversChange, {
    placeholderData: {
      data: [],
      metadata: null,
    },
    ...queryOptions,
  });

  const { data, isLoading, isFetched, isPlaceholderData } = query;

  return useMemo(() => {
    const colorKeys = getColorKeys(data?.data);

    const primaryDriver = data?.data?.find((d) => d.primary_driver)?.primary_driver;

    const ChartData = data?.data?.map((d) => ({
      label: variables[d.variable],
      value: d.value,
      showValue: true,
      valueFormatted: percentFormat(d.value),
      color: colorKeys[d.variable],
    }));

    const config = {
      type: 'pie',
      data: ChartData,
      dataKey: 'value',
      chartBase: {
        pies: {
          value: 'biomass',
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
    promoteId: 'ID',
    url: 'mapbox://globalmangrovewatch.4nuggpul',
  };
}

export function useLayers(): LayerProps[] {
  return [
    {
      id: 'mangrove_drivers_change',
      type: 'fill',
      source: 'main_loss_drivers',
      'source-layer': 'main_loss_drivers',
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'Rest_Score'],
          20,
          '#f9ddda',
          40,
          '#ffadad',
          60,
          '#ce78b3',
          80,
          '#8478ce',
          100,
          '#224294',
        ],
        'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.6],
        'fill-outline-color': [
          'interpolate',
          ['linear'],
          ['get', 'Rest_Score'],
          20,
          '#f9ddda',
          40,
          '#ffadad',
          60,
          '#ce78b3',
          80,
          '#8478ce',
          100,
          '#224294',
        ],
      },
    },
  ];
}
