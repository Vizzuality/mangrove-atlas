import type { SourceProps, LayerProps } from 'react-map-gl';

import { useRouter } from 'next/router';

import {
  RestorationSitesMapFilters,
  RestorationSitesFiltersApplication,
} from 'store/widgets/restoration-sites';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Visibility } from 'mapbox-gl';
import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';
import { STAGING_API } from 'services/api';

import type { Data, DataResponse, DataFilters } from './types';

// widget data
export function useMangroveRestorationSites(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse, Error, Data>
) {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];
  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(id, locationType);
  const mapFilters = useRecoilValue(RestorationSitesMapFilters);
  const filtersPending = useRecoilValue(RestorationSitesFiltersApplication);

  // TO - DO - remove when API gets ready
  const fetchMangroveRestorationSites = () =>
    STAGING_API.request({
      method: 'GET',
      url: '/widgets/sites',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...params,
        ...(filtersPending && { ...mapFilters }),
      },
    }).then((response) => response.data);

  return useQuery(
    ['restoration-sites', mapFilters, currentLocation, filtersPending],
    fetchMangroveRestorationSites,
    {
      select: ({ data }) => {
        return {
          data,
          location,
        };
      },
      ...queryOptions,
    }
  );
}

export function useMangroveRestorationSitesFilters(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse, Error, DataFilters>
) {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];
  const {
    data: { id: currentLocation, location_id },
  } = useLocation(id, locationType);
  const fetchMangroveRestorationSitesFilters = () =>
    API.request({
      method: 'GET',
      url: '/widgets/sites_filters',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...params,
      },
    }).then((response) => response.data);

  return useQuery(
    ['restoration-sites-filters', currentLocation],
    fetchMangroveRestorationSitesFilters,
    {
      select: ({ data }) => ({
        data,
      }),
      ...queryOptions,
    }
  );
}

export function useSource(): SourceProps {
  const { data } = useMangroveRestorationSites();
  const restorationSiteFeatures = data?.data
    .filter((site) => !!site.site_centroid)
    .map(({ site_centroid, landscape_name, organizations, site_name }) => {
      if (site_centroid) {
        return {
          type: 'Feature',
          geometry: JSON.parse(site_centroid),
          properties: {
            landscape_name,
            organizations,
            site_name,
          },
        };
      }
    });

  if (!restorationSiteFeatures) return null;

  return {
    id: 'mangrove_rest_sites',
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: restorationSiteFeatures,
    },
    cluster: true,
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
  return [
    {
      id: `${id}-clusters`,
      metadata: {
        position: 'top',
      },
      type: 'circle',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#CC61B0', // color for small clusters
          50,
          '#FF9F1C', // medium clusters
          200,
          '#FF4040', // large clusters
        ],
        'circle-stroke-width': 1,
        'circle-stroke-color': '#FFFFFF',
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          15, // radius for clusters with 1-25 points
          15,
          25, // radius for clusters with 25-50 points
          50,
          35, // radius for clusters with 50+ points
        ],
        'circle-opacity': opacity,
        'circle-stroke-opacity': opacity,
      },
      layout: {
        visibility,
      },
    },
    {
      id: `${id}-clusters-points`,
      metadata: {
        position: 'top',
      },
      type: 'circle',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#CC61B0',
        'circle-radius': 5,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#FFFFFF',
        'circle-opacity': opacity,
        'circle-stroke-opacity': opacity,
      },
      layout: {
        visibility,
      },
    },
    {
      id: `${id}-cluster-count`,
      metadata: {
        position: 'top',
      },
      type: 'symbol',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': [
          'format',
          ['get', 'point_count_abbreviated'],
          { 'font-scale': 1.2 },
          ['get', 'category'],
          { 'font-scale': 0.8 },
          '\n',
          {},
        ],
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-size': 12,
        visibility,
      },
      paint: {
        'text-color': '#ffffff',
        'text-halo-color': '#fff',
        'text-halo-width': 0.5,
        'text-opacity': opacity,
      },
    },
  ];
}
