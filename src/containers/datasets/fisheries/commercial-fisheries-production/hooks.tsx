import type { LayerProps, RasterSource } from 'react-map-gl';

import { useRouter } from 'next/router';

import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { Visibility } from 'mapbox-gl';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import type { ApiResponse, Data, DataResponse, ApiData } from './types';

export function useMangroveCommercialFisheriesProduction<TData = DataResponse>(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse, Error, TData>
): UseQueryResult<TData, Error> {
  const {
    query: { params: queryParams },
  } = useRouter();

  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];

  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(id, locationType);

  const fetchMangroveFisheryMitigationPotentials = async (): Promise<DataResponse> => {
    const response = await API.request<ApiResponse>({
      method: 'GET',
      url: '/widgets/fishery_mitigation_potentials',
      params: {
        ...(location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...params,
      },
    });

    const rawList: ApiData[] =
      'data' in response.data
        ? (response.data.data as ApiData[])
        : ((response.data as any).indicators as ApiData[]);

    const data: DataResponse['data'] = rawList.map((d) => ({
      ...d,
      indicator: d.indicator === 'fish' ? 'finfish' : d.indicator,
    }));

    return {
      location,
      metadata: (response.data as any).metadata,
      data,
    };
  };

  return useQuery<DataResponse, Error, TData>(
    ['fishery-mitigation-potentials', params, location_id],
    fetchMangroveFisheryMitigationPotentials,
    { ...(queryOptions || {}) }
  );
}

export function useSource({ filter }: { filter?: Data['indicator'] }): RasterSource {
  const tiles = {
    bivalve:
      'https://storage.googleapis.com/mangrove_atlas/staging/tilesets/fishing_enhancement_bivalve/{z}/{x}/{y}.png',

    crab: 'https://storage.googleapis.com/mangrove_atlas/staging/tilesets/fishing_enhancement_crab/{z}/{x}/{y}.png',

    finfish:
      'https://storage.googleapis.com/mangrove_atlas/staging/tilesets/fishing_enhancement_fish/{z}/{x}/{y}.png',

    shrimp:
      'https://storage.googleapis.com/mangrove_atlas/staging/tilesets/fishing_enhancement_shrimp/{z}/{x}/{y}.png',
  };

  const key = filter ?? 'finfish';

  return {
    id: 'mangrove_commercial_fisheries_production-source',
    type: 'raster',
    tiles: [tiles[key]],
    minzoom: 0,
    maxzoom: 12,
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
}): LayerProps {
  return {
    id,
    type: 'raster',
    paint: {
      'raster-opacity': opacity,
    },
    layout: {
      visibility,
    },
  };
}
