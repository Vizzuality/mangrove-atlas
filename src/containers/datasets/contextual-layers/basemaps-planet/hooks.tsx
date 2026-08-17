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

// Mosaics collapse to month granularity, so two mosaics acquired in the same month
// yield the same option `value` — an ambiguous Radix select value and a duplicate
// React key. Keep the first of each month.
const getDates = (data: Mosaics[] = []) => {
  const seen = new Set<string>();

  return data
    .filter((m) => m?.first_acquired)
    .map(({ first_acquired }) => ({
      value: format(new Date(first_acquired), 'yyyy-MM'),
      label: format(new Date(first_acquired), 'MMMM yyyy'),
    }))
    .filter(({ value }) => {
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
};

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
