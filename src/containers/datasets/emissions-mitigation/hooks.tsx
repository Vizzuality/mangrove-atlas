import { useMemo } from 'react';

import groupBy from 'lodash-es/groupBy';
import orderBy from 'lodash-es/orderBy';

import { useRouter } from 'next/router';

import { significantDigitsFormat } from 'lib/format';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import chroma from 'chroma-js';
import type { CartesianViewBox } from 'recharts/types/util/types';

import { useLocation } from 'containers/datasets/locations/hooks';

import API from 'services/api';

import CustomTooltip from './tooltip';
import type { DataResponse, UseParamsOptions, emissionsMitigationData, Data } from './types';

interface DataBar {
  category: DataResponse['data'][0]['category'];
  indicator: DataResponse['data'][0]['category'];
  [key: string]: number | DataResponse['data'][0]['category'];
}
const COLORS = {
  'reduce mangrove loss': '#79D09A',
  'mangrove restoration': '#3EA3A1',
  'reforestation (tropics)': '#FBD07E',
  'reduce peatland degradation and conversion': '#FF98B1',
  'reduce deforestation': '#C57CF2',
  'grassland and savanna fire mgmt': '#74C5FF',
  'forest management (global)': '#7287F9',
};

const getData = (data) => {
  const dataByCategory = groupBy(data, 'category');
  const bars = Object.values(dataByCategory);

  return bars.map<DataBar>((d) =>
    d.reduce((acc, r) => {
      acc.category = r.category;
      acc[r.indicator] = r.value;
      return acc;
    }, {} as DataBar)
  );
};

const getBars = (indicators, filteredIndicators) =>
  indicators?.reduce(
    (acc, indicator, i) => ({
      ...acc,
      [Object.keys(indicator)[0]]: {
        stackId: 'bar',
        barSize: 60,
        category: Object.keys(indicator)[0],
        fill: Object.values(indicator)[0],
        stroke: Object.values(indicator)[0],
        isAnimationActive: false,
        opacity:
          filteredIndicators.includes(Object.keys(indicator)[0]) || !filteredIndicators.length
            ? 1
            : 0.5,
      },
    }),
    {}
  );

const getLegendPayload = (data) =>
  data?.map((d) => ({
    label: Object.keys(d)[0],
    color: Object.values(d)[0],
    order: d.order,
    category: d.category,
  }));

const LabelContent = () => (
  <g>
    <text
      x={-180}
      y={14}
      transform="rotate(270)"
      textAnchor="middle"
      fill="rgba(0, 0, 0, 0.55)"
      fontSize="14px"
    >
      Mitigation (tCO
      <tspan style={{ baselineShift: 'sub' }}>2</tspan>
      e/ha)
    </text>
  </g>
);

const LabelXAxis = ({ viewBox }: { viewBox: CartesianViewBox }) => {
  const { x, y, height, width } = viewBox;
  return (
    <g>
      <text
        x={x + width / 2}
        y={y + height + 5}
        textAnchor="middle"
        fill="rgba(0, 0, 0, 0.55)"
        fontSize="14px"
      >
        Interventions
      </text>
    </g>
  );
};

// widget data
export function useMangroveEmissionsMitigation(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse, unknown>
) {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0];
  const id = queryParams?.[1];
  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(locationType, id);
  const { filteredIndicators, ...rest } = params;

  const fetchMangroveEmissionsMitigation = () =>
    API.request({
      method: 'GET',
      url: '/widgets/mitigation_potentials',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...rest,
      },
      ...queryOptions,
    }).then((response) => response.data);
  const query = useQuery(['mitigation-potentials', location_id], fetchMangroveEmissionsMitigation, {
    placeholderData: {
      data: [],
      metadata: null,
    },
    ...queryOptions,
  });

  const { data } = query;
  const noData = !data?.data?.length;
  const DATA = useMemo(() => {
    const COLOR_RAMP = chroma
      .scale(['#79D09A', '#3EA3A1', '#FBD07E', '#FF98B1', '#C57CF2', '#74C5FF', '#7287F9'])
      .colors(data?.data?.length || 0);
    const orderedData = orderBy(data?.data, ['category'], ['asc']);
    const indicators =
      orderedData?.map((d, i) => ({
        [d.indicator]: COLORS[d.indicator.toLowerCase()] || COLOR_RAMP[i],
        category: d.category,
        color: COLORS[d.indicator.toLowerCase()] || COLOR_RAMP[i],
        order: `${i}-${d.category}`,
      })) || ([] satisfies Data[]);

    const chartData = getData(orderedData);

    const legendPayload = getLegendPayload(indicators);
    const config = {
      chartBase: {
        type: 'bar',
        bars: getBars(indicators, filteredIndicators),
      },
      data: chartData,
      xKey: 'category',
      height: 360,
      margin: {
        top: 20,
        right: 0,
        left: 25,
        bottom: 20,
      },
      xAxis: {
        tick: {
          fontSize: 12,
          lineheight: 20,
          fill: 'rgba(0, 0, 0, 0.54)',
        },
        axisLine: false,
        interval: 0,
        label: {
          content: LabelXAxis,
        },
        type: 'category',
      },
      yAxis: {
        tick: {
          fontSize: 12,
          fill: 'rgba(0,0,0,0.54)',
        },
        tickFormatter: (value) => significantDigitsFormat(value),
        width: 40,
        interval: 0,
        label: {
          content: LabelContent,
        },
        type: 'number',
      },
      cartesianGrid: {
        vertical: false,
        strokeDasharray: '5 5',
      },
      legend: legendPayload,
      tooltip: {
        content: (properties) => {
          const { payload } = properties;
          return <CustomTooltip {...properties} payload={payload} />;
        },
      },
    };

    return {
      location,
      noData,
      config,
    } satisfies emissionsMitigationData;
  }, [query, data]);

  return useMemo(() => {
    return {
      ...query,
      data: DATA,
    };
  }, [query]);
}
