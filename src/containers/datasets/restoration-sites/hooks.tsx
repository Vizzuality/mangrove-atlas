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

  const fetchMangroveRestorationSites = () =>
    API.request({
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
      select: ({ data }) => ({
        data,
        location,
      }),
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
export function useLayer({
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
        'circle-color': '#CC61B0',
        'circle-stroke-width': 1,
        'circle-stroke-color': '#CC61B0',
        'circle-radius': ['step', ['get', 'point_count'], 10, 100, 20, 500, 30],
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
        'circle-stroke-color': '#CC61B0',
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
        'text-field': ['get', 'point_count_abbreviated'],
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-size': 12,
        visibility,
      },
      paint: {
        'text-color': '#ffffff',
        'text-opacity': opacity,
      },
    },
  ];
}
