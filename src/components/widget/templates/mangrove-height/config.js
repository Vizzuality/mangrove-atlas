
import React from 'react';
import groupBy from 'lodash/groupBy';
import WidgetLegend from 'components/widget/legend';

export const CONFIG = {
  parse: () => ({
    chartData: [
      { year: 1996, '0 10m': 18, '10-20m': 50, '20-30m': 70, '30-40m': 90, '40-50m': 98 },
      { year: 2007, '0 10m': 30, '10 20m': 40, '20 30m': 60, '30 40m': 70, '40 50m': 75 },
      { year: 2008, '0 10m': 10, '10 20m': 40, '20 30m': 65, '30 40m': 80, '40 50m': 85 },
      { year: 2009, '0 10m': 15, '10 20m': 42, '20 30m': 67, '30 40m': 82, '40 50m': 90 },
      { year: 2010, '0 10m': 20, '10 20m': 50, '20 30m': 70, '30 40m': 98, '40 50m': 102 },
    ],
    metadata: [1996, 2007, 2008, 2009, 2010],
    chartConfig: {
      cartesianGrid: {
        vertical: false,
        horizontal: true,
        strokeDasharray: '5 20'
      },
      margin: { top: 0, right: 50, left: 0, bottom: 0 },
      xKey: 'year',
      yKeys: {
        bars:
        {
          '0 10m':
          {
            stackId: 'bar',
            fill: 'rgba(154, 219, 217, 0.5)',
            stroke: 'rgba(154, 219, 217, 0.5)'
          },
          '10 20m':
          {
            stackId: 'bar',
            fill: '#5BC3BD',
            stroke: '#5BC3BD'
          },
          '20 30m':
          {
            stackId: 'bar',
            fill: '#249892',
            stroke: '#249892'
          },
          '30 40m':
          {
            stackId: 'bar',
            fill: '#00746F',
            stroke: '#00746F'
          },
          '40 50m':
          {
            stackId: 'bar',
            fill: '#004B47',
            stroke: '#004B47'
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
          x: {
            x: 0,
            color: 'red',
            stroke: 'solid'
          },
          fontSize: 12,
          lineHeight: 20,
          fill: 'rgba(0,0,0,0.2)',
          stroke: 'rgba(0,0,0,0.2)',
          textShadow: '0 2px 4px 0 rgba(0,0,0,0.5)'
        },
        ticks: ['1996', '2007', '2008', '2009', '2010'],
        domain: [1996, 2010],
        interval: 0
      },
      yAxis: {
        tick: {
          fontSize: 12, fill: 'rgba(0,0,0,0.54)'
        },
        domain: [0, 400],
        interval: 0,
        orientation: 'right',
        label: {
          content: ({ viewBox }) => (
            <g>
              <text
                x={365}
                y={50}
                fontSize={12}
                fill="rgba(0,0,0,0.54)"
              >
              Mg Ha-1
              </text>
            </g>
          )
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
      }
    },
  })
};


export default CONFIG;
