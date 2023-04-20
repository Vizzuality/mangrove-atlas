import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

// widget data
export function useMangroveRestoration(
  params: UseParamsOptions,
  queryOptions: UseQueryOptions = {}
) {
  const fetchMangroveRestoration = () =>
    API.request({
      method: 'GET',
      url: '/widgets/restoration-potential',
      params,
    }).then((response) => response);

  const query = useQuery(['restoration-potential', params], fetchMangroveRestoration, {
    placeholderData: [],
    ...queryOptions,
  });

  const { data } = query;

  const DATA = useMemo(() => {
    if (!data) {
      return [];
    }

    return data;
  }, [data]);

  return useMemo(() => {
    return {
      ...query,
      data: DATA,
    } as typeof query;
  }, [query, DATA]);
}

export function useMangroveEcosystemServices(
  params: UseParamsOptions,
  queryOptions: UseQueryOptions = {}
) {
  const fetchMangroveEcosystemServices = () =>
    API.request({
      method: 'GET',
      url: '/widgets/ecosystem_services',
      params,
    }).then((response) => response);

  const query = useQuery(['ecosystem-services', params], fetchMangroveEcosystemServices, {
    placeholderData: [],
    ...queryOptions,
  });

  const { data } = query;

  const DATA = useMemo(() => {
    if (!data) {
      return [];
    }

    return data;
  }, [data]);

  return useMemo(() => {
    return {
      ...query,
      data: DATA,
    } as typeof query;
  }, [query, DATA]);
}

export function useMangroveDegradationAndLoss(
  params: UseParamsOptions,
  queryOptions: UseQueryOptions = {}
) {
  const fetchMangroveDegradationAndLoss = () =>
    API.request({
      method: 'GET',
      url: '/widgets/degradation-and-loss',
      params,
    }).then((response) => response);

  const query = useQuery(['degradation-and-loss', params], fetchMangroveDegradationAndLoss, {
    placeholderData: [],
    select: (data) => ({
      data,
    }),
    ...queryOptions,
  });

  return useMemo(() => {
    return {
      ...query,
    } as typeof query;
  }, [query]);
}

export function useSource(): SourceProps {
  return {
    type: 'vector',
    promoteId: 'ID',
  };
}
export function useLayers(): LayerProps[] {
  return [
    {
      id: 'restoration',
      type: 'fill',
      source: 'restoration',
      'source-layer': 'MOW_Global_Mangrove_Restoration_202212',
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
