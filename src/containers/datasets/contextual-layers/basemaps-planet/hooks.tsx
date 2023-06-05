import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { format } from 'date-fns';

import { PlanetAPI } from 'services/api';
interface UseParamsOptions {
  name_contains: 'Visual Biannual' | 'Analytic Biannual' | 'Visual Monthly' | 'Visual Biannual';
}

const getDates = (data) => {
  return data.map(({ first_acquired }) => ({
    value: format(new Date(first_acquired), 'yyyy-MM'),
    label: format(new Date(first_acquired), 'MMMM yyyy'),
  }));
};

export function useMosaicsFromSeriesPlanetSatelliteBasemaps(
  id: string,
  paramsOptions?: UseParamsOptions,
  queryOptions?: UseQueryOptions<{
    links: { [key: string]: string | number };
    mosaics: {
      last_acquired: 'string';
      first_acquired: 'string';
      [key: string]: string | number;
    };
  }>
) {
  const fetchPlanetMosaics = () =>
    PlanetAPI.request({
      method: 'GET',
      url: `/series/${id}/mosaics`,
      params: {
        paramsOptions,
      },
    }).then((response) => response.data);

  return useQuery(['planet-satellite-mosaic-from-series', paramsOptions, id], fetchPlanetMosaics, {
    select: ({ mosaics }) => {
      return getDates(mosaics);
    },
    ...queryOptions,
  });
}
