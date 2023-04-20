import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/cloud-functions';

// widget data

export function useAlerts(params: UseParamsOptions, queryOptions: UseQueryOptions = {}) {
  const fetchAlerts = () =>
    API.request({
      method: 'GET',
      url: '/fetch-alerts',
      params,
    }).then((response) => response);

  const query = useQuery(['alerts', params], fetchAlerts, {
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

// dataset layer
export function useSource(): SourceProps {
  return {
    id: 'alerts',
    type: 'geojson',
  };
}
export function useLayers(): LayerProps[] {
  return [
    {
      id: 'alerts-style-heat',
      type: 'heatmap',
      source: 'alerts',
      paint: {
        'heatmap-weight': ['interpolate', ['linear'], ['get', 'count'], 0, 0, 6, 1],
        'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0,
          'rgba(255, 194, 0, 1)',
          0.33,
          'rgba(235, 68, 68, 1)',
          0.66,
          'rgba(199, 43, 214, 1)',
          1,
          'rgba(210, 50, 169, 1)',
        ],
        'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
        'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 3, 1, 7, 0],
      },
    },
    {
      id: 'alerts-style-point',
      type: 'circle',
      source: 'alerts',
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          7,
          ['interpolate', ['linear'], ['get', 'count'], 1, 1, 6, 4],
          16,
          ['interpolate', ['linear'], ['get', 'count'], 1, 5, 6, 50],
        ],
        'circle-color': [
          'interpolate',
          ['linear'],
          ['get', 'count'],
          0,
          'rgba(255, 194, 0, 1)',
          0.33,
          'rgba(235, 68, 68, 1)',
          0.66,
          'rgba(199, 43, 214, 1)',
          1,
          'rgba(210, 50, 169, 1)',
        ],
        'circle-stroke-color': 'white',
        'circle-stroke-width': 0.5,
        'circle-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0, 8, 1],
      },
    },
  ];
}
