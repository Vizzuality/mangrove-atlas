import type { LayerProps, SourceProps } from 'react-map-gl';

import sortBy from 'lodash-es/sortBy';

import { useRouter } from 'next/router';

import { formatAxis } from '@/lib/format';

import { analysisAtom } from '@/store/analysis';
import { alertsEndDate, alertsStartDate } from '@/store/widgets/alerts';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError, AxiosResponse, CanceledError } from 'axios';
import type { Visibility } from 'mapbox-gl';
import { CartesianViewBox } from 'recharts/types/util/types';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { useLocation } from '@/containers/datasets/locations/hooks';
import type { LocationTypes } from '@/containers/datasets/locations/types';

import API_cloud_functions from 'services/cloud-functions';

import { MONTHS, MONTHS_CONVERSION } from './constants';
import Tooltip from './tooltip';
import type { AlertData, CustomAreaGeometry, UseParamsOptions } from './types';

const bucketKey = (m: number) => {
  if (m < 3) return 'lt3';
  if (m < 6) return '3to6';
  if (m < 12) return '6to12';
  if (m < 24) return '12to24';
  return 'gt24';
};

const makeColoredSeries = (data: any[]) => {
  const keys = [
    'alerts_lt3',
    'alerts_3to6',
    'alerts_6to12',
    'alerts_12to24',
    'alerts_gt24',
  ] as const;

  // init keys as null
  const base = data.map((d) => ({
    ...d,
    alerts_lt3: null,
    alerts_3to6: null,
    alerts_6to12: null,
    alerts_12to24: null,
    alerts_gt24: null,
  }));

  // assign each point to its bucket
  for (let i = 0; i < base.length; i++) {
    const d = base[i];
    const b = bucketKey(d.monthsSinceDetection);

    const k =
      b === 'lt3'
        ? 'alerts_lt3'
        : b === '3to6'
          ? 'alerts_3to6'
          : b === '6to12'
            ? 'alerts_6to12'
            : b === '12to24'
              ? 'alerts_12to24'
              : 'alerts_gt24';

    d[k] = d.alerts;
  }

  // stitch boundaries: when bucket changes, copy the boundary point to both series
  for (let i = 1; i < base.length; i++) {
    const prev = base[i - 1];
    const curr = base[i];

    const prevB = bucketKey(prev.monthsSinceDetection);
    const currB = bucketKey(curr.monthsSinceDetection);

    if (prevB !== currB) {
      const prevKey =
        prevB === 'lt3'
          ? 'alerts_lt3'
          : prevB === '3to6'
            ? 'alerts_3to6'
            : prevB === '6to12'
              ? 'alerts_6to12'
              : prevB === '12to24'
                ? 'alerts_12to24'
                : 'alerts_gt24';

      const currKey =
        currB === 'lt3'
          ? 'alerts_lt3'
          : currB === '3to6'
            ? 'alerts_3to6'
            : currB === '6to12'
              ? 'alerts_6to12'
              : currB === '12to24'
                ? 'alerts_12to24'
                : 'alerts_gt24';

      // duplicate the boundary point so lines meet
      prev[currKey] = prev.alerts;
      curr[prevKey] = curr.alerts;
    }
  }

  return base;
};

const monthIndex = (year: number, month1to12: number) => year * 12 + (month1to12 - 1);

const monthsSince = (year: number, month1to12: number, ref: Date) => {
  const refIdx = monthIndex(ref.getFullYear(), ref.getMonth() + 1);
  const dIdx = monthIndex(year, month1to12);
  return Math.max(0, refIdx - dIdx);
};

const addMonthsSince = (data) => {
  const ref = new Date();
  return data.map((d) => ({
    ...d,
    monthsSinceDetection: monthsSince(d.year, d.month.value, ref),
  }));
};

const getData = (data) =>
  sortBy(
    data?.map((d) => {
      const year = Number(d.date.value.split('-', 1)[0]);
      const month = MONTHS?.find((m) => m.value === new Date(d.date.value).getMonth() + 1);
      const day = month ? new Date(year, month.value, 0).getDate() : 0;

      const lastDay = month ? new Date(year, month.value, 0).getDate() : 0;

      return {
        ...d,
        month,
        year,
        date: `${year}-${(month?.value ?? 0) < 10 ? '0' : ''}${month?.value ?? 0}-${day}`,
        end: month ? `${year}-${month.value < 10 ? '0' : ''}${month.value}-${day}` : '',
        start: d.date.value,
        title: month?.label ?? '',
        name: month
          ? `${MONTHS_CONVERSION[month.label]} '${new Date(year + 1, 0, 0).toLocaleDateString(
              'en',
              {
                year: '2-digit',
              }
            )}`
          : '',
        alerts: d.count,
        label: `${month?.label ?? ''}, ${year}`,
        startDate: {
          label: `${month?.label ?? ''}, ${year}`,
          value: `${year}-${(month?.value ?? 0) < 10 ? '0' : ''}${month?.value ?? 0}-01`,
        },
        endDate: {
          label: `${month?.label ?? ''}, ${year}`,
          value: `${year}-${(month?.value ?? 0) < 10 ? '0' : ''}${month?.value ?? 0}-${lastDay}`,
        },
      };
    }),
    ['month']
  );

const TickSmall = ({ x, y, payload }) => {
  const { value } = payload;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={5} textAnchor="end" fill="#3A3F59" opacity={0.7} fontSize="10px">
        {value}
      </text>
    </g>
  );
};

const DefaultTick = ({ x, y, payload }) => {
  const { value } = payload;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={5} fill="#3A3F59" opacity={0.5} fontSize="12px">
        {value}
      </text>
    </g>
  );
};

const getTotal = (data: { count: number }[]) =>
  data?.reduce((previous: number, current: { count: number }) => current.count + previous, 0);

type DateOption = { label: string; value: string };

type AlertsApiItem = any; // { date: { value: string }; count: number; ... }
type AlertsApiResponse = AlertsApiItem[];

export function useAlerts<TRaw = AlertsApiResponse>(
  startDate?: DateOption,
  endDate?: DateOption,
  params?: UseParamsOptions,
  dataParams?: CustomAreaGeometry,
  queryOptions?: Omit<
    UseQueryOptions<TRaw, Error, AlertData | undefined, (string | unknown)[]>,
    'queryKey' | 'queryFn' | 'select'
  >,
  onCancel?: () => void
) {
  const setStartDate = useSetRecoilState(alertsStartDate);
  const setEndDate = useSetRecoilState(alertsEndDate);

  const {
    query: { params: queryParams },
  } = useRouter();

  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];

  const { data } = useLocation(id, locationType);
  const location_id = data?.location_id;

  const { enabled: isAnalysisRunning } = useRecoilValue(analysisAtom);

  const fetchAlerts = async (): Promise<TRaw> => {
    try {
      if (isAnalysisRunning) {
        const response = await API_cloud_functions.request<TRaw>({
          method: 'POST',
          url: '/fetch-alerts',
          data: { ...dataParams },
        });
        return response.data;
      }

      const response = await API_cloud_functions.request<TRaw>({
        method: 'GET',
        url: '/fetch-alerts',
        params: {
          location_id,
          ...params,
        },
      });
      return response.data;
    } catch (err) {
      const e = err as CanceledError<unknown> | AxiosError;
      if ((e as any)?.code === 'ERR_CANCELED') onCancel?.();
      throw new Error('Error fetching alerts');
    }
  };

  return useQuery<TRaw, Error, AlertData | undefined>({
    queryKey: ['alerts', params, location_id],
    queryFn: fetchAlerts,
    enabled: (queryOptions?.enabled ?? true) && !!location_id, // avoid calling without location_id
    select: (raw): AlertData | undefined => {
      // IMPORTANT: raw is TRaw (your API response), not AlertData
      if (!raw) return undefined;

      // if your raw is an array, keep this:
      const rawArray = raw as unknown as AlertsApiResponse;
      if (!Array.isArray(rawArray) || rawArray.length === 0) return undefined;

      const fullData = getData(rawArray); // make sure getData expects the API array
      if (!fullData.length) return undefined;

      const startDateOptions = fullData.map((d) => d.startDate);
      const endDateOptions = fullData.map((d) => d.endDate);

      const defaultStartDate = startDateOptions[0];
      const defaultEndDate = endDateOptions[endDateOptions.length - 1];

      const selectedStartDate = startDate ?? defaultStartDate;
      const selectedEndDate = endDate ?? defaultEndDate;

      if (selectedEndDate) setEndDate(selectedEndDate);
      if (selectedStartDate) setStartDate(selectedStartDate);

      const dataFiltered = rawArray.filter(
        (d) => selectedStartDate?.value <= d.date.value && d.date.value <= selectedEndDate?.value
      );

      const fixedXAxis = fullData.map((d) => d.year);

      const chartDataRaw = getData(dataFiltered);
      const chartDataWithMonths = addMonthsSince(chartDataRaw);
      const chartData = makeColoredSeries(chartDataWithMonths);
      const startIndex = fullData.findIndex((d) => d.startDate?.value === selectedStartDate?.value);
      const endIndex = fullData.findIndex((d) => d.endDate?.value === selectedEndDate?.value);

      const alertsTotal = getTotal(dataFiltered);
      const config = {
        data: chartData,
        type: 'line',
        dataKey: 'alerts',
        height: 350,
        cartesianGrid: { vertical: false, horizontal: false },
        margin: { top: 50, right: 10, left: 10, bottom: 35 },
        label: 'alerts',
        xKey: 'name',
        chartBase: {
          lines: {
            alerts_gt24: {
              stroke: '#FFC201',
              strokeWidth: 2.5,
              isAnimationActive: false,
              dot: false,
            },
            alerts_12to24: {
              stroke: '#F78E1C',
              strokeWidth: 2.5,
              isAnimationActive: false,
              dot: false,
            },
            alerts_6to12: {
              stroke: '#ED4F3F',
              strokeWidth: 2.5,
              isAnimationActive: false,
              dot: false,
            },
            alerts_3to6: {
              stroke: '#DC3982',
              strokeWidth: 2.5,
              isAnimationActive: false,
              dot: false,
            },
            alerts_lt3: {
              stroke: '#C62AD6',
              strokeWidth: 2.5,
              isAnimationActive: false,
              dot: false,
            },
          },
        },
        xAxis: { tick: TickSmall, type: 'category' },
        yAxis: {
          tick: { fontSize: 10, fill: 'rgba(0,0,0,0.54)' },
          width: 40,
          interval: 0,
          orientation: 'right',
          value: 'alerts',
          label: ({ viewBox }: { viewBox: CartesianViewBox }) => {
            const { x, y } = viewBox;
            if (x == null || y == null) return null; // <-- don’t use !x / !y
            return (
              <g>
                <text x={x + 20} y={y - 40} textAnchor="middle" dominantBaseline="central">
                  <tspan fill="rgba(0,0,0,0.24)" stroke="rgba(0,0,0,0.24)" fontSize="12">
                    Alerts
                  </tspan>
                </text>
              </g>
            );
          },
          type: 'number',
        },
        tooltip: {
          content: (properties: any) => (
            <Tooltip {...properties} payload={properties.payload?.[0]?.payload} />
          ),
        },
      };

      const configBrush = {
        type: 'line',
        dataKey: 'alerts',
        height: 100,
        cartesianGrid: { vertical: false, horizontal: false },
        referenceAreas: [
          { x1: 0, x2: 11, y1: -100, y2: 480, fill: 'url(#diagonal-stripe-1) #000' },
          {
            x1: selectedStartDate?.value,
            x2: selectedEndDate?.value,
            y1: -100,
            y2: 480,
            fill: '#fff',
            fillOpacity: 1,
          },
        ],
        margin: { top: 20, right: 40, left: 10, bottom: 5 },
        patterns: {
          diagonal: {
            attributes: {
              id: 'diagonal-stripe-1',
              patternUnits: 'userSpaceOnUse',
              patternTransform: 'rotate(-45)',
              width: 4,
              height: 6,
            },
            children: {
              rect2: { tag: 'rect', x: 0, y: 0, width: 4, height: 6, fill: '#d2d2d2' },
              rect: { tag: 'rect', x: 0, y: 0, width: 3, height: 6, fill: '#fff' },
            },
          },
        },
        xKey: 'year',
        data: makeColoredSeries(addMonthsSince(fullData)),
        chartBase: {
          lines: {
            alerts_gt24: { stroke: '#FFC201', strokeWidth: 2.5, isAnimationActive: false },
            alerts_12to24: { stroke: '#F78E1C', strokeWidth: 2.5, isAnimationActive: false },
            alerts_6to12: { stroke: '#ED4F3F', strokeWidth: 2.5, isAnimationActive: false },
            alerts_3to6: { stroke: '#DC3982', strokeWidth: 2.5, isAnimationActive: false },
            alerts_lt3: { stroke: '#C62AD6', strokeWidth: 2.5, isAnimationActive: false },
          },
        },
        xAxis: {
          tick: DefaultTick,
          ticks: Array.from(new Set(fixedXAxis)),
          interval: 0,
          type: 'category',
        },
        tooltip: false,
        customBrush: { margin: { top: 60, right: 20, left: 15, bottom: 80 }, startIndex, endIndex },
      };

      return {
        alertsTotal: formatAxis(alertsTotal),
        startDateOptions,
        endDateOptions,
        selectedStartDate,
        selectedEndDate,
        defaultStartDate,
        defaultEndDate,
        fullData,
        config,
        configBrush,
      };
    },
    ...queryOptions,
  });
}

// dataset layer
export function useSources(): SourceProps[] {
  const startDate = useRecoilValue(alertsStartDate);
  const endDate = useRecoilValue(alertsEndDate);

  return [
    {
      id: 'alerts-heatmap-vector',
      type: 'vector',
      url: 'mapbox://globalmangrovewatch.bkhacq4t',
    },
  ];
}

export function useLayers({
  id,
  opacity,
  visibility = 'visible',
}: {
  id: LayerProps['id'];
  opacity?: number;
  visibility?: Visibility;
}): {
  'alerts-heatmap-vector': LayerProps[];
} {
  return {
    'alerts-heatmap-vector': [
      {
        id: `${id}-heatmap`,
        type: 'heatmap',
        source: 'alerts-heatmap-vector',
        'source-layer': 'alerts_data',
        maxzoom: 18,
        paint: {
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['coalesce', ['to-number', ['get', 'months_diff']], 76],

            1,
            1.0, // newest
            3,
            0.9,
            6,
            0.75,
            12,
            0.55,
            24,
            0.35,
            36,
            0.2,
            60,
            0.08,
            76,
            0.02, // oldest
          ],

          'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],

          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(0,0,0,0)',
            0.2,
            '#FFC201',
            0.45,
            '#F78E1C',
            0.65,
            '#ED4F3F',
            0.85,
            '#DC3982',
            1,
            '#C62AD6',
          ],

          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 8, 9, 25],
          'heatmap-opacity': opacity ?? 1,
        },

        layout: { visibility },
      },
    ],
  };
}
