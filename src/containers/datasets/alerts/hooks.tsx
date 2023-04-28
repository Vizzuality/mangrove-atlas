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
    data: 'https://us-central1-mangrove-atlas-246414.cloudfunctions.net/fetch-alerts-heatmap?{{startDate}}{{endDate}}{{locationId}}',
  };
}
export function useLayers(): LayerProps[] {
  return [
    {
      id: 'alerts-style-heat',
      type: 'heatmap',
      source: 'alerts',
      maxzoom: 12,
      paint: {
        // Increase the heatmap weight based on frequency and property magnitude
        'heatmap-weight': ['interpolate', ['linear'], ['get', 'count'], 0, 0, 6, 1],
        // Increase the heatmap color weight weight by zoom level
        // heatmap-intensity is a multiplier on top of heatmap-weight
        'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
        // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
        // Begin color ramp at 0-stop with a 0-transparancy color
        // to create a blur-like effect.
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0,
          'rgba(33,102,172,0)',
          0.1,
          'rgba(255, 194, 0, 1)',
          0.2,
          'rgba(246, 165, 34, 1)',
          0.4,
          'rgba(237, 136, 68, 1)',
          0.6,
          'rgba(228, 108, 101, 1)',
          0.8,
          'rgba(219, 79, 135, 1)',
          1,
          'rgba(210, 50, 169, 1)',
        ],
        // Adjust the heatmap radius by zoom level
        'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
        // Transition from heatmap to circle layer by zoom level
        'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 2, 1, 9, 0],
      },
    },
    {
      id: 'alerts-style-point',
      type: 'circle',
      source: 'alerts',
      minzoom: 0,
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
        'circle-stroke-color': '#b70088',
        'circle-stroke-width': 0.5,
        'circle-opacity': ['interpolate', ['linear'], ['zoom'], 0, 0.5, 0.7, 1],
      },
    },
  ];
}
