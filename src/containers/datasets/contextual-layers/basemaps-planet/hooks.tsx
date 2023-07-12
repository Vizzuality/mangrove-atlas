import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { format } from 'date-fns';
import { orderBy } from 'lodash-es';

import { MosaicId } from 'types/widget';

import { PlanetAPI } from 'services/api';
interface UseParamsOptions {
  name_contains: 'Visual Biannual' | 'Analytic Biannual' | 'Visual Monthly' | 'Visual Biannual';
}

type Mosaics = {
  last_acquired: 'string';
  first_acquired: 'string';
  label: string;
  value: string;
  [key: string]: string | number;
};

const getDates = (data) =>
  data.map(({ first_acquired }) => ({
    value: format(new Date(first_acquired), 'yyyy-MM'),
    label: format(new Date(first_acquired), 'MMMM yyyy'),
  }));

export function useMosaicsFromSeriesPlanetSatelliteBasemaps(
  id: MosaicId,
  paramsOptions?: UseParamsOptions,
  queryOptions?: UseQueryOptions<{
    links: { [key: string]: string | number };
    mosaics: Mosaics[];
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
    select: ({ mosaics }: Mosaics) => {
      return getDates(mosaics);
    },
    ...queryOptions,
  });
}
