import { numberFormat } from '@/lib/format';

import CustomTooltip from '@/components/chart/tooltip';

import type { ExtentData, Indicator } from './types';

export const unitOptions = ['km²', 'ha'];

type GetHabitatExtentDataArgs = {
  data?: ExtentData;
  unit?: string;
  year?: number;
  location?: string;
  noData?: boolean;
  widgetSlug: string;
};

/**
 * Pure transform of the habitat-extent API response into legend + pie-chart
 * data. Extracted from `useMangroveHabitatExtent` so the (branch-heavy) shaping
 * logic can be unit-tested without React Query / the hook graph.
 */
export function getHabitatExtentData({
  data,
  unit,
  year,
  location,
  noData,
  widgetSlug,
}: GetHabitatExtentDataArgs) {
  const metadata = data?.metadata;
  const years = metadata?.year?.sort();
  const currentYear = year || years?.[years?.length - 1];
  const dataByYear = data?.data?.filter(({ year: y }) => y === currentYear);
  const dataParsed = dataByYear?.reduce(
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
  const mangroveCoastCoveragePercentage = (mangroveCoastCoverage * 100) / totalLength || 0;
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
    content: (properties) => <CustomTooltip {...properties} />,
  };

  const ChartData = [
    {
      label: mangroveAreaLabel,
      value: coastlineCoverage,
      color: '#06C4BD',
      settings: [
        {
          label: 'Percentage',
          value: numberFormat(mangroveCoastCoveragePercentage),
          unit: '%',
        },
        { label: 'Coverage', value: numberFormat(coastlineCoverage), unit },
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
    area: numberFormat(+area),
    nonMangrove: numberFormat(+nonMangrove),
    mangroveCoastCoveragePercentage: numberFormat(+mangroveCoastCoveragePercentage),
    totalLength: numberFormat(+totalLength),
    years: metadata?.year, // API improvement, change year to years as is an array
    units: metadata?.units,
    legend: LegendData,
    chartData: ChartData,
    config: chartConfig,
    location,
    defaultYear: currentYear,
    unitOptions,
    defaultUnitLinearCoverage,
    noData,
  };
}
