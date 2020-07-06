import React from 'react';
import groupBy from 'lodash/groupBy';
import { format } from 'd3-format';
import sortBy from 'lodash/sortBy';
import moment from 'moment';
import WidgetLegend from 'components/widget-legend';
import WidgetTooltip from 'components/widget-tooltip';

const numberFormat = format(',.3r');


const dataFake = [
  { name: 'Page A', alerts: 4000, amt: 2400 },
  { name: 'Page B', alerts: 3000, amt: 2210 },
  { name: 'Page C', alerts: 2000, amt: 2290 },
  { name: 'Page D', alerts: 2780, amt: 2000 },
  { name: 'Page E', alerts: 1890, amt: 2181 },
  { name: 'Page F', alerts: 2390, amt: 2500 },
  { name: 'Page G', alerts: 3490, amt: 2100 },
];


const metaData = data => Array.from(new Set(
  data.map(d => moment(d.date).year())
));

export const CONFIG = {
  parse: (data, date) => {
    {
      return {

        chartData: dataFake,
        // metadata: metaData(dataFiltered),
        chartConfig: {
          height: 360,
          cartesianGrid: {
            vertical: false,
            horizontal: true,
            strokeDasharray: '5 20'
          },
          margin: { top: 20, right: 0, left: 0, bottom: 20 },
          xKey: 'name',
          yKeys: {
            lines: {
              alerts: {
                stroke: '#EB6240',
                strokeWidth: 1,
                isAnimationActive: false
              }
            }
          },
          referenceLines: [{
            y: 0,
            stroke: 'black',
            strokeDasharray: 'solid',
            fill: 'black',
            opacity: '1',
            label: null
          }],
          xAxis: {
            tick: {
              fontSize: 12,
              lineHeight: 20,
              fill: 'rgba(0, 0, 0, 0.54)'
            },
            ticks: metaData(data),
            interval: 0
          },
          yAxis: {
            tick: {
              fontSize: 12,
              fill: 'rgba(0,0,0,0.54)'
            },
            width: 40,
            tickFormatter: value => Math.round(value),
            domain: [0, 100],
            interval: 0,
            orientation: 'right',
            label: {
              value: '%',
              position: 'top',
              offset: 25
            },
            type: 'number'
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
              const groups = groupBy(payload, p => p.payload);
              return <WidgetLegend type="height" groups={groups} />;
            }
          },
          tooltip: {
            cursor: false,
            content: (
              <WidgetTooltip
                type="column"
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  flexDirection: 'column'
                }}
                settings={[
                  { label: '0–5 m', color: '#C9BB42', key: '0–5', format: value => `${numberFormat(value)} %`, position: '_column', type: '_stacked' },
                  { label: '5–10 m', color: '#8BA205', key: '5–10', format: value => `${numberFormat(value)} %`, position: '_column', type: '_stacked' },
                  { label: '10–15 m', color: '#428710', key: '10–15', format: value => `${numberFormat(value)} %`, position: '_column', type: '_stacked' },
                  { label: '15–20 m', color: '#0A6624', key: '15–20', format: value => `${numberFormat(value)} %`, position: '_column', type: '_stacked' },
                  { label: '20–25 m', color: '#103C1F', key: '20–25', format: value => `${numberFormat(value)} %`, position: '_column', type: '_stacked' },
                ].reverse()}
                label={{ key: 'name' }}
              />
            )
          }
        },
      };
    }
  }
};


export default CONFIG;
