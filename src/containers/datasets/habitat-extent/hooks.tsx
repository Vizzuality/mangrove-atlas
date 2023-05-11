import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { useRouter } from 'next/router';

import { numberFormat } from 'lib/format';

import { habitatExtentSettings } from 'store/widgets/habitat-extent';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';

import CustomTooltip from 'components/chart/tooltip';
import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import type { ExtentData, Indicator } from './types';

const unitOptions = ['km²', 'ha'];

const widgetSlug = 'habitat-extent';
// widget data
export function useMangroveHabitatExtent(
  params: UseParamsOptions,
  queryOptions: UseQueryOptions<ExtentData, unknown> = {} // API
) {
  const {
    query: { locationType, id },
  } = useRouter();
  const {
    data: { name, id: currentLocation, location_id },
  } = useLocation(locationType, id);

  const location = useMemo(() => {
    if (location_id === 'custom-area') return 'the area selected';
    if (location_id === 'worldwide') return 'the world';
    else return name;
  }, [location_id]);

  const fetchHabitatExtent = () => {
    return API.request({
      method: 'GET',
      url: 'widgets/habitat_extent',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...params,
      },
    }).then((response) => response.data);
    // API2.request({
  };
  //   method: 'POST',
  //   url: 'widgets/habitat_extent',
  //   params,
  // }).then((response: AxiosResponse<DataResponse>) => response.data[slug]);
  // TO DO - add year filter to API

  const query = useQuery([widgetSlug, location_id], fetchHabitatExtent, {
    placeholderData: {
      data: [],
      metadata: {
        units: {
          habitat_extent_area: null,
          linear_coverage: null,
        },
      },
    },
    ...queryOptions,
  });

  const { data } = query;
  const year = useRecoilValue(habitatExtentSettings);

  const { unit } = params;
  const DATA = useMemo(() => {
    const metadata = data.metadata;
    const years = metadata?.year?.sort();
    const currentYear = year || years?.[years?.length - 1];
    const dataByYear = data.data.filter(({ year: y }) => y === currentYear);
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
    const defaultUnitLinearCoverage = metadata?.units?.linear_coverage;
    const area = unit === 'ha' ? mangroveArea * 100 : mangroveArea;
    const mangroveAreaLabel = `Coastline coverage in ${currentYear}`;

    const coastlineCoverage = unit === 'ha' ? mangroveCoastCoverage * 100 : mangroveCoastCoverage;
    const nonMangrovesCoverage = unit === 'ha' ? nonMangrove * 100 : nonMangrove;

    const LegendData = [
      {
        label: mangroveAreaLabel,
        value: numberFormat(mangroveCoastCoverage),
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

    const TooltipData = {
      content: (properties) => <CustomTooltip {...properties} payload={properties?.payload[0]} />,
    };

    const ChartData = [
      {
        label: mangroveAreaLabel,
        value: coastlineCoverage,
        color: '#06C4BD',
        settings: [
          {
            label: 'Percentage:',
            value: numberFormat(mangroveCoastCoveragePercentage),
            unit: '%',
          },
          { label: 'Coverage:', value: numberFormat(coastlineCoverage), unit },
        ],
      },
      {
        label: 'Non mangroves',
        value: nonMangrovesCoverage,
        color: '#ECECEF',
        settings: [
          {
            label: 'Percentage:',
            value: numberFormat(100 - mangroveCoastCoveragePercentage),
            unit: '%',
          },
          { label: 'Coverage:', value: numberFormat(nonMangrovesCoverage), unit },
        ],
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
      location,
      defaultYear: currentYear,
      unitOptions,
      defaultUnitLinearCoverage,
    };
  }, [data, unit, year]);

  return useMemo(() => {
    return {
      ...query,
      data: DATA,
    } as typeof query;
  }, [query, DATA]);
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
