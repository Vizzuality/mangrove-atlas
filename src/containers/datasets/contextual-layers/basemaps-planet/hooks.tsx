import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { format } from 'date-fns';

import { MosaicId } from 'types/widget';

import { PlanetAPI } from 'services/api';
interface UseParamsOptions {
  name_contains: 'Visual Biannual' | 'Analytic Biannual' | 'Visual Monthly' | 'Visual Biannual';
}

type Mosaics = {
  [key: string]: string | number;
  last_acquired: string;
  first_acquired: string;
  label: string;
  value: string;
};

type MosaicsResponse = {
  links?: { [key: string]: string | number };
  mosaics?: Mosaics[];
  data?: Mosaics[];
};

const getDates = (data: Mosaics[] = []) =>
  data
    .filter((m) => m?.first_acquired)
    .map(({ first_acquired }) => ({
      value: format(new Date(first_acquired), 'yyyy-MM'),
      label: format(new Date(first_acquired), 'MMMM yyyy'),
    }));

type DateOption = { value: string; label: string };

export function useMosaicsFromSeriesPlanetSatelliteBasemaps(
  id: MosaicId,
  paramsOptions?: UseParamsOptions,
  queryOptions?: Omit<UseQueryOptions<MosaicsResponse, Error, DateOption[]>, 'select'>
) {
  const fetchPlanetMosaics = () =>
    PlanetAPI.request<MosaicsResponse>({
      method: 'GET',
      url: `/series/${id}/mosaics`,
      params: paramsOptions,
    }).then((response) => response.data);

  return useQuery({
    queryKey: ['planet-satellite-mosaic-from-series', paramsOptions, id],
    queryFn: fetchPlanetMosaics,
    select: (raw: MosaicsResponse) => getDates(raw?.mosaics ?? raw?.data ?? []),
    ...queryOptions,
  });
}
