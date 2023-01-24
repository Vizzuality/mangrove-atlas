import React from 'react';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';

import { format } from 'd3-format';
import WidgetLegend from 'components/widget-legend';
import WidgetTooltip from 'components/widget-tooltip';

const numberFormat = format(',.3r');
const COLORS = ['#103C1F', '#0A6624', '#428710', '#8BA205', '#C9BB42'];
const getData = (data) => {
  if (!data || !data.length) return null;
  const barsValues = data?.map(({ value }) => value);
  const total = barsValues.reduce((previous, current) => current + previous);
  return [
    data.reduce(
      (acc, d) => ({
        ...acc,
        year: d.year,
        [`${d.indicator} m`]: (d.value / total) * 100,
      }),
      {},
    ),
  ];
};

const getBars = (data) => data.reduce(
  (acc, d, index) => ({
    ...acc,
    [`${d.indicator} m`]: {
      stackId: 'bar',
      barSize: 60,
      fill: COLORS[index],
      stroke: COLORS[index],
      isAnimationActive: false,
      indicator: Number(d.indicator.replace('-', '')),
    },
  }),
  {},
);

const getDownloadData = (data, heightCoverage) => {
  const parsedData = data.reduce(
    (acc, d, index) => ({
      ...acc,
      Date: d.year,
      'Mangrove maximum canopy height (m)': heightCoverage,
      [`${d.indicator} m`]: `percentage(%): ${d.value * 100} - color: ${
        COLORS[index]
      }`,
    }),
    {},
  );

  const {
    indicator, value, year, ...rest
  } = parsedData;
  return rest;
};

const sortByIndicator = (obj) => {
  const order = []; const
    res = {};
  Object.keys(obj).forEach((key) => order[obj[key].indicator - 1] = key);
  order.forEach((key) => {
    res[key] = obj[key];
  });
  return res;
};

export const CONFIG = {
  parse: (d, yearSelected, years, heightCoverage) => {
    const data = orderBy(d.map((el) => ({
      ...el,
      position: Number(el.indicator.replace('-', '')),
    })), ['position'], ['desc']);
    const chartData = getData(data, yearSelected);
    const downloadData = getDownloadData(data, heightCoverage);
    const bars = getBars(data);

    return {
      chartData,
      downloadData,
      chartConfig: {
        height: 360,
        cartesianGrid: {
          vertical: false,
          horizontal: true,
          strokeDasharray: '5 20',
        },
        margin: {
          top: 20, right: 0, left: 0, bottom: 20,
        },
        xKey: 'year',
        yKeys: {
          bars,
        },
        referenceLines: [
          {
            y: 0,
            stroke: 'black',
            strokeDasharray: 'solid',
            fill: 'black',
            opacity: '1',
            label: null,
          },
        ],
        xAxis: {
          tick: {
            fontSize: 12,
            lineheight: 20,
            fill: 'rgba(0, 0, 0, 0.54)',
          },
          ticks: years,
          interval: 0,
        },
        yAxis: {
          tick: {
            fontSize: 12,
            fill: 'rgba(0,0,0,0.54)',
          },
          width: 40,
          tickFormatter: (value) => Math.round(value),
          domain: [0, 100],
          interval: 0,
          orientation: 'right',
          label: {
            value: '%',
            position: 'top',
            offset: 25,
          },
          type: 'number',
        },
        legend: {
          align: 'left',
          verticalAlign: 'top',
          layout: 'horizontal',
          height: 80,
          top: 0,
          left: 0,
          position: 'relative',
          content: (properties) => {
            const { payload } = properties;
            const groups = groupBy(payload.reverse(), (p) => p.payload.dataKey);
            return <WidgetLegend type="horizontal" groups={groups} style={{ maxWidth: 440 }} />;
          },
        },
        tooltip: {
          cursor: false,
          content: (properties) => {
            const { payload } = properties;
            return (
              <WidgetTooltip
                payload={payload.reverse()}
                type="column"
                style={{
                  display: 'flex',
                  maxWidth: 150,
                  justifyContent: 'space-between',
                  flexDirection: 'column',
                }}
                settings={payload.map((p) => ({
                  label: p.name,
                  key: p.value,
                  color: p.color,
                  format: () => `${numberFormat(p.value)}%` || '0%',
                  position: '_column',
                  type: '_stacked',
                }))}
              />
            );
          },
        },
      },
    };
  },
};

export default CONFIG;
