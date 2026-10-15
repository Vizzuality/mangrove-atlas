import { formatOrNull, numberFormat } from '@/lib/format';

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
  // Copy before sorting (`sort` would mutate the cached response), sort numerically
  // (the default comparator is lexicographic) and drop repeats — a duplicate year
  // reaches the selector, the timeline and the map sources as a duplicate key.
  const years = metadata?.year ? [...new Set(metadata.year)].sort((a, b) => a - b) : undefined;
  // A year selected for another location (the settings atom is not reset on navigation)
  // may not exist in this response; fall back to the latest year instead of rendering
  // values for a year with no rows (→ undefined → "NaN").
  const latestYear = years?.[years.length - 1];
  const currentYear = year && (!years || years.includes(year)) ? year : latestYear;
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
  // The analysis API (custom areas) returns no coastline fields; keep this null rather
  // than `undefined - undefined` = NaN.
  const nonMangrove =
    Number.isFinite(totalLength) && Number.isFinite(mangroveCoastCoverage)
      ? totalLength - mangroveCoastCoverage
      : null;
  const defaultUnitLinearCoverage = metadata?.units?.linear_coverage;
  const area = Number.isFinite(mangroveArea)
    ? unit === 'ha'
      ? mangroveArea * 100
      : mangroveArea
    : null;
  const mangroveAreaLabel = `Coastline coverage in ${currentYear}`;

  const coastlineCoverage = Number.isFinite(mangroveCoastCoverage)
    ? unit === 'ha'
      ? mangroveCoastCoverage * 100
      : mangroveCoastCoverage
    : null;
  const nonMangrovesCoverage =
    nonMangrove !== null ? (unit === 'ha' ? nonMangrove * 100 : nonMangrove) : null;

  const LegendData = [
    {
      label: mangroveAreaLabel,
      value: formatOrNull(mangroveCoastCoverage),
      unit: 'km',
      color: '#06C4BD',
    },
    {
      label: 'Non mangroves',
      value: formatOrNull(nonMangrove),
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
        { label: 'Coverage', value: formatOrNull(coastlineCoverage), unit },
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
        { label: 'Coverage:', value: formatOrNull(nonMangrovesCoverage), unit },
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
    // null (not "NaN") when the response has no value — the widget renders a fallback.
    area: formatOrNull(area),
    nonMangrove: formatOrNull(nonMangrove),
    mangroveCoastCoveragePercentage: formatOrNull(mangroveCoastCoveragePercentage),
    totalLength: formatOrNull(totalLength),
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
