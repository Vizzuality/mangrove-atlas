import { useMemo } from 'react';

import { format } from 'd3-format';

const numberFormat = format(',.2f');

import type { SourceProps, LayerProps } from 'react-map-gl';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import { AxiosResponse } from 'axios';

// type ExtentLegend = {

// }
type Metadata = {
  location_id: string;
  note: null;
  total_area: number;
  total_lenght: number;
  units: { habitat_extent_area: string; linear_coverage: string };
  year: number[];
};

type DataResponse = {
  data: string[] | [];
  metadata: Metadata;
};
type Unit = {
  [key: string]: string;
};
type Indicator = {
  year: number;
  linear_coverage: number;
  habitat_extent_area: number;
};
type Data = { year: number; value: number; indicator: 'habitat_extent_area' | 'linear_coverage' };
type ExtentData = {
  data: Data[];
  metadata: Metadata;
  area: string;
  nonMangrove: string;
  mangroveCoastCoveragePercentage: string;
  totalLength: string;
  years: number[]; // API improvement, change year to years as is an array
  units: Unit[];
};
// widget data
export function useMangroveHabitatExtent(
  params: UseParamsOptions,
  queryOptions: UseQueryOptions<ExtentData>
) {
  const fetchHabitatExtent = () =>
    API.request({
      method: 'GET',
      url: 'widgets/habitat_extent',
      params,
    }).then((response: AxiosResponse<DataResponse>) => response.data);
  const { location_id, unit, year } = params;
  // TO DO - add year filter to API
  const query = useQuery(['habitat-extent', location_id], fetchHabitatExtent, {
    placeholderData: {
      metadata: null,
      data: null,
      area: null,
      nonMangrove: null,
      mangroveCoastCoveragePercentage: null,
      totalLength: null,
      years: [], // API improvement, change year to years as is an array
      units: [],
    },
    ...queryOptions,
  });

  const { data, isSuccess } = query;

  const metadata = data.metadata;
  const dataByYear = data.data?.filter(({ year: y }) => y === year);
  const dataParsed = dataByYear?.reduce(
    (acc, data) => ({
      ...acc,
      year: data.year,
      [data.indicator]: data.value,
    }),
    {} as Indicator
  );
  // API improvement - fix typo in length
  const totalLength = metadata?.total_lenght;
  const mangroveArea = dataParsed?.habitat_extent_area;
  const mangroveCoastCoverage = dataParsed?.linear_coverage;
  const mangroveCoastCoveragePercentage = (mangroveCoastCoverage * 100) / totalLength;
  const nonMangrove = numberFormat(totalLength - mangroveCoastCoverage);
  const area = unit === 'ha' ? mangroveArea * 100 : mangroveArea;
  console.log(dataParsed);

  const LegendData = [
    {
      label: `Coastline coverage in ${year}`,
      value: numberFormat(mangroveArea),
      unit: 'km',
      color: '#06C4BD',
    },
    {
      label: 'Non mangroves',
      value: nonMangrove,
      unit: 'km',
      color: '#ECECEF',
    },
  ];
  return useMemo(
    () => ({
      ...query,
      metadata,
      area: numberFormat(area),
      nonMangrove,
      mangroveCoastCoveragePercentage: numberFormat(mangroveCoastCoveragePercentage),
      totalLength: isSuccess && numberFormat(totalLength),
      years: metadata?.year, // API improvement, change year to years as is an array
      units: metadata?.units,
      legend: LegendData,
    }),
    [year, data]
  );
}

export function useSource(): SourceProps {
  return {
    id: 'habitat_extent',
    type: 'vector',
    url: 'mapbox://globalmangrovewatch.20cshxs9,globalmangrovewatch.b1wlg2x7,globalmangrovewatch.2cws6y26,globalmangrovewatch.bgrhiwte,globalmangrovewatch.aokkuxu7,globalmangrovewatch.0l7s8iga,globalmangrovewatch.a08vpx09,globalmangrovewatch.7kyxxf0e,globalmangrovewatch.1cu4rmy9,globalmangrovewatch.6st408jz,globalmangrovewatch.1clkx4nk',
  };
}

export function useLayers(year: number): LayerProps[] {
  return [
    {
      id: `habitat_extent_${year}`,
      type: 'fill',
      source: 'habitat_extent',
      'source-layer': `mng_mjr_${year}`,
      paint: {
        'fill-color': '#06C4BD',
        'fill-opacity': 1,
      },
      layout: {
        visibility: 'visible',
      },
    },
    {
      id: `habitat_extent_${year}_line`,
      type: 'line',
      source: 'habitat_extent',
      'source-layer': `mng_mjr_${year}`,
      paint: {
        'line-color': '#06C4BD',
        'line-width': ['interpolate', ['exponential', 0.7], ['zoom'], 0, 8, 12, 0],
        'line-blur': ['interpolate', ['linear'], ['zoom'], 0, 20, 12, 0],
      },
      layout: {
        visibility: 'visible',
      },
    },
  ];
}
