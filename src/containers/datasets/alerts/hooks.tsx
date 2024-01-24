import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import sortBy from 'lodash-es/sortBy';

import { useRouter } from 'next/router';

import { formatAxis } from 'lib/format';

import { analysisAtom } from 'store/analysis';
import { alertsEndDate, alertsStartDate } from 'store/widgets/alerts';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { Visibility } from 'mapbox-gl';
import { CartesianViewBox } from 'recharts/types/util/types';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';

import API_cloud_functions from 'services/cloud-functions';

import Tooltip from './tooltip';
import type { UseParamsOptions, DataParams, DataResponse } from './types';

// widget data
const months = [
  { label: 'January', value: 1, shortLabel: 'Jan' },
  { label: 'February', value: 2, shortLabel: 'Feb' },
  { label: 'March', value: 3, shortLabel: 'Mar' },
  { label: 'April', value: 4, shortLabel: 'Apr' },
  { label: 'May', value: 5, shortLabel: 'May' },
  { label: 'June', value: 6, shortLabel: 'Jun' },
  { label: 'July', value: 7, shortLabel: 'Jul' },
  { label: 'August', value: 8, shortLabel: 'Aug' },
  { label: 'September', value: 9, shortLabel: 'Sep' },
  { label: 'October', value: 10, shortLabel: 'Oct' },
  { label: 'November', value: 11, shortLabel: 'Nov' },
  { label: 'December', value: 12, shortLabel: 'Dec' },
];

const monthsConversion = {
  January: 'Jan',
  February: 'Feb',
  March: 'March',
  April: 'April',
  May: 'May',
  June: 'June',
  July: 'July',
  August: 'Aug',
  September: 'Sept',
  October: 'Oct',
  November: 'Nov',
  December: 'Dec',
};

const getStops = () => {
  const colorSchema = ['rgba(199, 43, 214, 1)', 'rgba(235, 68, 68, 0.7)', 'rgba(255, 194, 0, 0.5)'];

  const gradient = colorSchema.map((d, index) => ({
    offset: `${(index / (colorSchema.length - 1)) * 100}%`,
    stopColor: d,
  }));
  return gradient;
};

const getData = (data) =>
  sortBy(
    data?.map((d) => {
      const year = Number(d.date.value.split('-', 1)[0]);
      const month = months?.find((m) => m.value === new Date(d.date.value).getMonth() + 1);
      const day = new Date(year, month.value, 0).getDate();

      const lastDay = new Date(year, month.value, 0).getDate();

      return {
        ...d,
        month,
        year,
        date: `${year}-${month.value < 10 ? '0' : ''}${month.value}-${day}`,
        end: `${year}-${month.value < 10 ? '0' : ''}${month.value}-${day}`,
        start: d.date.value,
        title: month.label,
        name: `${monthsConversion[month.label]} '${new Date(year + 1, 0, 0).toLocaleDateString(
          'en',
          { year: '2-digit' }
        )}`,
        alerts: d.count,
        label: `${month.label}, ${year}`,
        startDate: {
          label: `${month.label}, ${year}`,
          value: `${year}-${month.value < 10 ? '0' : ''}${month.value}-01`,
        },
        endDate: {
          label: `${month.label}, ${year}`,
          value: `${year}-${month.value < 10 ? '0' : ''}${month.value}-${lastDay}`,
        },
      };
    }),
    ['month']
  );

const TickSmall = ({ x, y, payload }) => {
  const { value } = payload;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        textAnchor="end"
        fill="#3A3F59"
        opacity={0.5}
        transform="rotate(270)"
        fontSize="8px"
      >
        {value}
      </text>
    </g>
  );
};

const getTotal = (data) =>
  data?.reduce((previous: number, current: { count: number }) => current.count + previous, 0);

export function useAlerts<T>(
  startDate: { label: string; value: string },
  endDate: { label: string; value: string },
  params?: UseParamsOptions,
  dataParams?: DataParams,
  queryOptions?: UseQueryResult<DataResponse[], T>
) {
  const setStartDate = useSetRecoilState(alertsStartDate);
  const setEndDate = useSetRecoilState(alertsEndDate);
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];
  const {
    data: { location_id },
  } = useLocation(id, locationType);
  const { enabled: isAnalysisRunning } = useRecoilValue(analysisAtom);

  const fetchAlerts = () =>
    isAnalysisRunning
      ? API_cloud_functions.request({
          method: 'POST',
          url: '/fetch-alerts',
          data: dataParams,
        }).then((response) => response.data)
      : API_cloud_functions.request({
          method: 'GET',
          url: '/fetch-alerts',
          params: {
            location_id,
            ...params,
          },
        }).then((response) => response.data);

  const query = useQuery(['alerts', params, location_id], fetchAlerts, {
    placeholderData: [],
    ...queryOptions,
  });

  const { data, isFetched } = query;

  const fullData = getData(data);
  const noData = isFetched && !fullData?.length;

  const startDateOptions = fullData.map((d) => d.startDate);
  const endDateOptions = fullData.map((d) => d.endDate);

  const defaultStartDate = startDateOptions[0];
  const defaultEndDate = endDateOptions[endDateOptions.length - 1];

  const selectedStartDate = startDate || defaultStartDate;
  const selectedEndDate = endDate || defaultEndDate;

  if (selectedEndDate) setEndDate(selectedEndDate);
  if (selectedStartDate) setStartDate(selectedStartDate);
  const dataFiltered = data?.filter(
    (d) => selectedStartDate?.value <= d.date.value && d.date.value <= selectedEndDate?.value
  );

  const chartData = getData(dataFiltered);

  const startIndex = fullData.findIndex((d) => d.startDate?.value === selectedStartDate?.value);
  const endIndex = fullData.findIndex((d) => d.endDate?.value === selectedEndDate?.value);

  return useMemo(() => {
    const alertsTotal = getTotal(dataFiltered);

    const config = {
      data: chartData,
      type: 'line',
      dataKey: 'alerts',
      height: 350,
      cartesianGrid: {
        vertical: false,
        horizontal: false,
      },
      margin: { top: 50, right: 10, left: 10, bottom: 35 },
      label: 'alerts',
      // gradients: {
      //   key: {
      //     attributes: {
      //       id: 'colorAlerts',
      //       x1: 0,
      //       y1: 0,
      //       x2: 0,
      //       y2: 1,
      //     },
      //     stops: getStops(),
      //   },
      // },
      // patterns: {
      //   diagonal: {
      //     attributes: {
      //       id: 'diagonal-stripe-1',
      //       patternUnits: 'userSpaceOnUse',
      //       patternTransform: 'rotate(-45)',
      //       width: 4,
      //       height: 6,
      //     },
      //     children: {
      //       rect2: {
      //         tag: 'rect',
      //         x: 0,
      //         y: 0,
      //         width: 4,
      //         height: 6,
      //         transform: 'translate(0,0)',
      //         fill: '#d2d2d2',
      //       },
      //       rect: {
      //         tag: 'rect',
      //         x: 0,
      //         y: 0,
      //         width: 3,
      //         height: 6,
      //         transform: 'translate(0,0)',
      //         fill: '#fff',
      //       },
      //     },
      //   },
      // },
      xKey: 'name',
      chartBase: {
        lines: {
          alerts: {
            stroke: 'url(#colorAlerts)',
            strokeWidth: 2.5,
            isAnimationActive: false,
          },
        },
      },
      xAxis: {
        tick: TickSmall,
        interval: 0,
        type: 'category',
      },
      yAxis: {
        tick: {
          fontSize: 10,
          fill: 'rgba(0,0,0,0.54)',
        },

        width: 40,
        // tickFormatter: (value) => formatAxis(Math.round(value)),
        interval: 0,
        orientation: 'right',
        value: 'alerts',
        label: ({ viewBox }: { viewBox: CartesianViewBox }) => {
          const { x, y } = viewBox;

          return (
            <g>
              <text
                x={x + 20}
                y={y - 40}
                className="recharts-text recharts-label-medium"
                textAnchor="middle"
                dominantBaseline="central"
              >
                <tspan
                  alignmentBaseline="middle"
                  fill="rgba(0,0,0,0.24)"
                  stroke="rgba(0,0,0,0.24)"
                  fontSize="12"
                >
                  Alerts
                </tspan>
              </text>
              {/* <text x={x + 20} y={y - 50} className="recharts-text recharts-label-large" textAnchor="middle" dominantBaseline="central">
                <tspan alignmentBaseline="middle" fill="rgba(0,0,0,0.85)" lineheight="29" fontSize="12">2022</tspan>
              </text> */}
            </g>
          );
        },
        type: 'number',
      },
      // brush: {
      //   margin: { top: 60, right: 0, left: 0, bottom: 0 },
      //   startIndex,
      //   endIndex,
      // },
      // customBrush: {
      //   margin: { top: 60, right: 0, left: 15, bottom: 60 },
      //   startIndex,
      //   endIndex,
      // },
      tooltip: {
        content: (properties) => {
          return <Tooltip {...properties} payload={properties.payload?.[0]?.payload} />;
        },
      },
    };
    const configBrush = {
      data: fullData,
      type: 'line',
      dataKey: 'alerts',
      height: 100,
      cartesianGrid: {
        vertical: false,
        horizontal: false,
      },
      referenceAreas: [
        {
          x1: 0,
          x2: 11,
          y1: -100,
          y2: 480,
          fill: 'url(#diagonal-stripe-1) #000',
        },
        {
          x1: startDate?.value,
          x2: endDate?.value,
          y1: -100,
          y2: 480,
          fill: '#fff',
          fillOpacity: 1,
        },
      ],
      margin: { top: 20, right: 40, left: 10, bottom: 5 },
      gradients: {
        key: {
          attributes: {
            id: 'colorAlerts',
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: getStops(),
        },
      },
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
            rect2: {
              tag: 'rect',
              x: 0,
              y: 0,
              width: 4,
              height: 6,
              transform: 'translate(0,0)',
              fill: '#d2d2d2',
            },
            rect: {
              tag: 'rect',
              x: 0,
              y: 0,
              width: 3,
              height: 6,
              transform: 'translate(0,0)',
              fill: '#fff',
            },
          },
        },
      },

      xKey: 'name',
      chartBase: {
        lines: {
          alerts: {
            stroke: 'url(#colorAlerts)',
            strokeWidth: 2.5,
            isAnimationActive: false,
          },
        },
      },
      xAxis: {
        tick: TickSmall,
        interval: 0,
        type: 'category',
      },

      tooltip: false,
      customBrush: {
        margin: { top: 60, right: 20, left: 15, bottom: 80 },
        startIndex,
        endIndex,
      },
    };

    return {
      ...query,
      config,
      fullData,
      configBrush,
      selectedStartDate,
      selectedEndDate,
      startDateOptions,
      endDateOptions,
      dateOptions: startDateOptions,
      alertsTotal: formatAxis(alertsTotal),
      chartData,
      defaultStartDate,
      defaultEndDate,
      noData,
    };
  }, [query, startDate, endDate, data, startIndex, endIndex, selectedStartDate, selectedEndDate]);
}

// dataset layer
export function useSources(): SourceProps[] {
  const startDate = useRecoilValue(alertsStartDate);
  const endDate = useRecoilValue(alertsEndDate);

  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];
  const {
    data: { location_id },
  } = useLocation(id, locationType);

  return [
    {
      id: 'monitored-alerts',
      type: 'vector',
      url: 'mapbox://globalmangrovewatch.c5dgz6m3',
    },
    {
      id: 'alerts-heatmap',
      type: 'geojson',
      data: `https://us-central1-mangrove-atlas-246414.cloudfunctions.net/fetch-alerts-heatmap?start_date=${
        startDate?.value || ''
      }&end_date=${endDate?.value || ''}`,
    },
    {
      id: 'alerts-tiles',
      type: 'vector',
      tiles: [
        `https://us-central1-mangrove-atlas-246414.cloudfunctions.net/alerts-tiler?x={x}&y={y}&z={z}&start_date=${
          startDate?.value || ''
        }&end_date=${endDate?.value || ''}`,
      ],
      minzoom: 10,
      maxzoom: 14,
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
  'alerts-heatmap': LayerProps[];
  'alerts-tiles': LayerProps[];
  'monitored-alerts': LayerProps[];
} {
  return {
    'alerts-heatmap': [
      {
        id,
        type: 'heatmap',
        source: 'alerts-heatmap',
        maxzoom: 10,
        paint: {
          // Increase the heatmap weight based on frequency and property magnitude
          'heatmap-weight': ['interpolate', ['linear'], ['get', 'count'], 0, 0, 6, 1],
          // Increase the heatmap color weight weight by zoom level
          // heatmap-intensity is a multiplier on top of heatmap-weight
          'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
          // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
          // Begin color ramp at 0-stop with a 0-transparancy color
          // to create a blur-like effect.
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(255, 255, 255, 0)',
            0.1,
            'rgba(255, 194, 0, 1)',
            0.5,
            'rgba(235, 68, 68, 1)',
            1,
            'rgba(199, 43, 214, 1)',
          ],
          // Adjust the heatmap radius by zoom level
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
          // Transition from heatmap to circle layer by zoom level
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            opacity * 2,
            opacity * 1,
            opacity * 11,
            opacity * 0.5,
          ],
        },
        layout: {
          visibility,
        },
      },
    ],
    'alerts-tiles': [
      {
        id: `${id}-points`,
        type: 'circle',
        source: 'alerts-tiles',
        'source-layer': 'geojsonLayer',
        minzoom: 10,
        maxzoom: 18,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 5, 18, 2],
          'circle-color': 'rgba(255, 194, 0, 1)',
          'circle-stroke-color': 'rgba(255, 194, 0, 1)',
          'circle-stroke-width': 1,
          'circle-blur': 0.5,
          'circle-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            opacity * 9,
            opacity * 0,
            opacity * 10,
            opacity * 0.7,
          ],
        },
        layout: {
          visibility,
        },
      },
    ],
    'monitored-alerts': [
      {
        id: `${id}-line`,
        type: 'line',
        source: 'monitored-alerts',
        'source-layer': 'alert_region_tiles',
        minzoom: 0,
        paint: {
          'line-color': '#00857F',
          'line-opacity': opacity,
          'line-width': 1,
        },
        layout: {
          visibility,
        },
      },
    ],
  };
}
