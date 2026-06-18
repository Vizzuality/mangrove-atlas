import type { LayerProps, SourceProps } from 'react-map-gl';

import orderBy from 'lodash-es/orderBy';

import { analysisAtom } from '@/store/analysis';
import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';
import { netChangeEndYear, netChangeStartYear } from '@/store/widgets/net-change';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError, AxiosResponse, CanceledError } from 'axios';
import { format } from 'd3-format';
import { useAtomValue, useSetAtom } from 'jotai';

import type { AnalysisResponse } from 'hooks/analysis';
import { useSyncLocation } from 'hooks/use-sync-location';

import { useLocation } from '@/containers/datasets/locations/hooks';

import CustomTooltip from '@/components/chart/tooltip';
import { Visibility } from '@/types/layers';

import API, { AnalysisAPI } from 'services/api';

import { Data, DataResponse, UseParamsOptions } from './types';

const numberFormat = format(',.2~f');

export const widgetSlug = 'net-change';

const unitOptions = ['km²', 'ha'];

// The API currently returns `gain`/`loss` as null. When the `mockNetChange`
// feature flag is on, derive display-only gain/loss values from `net_change`.
// Deterministic (no Math.random) so SSR and tests stay stable.
export const mockNetChangeEnabled =
  JSON.parse(process.env.NEXT_PUBLIC_FEATURED_FLAGS || '{}').mockNetChange === true;

export const mockGainLoss = (net_change: number) => {
  // baseline churn proportional to the magnitude, so bars are visible even when
  // net change is small; gain - loss === net_change exactly.
  const base = Math.abs(net_change) * 0.5 + 50;
  return {
    gain: base + Math.max(net_change, 0),
    loss: base + Math.max(-net_change, 0),
  };
};

export const applyMockGainLoss = (rows: Data[] = []): Data[] =>
  mockNetChangeEnabled
    ? rows.map((row) => (row.gain == null ? { ...row, ...mockGainLoss(row.net_change) } : row))
    : rows;

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
      return {
        label: l.year,
        color: 'rgba(0,0,0,0.7)',
        year: l.year,
        'Net result':
          unit === 'ha' ? cumulativeValuesNetChange[i] * 100 : cumulativeValuesNetChange[i],
        Gain: l.year === firstYear ? 0 : unit === 'ha' ? l.gain * 100 : l.gain,
        Loss: l.year === firstYear ? 0 : unit === 'ha' ? -l.loss * 100 : -l.loss,
        settings: [
          {
            color: 'rgba(0,0,0,0.7)',

            label: 'Net result',
            value: numberFormat(
              unit === 'ha' ? cumulativeValuesNetChange[i] * 100 : cumulativeValuesNetChange[i]
            ),
            variant: 'thin',
            unit,
          },
        ],
        direction: 'vertical',
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
        url: '/analysis',
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

  const setStartYear = useSetAtom(netChangeStartYear);
  const setEndYear = useSetAtom(netChangeEndYear);

  const years = data?.metadata?.year.sort();
  const unit = selectedUnit || data.metadata?.units.net_change;
  const currentStartYear = startYear || years?.[0];
  const currentEndYear = endYear || years?.[years?.length - 1];

  // Mocked gain/loss (flag-gated) applied once to the full series.
  const allData = applyMockGainLoss(data?.data);

  // The chart shows the full series; the sentence/net-result number is computed
  // from the selected [startYear, endYear] window.
  const dataFiltered = allData?.filter(
    (d) => d.year >= currentStartYear && d.year <= currentEndYear
  );
  const DATA = getWidgetData(allData, unit) || [];
  const DATA_SELECTED = getWidgetData(dataFiltered, unit) || [];
  const TooltipData = {
    content: (properties) => <CustomTooltip {...properties} />,
  };

  const change = DATA_SELECTED[DATA_SELECTED.length - 1]?.['Net result'];

  // Brush selection mirrors the year dropdowns — both write the same atoms.
  const startIndex = Math.max(years?.indexOf(currentStartYear) ?? 0, 0);
  const endIndex = years?.indexOf(currentEndYear) ?? Math.max((years?.length ?? 1) - 1, 0);
  const onBrushEnd = ({ startIndex: s, endIndex: e }: { startIndex: number; endIndex: number }) => {
    if (years?.[s] != null) setStartYear(years[s]);
    if (years?.[e] != null) setEndYear(years[e]);
  };

  const chartConfig = {
    type: 'composed',
    data: DATA,
    margin: { top: 40, right: 20, bottom: 20, left: 0 },
    referenceLines: [{ y: 0, label: null, stroke: 'rgba(0,0,0,0.5)' }],
    xAxis: {
      type: 'category',
      tick: { fontSize: 12, fill: 'rgba(0, 0, 0, 0.54)' },
      interval: 'equidistantPreserveStart',
    },
    yAxis: {
      tick: { fontSize: 12, fill: 'rgba(0, 0, 0, 0.54)' },
      tickFormatter: (v) => {
        const parsedNumber = unit === 'ha' ? v * 100 : v;
        const result = Number(getFormat(Math.abs(parsedNumber)));
        return result === 0 ? 0 : result;
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
    chartBase: {
      bars: {
        Gain: { fill: '#A6CB10', stackId: 'change', isAnimationActive: false },
        Loss: { fill: '#EB6240', stackId: 'change', isAnimationActive: false },
      },
      lines: {
        'Net result': {
          stroke: 'rgba(0,0,0,0.7)',
          isAnimationActive: false,
        },
      },
    },
    brush: {
      startIndex,
      endIndex,
      onBrushEnd,
    },
  };
  const direction = change > 0 ? 'increased' : 'decreased';
  return {
    config: chartConfig,
    location,
    years,
    currentStartYear,
    currentEndYear,
    netChange: numberFormat(Math.abs(change)),
    direction,
    unitOptions,
    noData,
    ...query,
  };
}

export function useSources(fluctuation): SourceProps[] {
  const startYear = useAtomValue(netChangeStartYear);
  const endYear = useAtomValue(netChangeEndYear);
  const { years, currentEndYear, currentStartYear } = useMangroveNetChange({
    startYear,
    endYear,
  });
  const filteredYears = years?.filter((year) => year <= currentEndYear && year > currentStartYear);

  return filteredYears?.map((year) => ({
    id: `net-change-${year}-${fluctuation}`,
    type: 'raster',
    tiles: [
      `https://mangrove_atlas.storage.googleapis.com/staging/tilesets/${fluctuation}/${year}/{z}/{x}/{y}.png`,
    ],
    minZoom: 0,
    maxZoom: 12,
  }));
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
