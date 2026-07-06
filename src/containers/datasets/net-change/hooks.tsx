import type { LayerProps, SourceProps } from 'react-map-gl';

import orderBy from 'lodash-es/orderBy';

import { analysisAtom } from '@/store/analysis';
import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';
import { netChangeEndYear, netChangeStartYear } from '@/store/widgets/net-change';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError, AxiosResponse, CanceledError } from 'axios';
import { format } from 'd3-format';
import { useAtomValue } from 'jotai';

import type { AnalysisResponse } from 'hooks/analysis';
import { useSyncLocation } from 'hooks/use-sync-location';

import { useLocation } from '@/containers/datasets/locations/hooks';

import ChartTick from '@/components/chart/chart-tick';
import CustomTooltip from '@/components/chart/tooltip';
import { Visibility } from '@/types/layers';
import { env } from 'env.mjs';

import API, { AnalysisAPI } from 'services/api';

import { Data, DataResponse, UseParamsOptions } from './types';

const numberFormat = format(',.2~f');

export const widgetSlug = 'net-change';

const unitOptions = ['km²', 'ha'];

// Brush y-domain padding multiplier. 1.0 = tallest bar/line reaches the axis line
// exactly (hard limit, no overflow); >1.0 leaves a small inset gap.
const BRUSH_Y_PAD = 1.1;

// Horizontal geometry shared by the main chart and the brush so the two align
// vertically. The main chart's right y-axis reserves Y_AXIS_WIDTH; the brush has
// no visible axis, so it mirrors that width as extra right margin to keep its plot
// box identical. X_INSET is the point-scale padding both charts apply so the first
// and last year sit at the same x in both.
const Y_AXIS_WIDTH = 60;
const X_INSET = 16;

// Shared axis label style (design spec): Open Sans 12/20, weight 400, black 56%.
// Used for recharts' built-in tick text (main chart); the brush uses <ChartTick />.
const AXIS_TICK = {
  fontSize: 12,
  fontFamily: 'Open Sans',
  fontWeight: 400,
  fill: 'rgba(0, 0, 0, 0.56)',
};

export const getFormat = (v) => {
  const decimalCount = -Math.floor(Math.log10(v) + 1) + 1;
  const formatByDecimals = format(`.${decimalCount === Infinity ? 1 : Math.abs(decimalCount)}~f`);
  return formatByDecimals(v);
};

export const getWidgetData = (data: Data[], unit = '') => {
  if (!data?.length) return null;
  const firstYear = Math.min(...data.map((d) => d.year));
  const netChangeValues = data.map((d) => d.net_change);
  netChangeValues.shift();

  const cumulativeValuesNetChange = [0, ...netChangeValues]?.reduce(
    (acc, value, i) => {
      acc.push((acc[i] += value));
      return acc;
    },
    [0]
  );

  return orderBy(
    data.map((l, i) => {
      const netResult =
        unit === 'ha' ? cumulativeValuesNetChange[i] * 100 : cumulativeValuesNetChange[i];
      const gain = l.year === firstYear ? 0 : unit === 'ha' ? l.gain * 100 : l.gain;
      const loss = l.year === firstYear ? 0 : unit === 'ha' ? -l.loss * 100 : -l.loss;

      return {
        label: l.year,
        color: 'rgba(0,0,0,0.7)',
        year: l.year,
        'Net result': netResult,
        Gain: gain,
        Loss: loss,
        settings: [
          {
            color: 'rgba(0,0,0,0.7)',
            label: 'Net result',
            value: numberFormat(netResult),
            variant: 'thin',
            unit,
          },
          { color: '#EB6240', label: 'Loss', value: numberFormat(loss), variant: 'thick', unit },
          { color: '#A6CB10', label: 'Gain', value: numberFormat(gain), variant: 'thick', unit },
        ],
        direction: 'horizontal',
      };
    }),
    (l) => l.year
  );
};

// widget data
export function useMangroveNetChange(
  params: UseParamsOptions,
  queryOptions?: Omit<UseQueryOptions<DataResponse>, 'queryKey' | 'queryFn'>,
  onCancel?: () => void
) {
  const { type: locationType, id } = useSyncLocation();
  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(id, locationType);
  const { customGeojson } = useAtomValue(drawingToolAtom);
  const { uploadedGeojson } = useAtomValue(drawingUploadToolAtom);
  const { enabled: isAnalysisEnabled } = useAtomValue(analysisAtom);
  const geojson = customGeojson || uploadedGeojson;

  const { startYear, endYear, selectedUnit, ...restParams } = params;
  const fetchMangroveNetChange = ({ signal }: { signal?: AbortSignal }) => {
    if (isAnalysisEnabled) {
      return AnalysisAPI.request<AnalysisResponse<DataResponse | AxiosError>>({
        method: 'post',
        url: `/${env.NEXT_PUBLIC_ANALYSIS_API_PATH}`,
        data: {
          geometry: geojson,
        },
        params: {
          'widgets[]': 'mangrove_net_change',
        },
        signal,
      })
        .then(({ data }) => data['mangrove_net_change'])
        .catch((err: CanceledError<unknown> | AxiosError) => {
          if (err.code === 'ERR_CANCELED') onCancel?.();
          return err;
        });
    }

    return API.request({
      method: 'GET',
      url: '/widgets/net_change',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...restParams,
      },
    }).then((response: AxiosResponse<DataResponse>) => response.data);
  };

  const query = useQuery({
    queryKey: [widgetSlug, restParams, geojson, location_id],
    queryFn: fetchMangroveNetChange,
    placeholderData: {
      data: [],
      metadata: null,
    },
    ...queryOptions,
  });

  const { data, isFetched } = query;
  const noData =
    location_id === 'custom-area'
      ? isFetched && data?.data?.reduce((acc, value) => acc + value.net_change, 0) === 0
      : isFetched && !data?.data?.length;

  // Derive years from the actual data series (source of truth) rather than
  // metadata.year, which can lag the response. Keeps the dropdowns, default
  // range, brush, and info panel in sync. Falls back to metadata if present.
  const years = data?.data?.length
    ? [...new Set(data.data.map((d) => d.year))].sort((a, b) => a - b)
    : [...(data?.metadata?.year ?? [])].sort((a, b) => a - b);
  const unit = selectedUnit || data.metadata?.units.net_change;
  const currentStartYear = startYear || years?.[0];
  const currentEndYear = endYear || years?.[years?.length - 1];

  // Mocked gain/loss (flag-gated) applied once to the full series.
  // Main chart shows the selected [startYear, endYear] window; the brush below
  // shows the full series and drives the selection (same as the alerts widget).
  const dataFiltered = data?.data?.filter(
    (d) => d.year >= currentStartYear && d.year <= currentEndYear
  );
  const DATA = getWidgetData(dataFiltered, unit) || [];
  const DATA_FULL = getWidgetData(data?.data, unit) || [];
  const TooltipData = {
    content: (properties) => <CustomTooltip {...properties} />,
  };

  const change = DATA[DATA.length - 1]?.['Net result'];

  // Brush selection indices — positions within the FULL brush series (DATA_FULL),
  // which is what the brush chart actually plots. The metadata `years` list can be
  // shorter/different, which mislocates the selection box (e.g. only covering the
  // first fraction of the track).
  const fullYears = DATA_FULL.map((d) => d.year);
  const startIndex = Math.max(fullYears.indexOf(currentStartYear), 0);
  const endIndexRaw = fullYears.indexOf(currentEndYear);
  const endIndex = endIndexRaw === -1 ? Math.max(fullYears.length - 1, 0) : endIndexRaw;

  // Shared by the main chart and the brush track. Same stackId stacks gain/loss
  // per year at the same x; gain is always positive and loss negative, so
  // recharts splits them across the zero baseline (gain above, loss below).
  const chartBase = {
    bars: {
      Gain: { fill: '#A6CB10', stackId: 'net-change', isAnimationActive: false },
      Loss: { fill: '#EB6240', stackId: 'net-change', isAnimationActive: false },
    },
    lines: {
      'Net result': { stroke: 'rgba(0,0,0,0.7)', isAnimationActive: false },
    },
  };

  // Even, never-clipped year labels for the main chart: derived from the visible
  // window so gaps stay uniform whatever the selected range.
  const xTicks = getEvenlySpacedTicks(
    DATA.map((d) => d.year),
    5
  );

  const chartConfig = {
    type: 'composed',
    data: DATA,
    // Diverging stack: gain (positive) stacks up from zero, loss (negative) down.
    // Without this, the default 'none' offset stacks them cumulatively and the
    // orange loss bar paints over the green gain bar.
    stackOffset: 'sign',
    // Bars sit flush — no gap between categories or between the gain/loss pair.
    barCategoryGap: 0,
    barGap: 0,
    // Left/right room so the first and last year labels are never clipped.
    margin: { top: 40, right: 24, bottom: 20, left: 16 },
    xAxis: {
      type: 'category',
      tick: { ...AXIS_TICK },
      // Explicit, evenly spaced ticks; no tick marks or baseline on the top chart.
      ticks: xTicks,
      interval: 0,
      // Even-by-index spacing (point scale) so labels are equidistant regardless of
      // gaps in the data years.
      scale: 'point',
      tickLine: false,
      axisLine: false,
      // Inset first/last ticks so their labels never overflow the axis edges.
      padding: { left: X_INSET, right: X_INSET },
    },
    yAxis: {
      // Fixed width (recharts' default, pinned) so the brush below can reserve the
      // same right-side space and align its plot box with this chart's.
      width: Y_AXIS_WIDTH,
      tick: { ...AXIS_TICK },
      tickFormatter: (v) => {
        const parsedNumber = unit === 'ha' ? v * 100 : v;
        const result = Number(getFormat(Math.abs(parsedNumber)));
        if (result === 0) return 0;
        // Loss sits below the zero baseline — keep the sign so negative levels read as "-N".
        return v < 0 ? `-${result}` : result;
      },
      tickMargin: 10,
      orientation: 'right',
      label: {
        value: unit === 'km2' ? 'km²' : unit,
        position: 'top',
        offset: 25,
      },
    },
    xKey: 'year',
    cartesianGrid: {
      vertical: false,
      strokeDasharray: '5 15',
    },
    tooltip: TooltipData,
    chartBase,
  };

  // Separate config for the brush below the chart, built to match the alerts
  // widget exactly (same Chart `customBrush` path, margins, pattern and tick)
  // so the two brushes are aligned. The widget supplies onBrushEnd so the drag
  // can also fire analytics.
  const configBrush = {
    type: 'composed',
    height: 100,
    data: DATA_FULL,
    stackOffset: 'sign',
    barCategoryGap: 0,
    barGap: 0,
    cartesianGrid: { vertical: false, horizontal: false },
    // Mirror the main chart's plot box so the brush bars + selection align
    // vertically with the chart above. The brush point scale has no padding, so
    // its endpoints must land on the main chart's first/last bar centres:
    //   left  = main.margin.left(16) + X_INSET  → first bar
    //   right = main.margin.right(24) + Y_AXIS_WIDTH + X_INSET → last bar,
    //           reserving the same right-side space the main y-axis occupies.
    // The Brush selection overlay reads this same margin (chart/index.tsx), so it
    // tracks the bars automatically.
    margin: { top: 20, right: 24 + Y_AXIS_WIDTH + X_INSET, left: 16 + X_INSET, bottom: 5 },
    // Brush hatch for the unselected region is provided by the shared Brush
    // component itself (see components/chart/brush), so no per-widget pattern here.
    xKey: 'year',
    xAxis: {
      // Draw a tick mark for every year, but only label an evenly spaced subset so
      // labels never crowd (the subset always sits on real plotted categories).
      tick: <ChartTick labelValues={getEvenlySpacedTicks(fullYears, 6)} />,
      ticks: fullYears,
      interval: 0,
      type: 'category',
      // Even-by-index spacing so bars + labels align with the index-based brush
      // overlay (otherwise a numeric year axis spaces them by value and misaligns).
      scale: 'point',
      dataKey: 'year',
      axisLine: false,
      tickLine: { stroke: 'rgba(0,0,0,0.3)' },
      tickSize: 6,
    },
    // Hidden y-domain, lightly padded so the bars/line sit close to the axis line
    // (the y limit) without ever drawing past it. BRUSH_Y_PAD = 1.0 makes the
    // tallest bar/line touch the axis exactly (hard limit, zero overflow); >1.0
    // leaves a thin gap. Keep it >= 1.0 so content never overflows the axis.
    yAxis: {
      hide: true,
      domain: [(min: number) => min * BRUSH_Y_PAD, (max: number) => max * BRUSH_Y_PAD],
    },
    chartBase,
    tooltip: false,
    // Only startIndex/endIndex are read here — the Brush overlay derives its
    // extent from the chart `margin` above (see chart/index.tsx), so the selection
    // box and draggers line up with the bars automatically.
    customBrush: {
      margin: { top: 60, right: 24 + Y_AXIS_WIDTH + X_INSET, left: 16 + X_INSET, bottom: 80 },
      startIndex,
      endIndex,
    },
  };

  const direction = change > 0 ? 'increased' : 'decreased';
  return {
    config: chartConfig,
    configBrush,
    location,
    years,
    // Full series the brush plots (can differ from metadata `years`); the widget
    // maps brush drag indices back to years through this so the window updates.
    brushYears: fullYears,
    currentStartYear,
    currentEndYear,
    netChange: numberFormat(Math.abs(change)),
    direction,
    unitOptions,
    noData,
    ...query,
  };
}

// Evenly spaced x-axis year ticks. On a point scale the pixel position is
// proportional to the value's index, so truly even spacing needs a *constant*
// index step. We pick the largest step that divides (n-1) into at most
// `maxTicks - 1` equal intervals, which keeps the first and last year and makes
// every gap identical. Only when (n-1) has no such divisor (e.g. it's prime) do
// we fall back to rounded positions (best-effort even). Returns the full list
// when it already fits.
export function getEvenlySpacedTicks(values: number[], maxTicks = 5): number[] {
  const n = values?.length ?? 0;
  if (n <= maxTicks) return values ?? [];

  const maxIntervals = maxTicks - 1;
  // Largest number of equal intervals (>= 2, so at least 3 labels) that divides
  // the axis evenly — gives a constant index step and includes both endpoints.
  let step = 0;
  for (let m = maxIntervals; m >= 2; m--) {
    if ((n - 1) % m === 0) {
      step = (n - 1) / m;
      break;
    }
  }

  if (step > 0) {
    const ticks: number[] = [];
    for (let i = 0; i <= n - 1; i += step) ticks.push(values[i]);
    return ticks;
  }

  // Fallback: (n-1) is prime — no uniform step fits, so approximate with rounding.
  const ticks: number[] = [];
  for (let i = 0; i < maxTicks; i++) {
    ticks.push(values[Math.round((i * (n - 1)) / (maxTicks - 1))]);
  }
  return Array.from(new Set(ticks));
}

// Pure source-builder: one combined gain/loss v4 raster per year in the
// (startYear, endYear] window. Exclusive lower bound — the start year is the
// baseline, so change is only shown from the year after it onward.
export function getNetChangeSources(
  years: number[],
  startYear: number,
  endYear: number
): SourceProps[] {
  const filteredYears = years?.filter((year) => year <= endYear && year > startYear);

  return filteredYears?.map((year) => ({
    id: `net-change-${year}`,
    type: 'raster',
    tiles: [
      `https://storage.googleapis.com/mangrove_atlas/staging/tilesets/gain-loss-v4/${year}/{z}/{x}/{y}.png`,
    ],
    minZoom: 0,
    maxZoom: 12,
  }));
}

export function useSources(): SourceProps[] {
  const startYear = useAtomValue(netChangeStartYear);
  const endYear = useAtomValue(netChangeEndYear);
  const { years, currentEndYear, currentStartYear } = useMangroveNetChange({
    startYear,
    endYear,
  });

  return getNetChangeSources(years, currentStartYear, currentEndYear);
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
    source: 'net-change-source',
    paint: {
      'raster-opacity': opacity,
    },
    layout: {
      visibility,
    },
  };
}
