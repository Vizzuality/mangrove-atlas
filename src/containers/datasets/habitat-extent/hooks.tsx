import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { numberFormat } from 'lib/format';

import { useWidgetSettings } from 'store/widget';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

type Metadata = {
  location_id: string;
  note: null;
  total_area: number;
  total_lenght: number;
  units: Unit[];
  year: number[];
};

type DataResponse = {
  data: Data[];
  metadata: Metadata;
};
type Unit = {
  habitat_extent_area: string;
  linear_coverage: string;
};
type Indicator = {
  year: number;
  linear_coverage: number;
  habitat_extent_area: number;
};

type Legend = {
  label: string;
  value: string | number;
  unit: string;
  color: string;
};
type Data = { year: number; value: number; indicator: 'habitat_extent_area' | 'linear_coverage' };

type ChartData = {
  label: string;
  value: number | string;
  color?: string;
  unit?: string;
};

type TooltipData = {
  title?: string;
  items: ChartData[];
};

type chartBaseTypes = {
  pies: {
    value: string;
  };
};

type ChartConfig = {
  type: string;
  data: ChartData[];
  tooltip: TooltipData;
  cartesianGrid: boolean;
  chartBase: chartBaseTypes;
};

type ExtentData = {
  metadata: Metadata;
  area: string;
  nonMangrove: string;
  mangroveCoastCoveragePercentage: string;
  totalLength: string;
  years: number[]; // API improvement, change year to years as is an array
  units: Unit[];
  legend: Legend[];
  chartData: ChartData[];
  config: ChartConfig;
};
const widgetSlug = 'habitat-extent';
// widget data
export function useMangroveHabitatExtent(
  params: UseParamsOptions,
  queryOptions: UseQueryOptions<DataResponse> // API
): ExtentData {
  const fetchHabitatExtent = (...args) => {
    const { location_id } = params;
    return API.request({
      method: params.location_id === 'custom-area' ? 'POST' : 'GET',
      url: 'widgets/habitat_extent',
      params: { location_id },
    }).then((response: AxiosResponse<DataResponse>) => response.data);
    // API2.request({
  };
  //   method: 'POST',
  //   url: 'widgets/habitat_extent',
  //   params,
  // }).then((response: AxiosResponse<DataResponse>) => response.data[slug]);
  // TO DO - add year filter to API
  const { location_id, unit, year } = params;

  const query = useQuery([widgetSlug, location_id], fetchHabitatExtent, {
    placeholderData: {
      data: [],
      metadata: null,
    },
    ...queryOptions,
  });

  const { data, isLoading } = query;
  return useMemo(() => {
    const metadata = data.metadata;
    const dataByYear = data.data.filter(({ year: y }) => y === year);
    const dataParsed = dataByYear.reduce(
      (acc, d) => ({
        ...acc,
        year: d.year,
        [d.indicator]: d.value,
      }),
      {} as Indicator
    );
    // API improvement - fix typo in length
    const totalLength = metadata?.total_lenght;
    const mangroveArea = dataParsed?.habitat_extent_area;
    const mangroveCoastCoverage = dataParsed?.linear_coverage;
    const mangroveCoastCoveragePercentage = (mangroveCoastCoverage * 100) / totalLength;
    const nonMangrove = totalLength - mangroveCoastCoverage;
    const area = unit === 'ha' ? mangroveArea * 100 : mangroveArea;
    const years = metadata?.year.sort();
    // const year = useWidgetSettings(widgetSlug);

    const LegendData = [
      {
        label: `Coastline coverage in ${year}`,
        value: numberFormat(mangroveArea),
        unit: 'km',
        color: '#06C4BD',
      },
      {
        label: 'Non mangroves',
        value: numberFormat(nonMangrove),
        unit: 'km',
        color: '#ECECEF',
      },
    ];

    const mangroveAreaLabel = `Coastline coverage in ${year}`;

    const TooltipData = {
      title: '',
      items: [
        {
          label: mangroveAreaLabel,
          value: numberFormat(mangroveArea),
          unit,
        },
        {
          label: 'Non mangroves',
          value: numberFormat(nonMangrove),
          unit,
        },
      ],
    };

    const ChartData = [
      {
        label: mangroveAreaLabel,
        value: mangroveArea,
        color: '#06C4BD',
      },
      {
        label: 'Non mangroves',
        value: nonMangrove,
        color: '#ECECEF',
      },
    ];
    const chartConfig = {
      type: 'pie',
      data: ChartData,
      tooltip: TooltipData,
      cartesianGrid: false,
      chartBase: {
        pies: {
          value: widgetSlug,
        },
      },
    };

    return {
      metadata,
      area: numberFormat(area),
      nonMangrove: numberFormat(nonMangrove),
      mangroveCoastCoveragePercentage: numberFormat(mangroveCoastCoveragePercentage),
      totalLength: numberFormat(totalLength),
      years: metadata?.year, // API improvement, change year to years as is an array
      units: metadata?.units,
      legend: LegendData,
      chartData: ChartData,
      config: chartConfig,
      years,
      startYear: years?.[0],
      endYear: years?.[years.length - 1],
      isLoading,
    } satisfies ExtentData;
  }, [year, data, unit, location_id]);
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
