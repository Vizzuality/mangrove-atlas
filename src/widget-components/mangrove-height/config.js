import React from 'react';
import groupBy from 'lodash/groupBy';
import WidgetLegend from 'components/widget-legend';

export const CONFIG = {
  parse: () => ({
    chartData: [
      { year: 1996, '0 5': 18, '5 10': 50, '10 15': 70, '15 20': 90, '20 25': 98 },
      { year: 2007, '0 5': 30, '5 10': 40, '10 15': 60, '15 20': 70, '20 25': 75 },
      { year: 2008, '0 5': 10, '5 10': 40, '10 15': 65, '15 20': 80, '20 25': 85 },
      { year: 2009, '0 5': 15, '5 10': 42, '10 15': 67, '15 20': 82, '20 25': 90 },
      { year: 2010, '0 5': 20, '5 10': 50, '10 15': 70, '15 20': 98, '20 25': 102 },
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
          '0 5':
          {
            stackId: 'bar',
            fill: 'rgba(154, 219, 217, 0.5)',
            stroke: 'rgba(154, 219, 217, 0.5)'
          },
          '5 10':
          {
            stackId: 'bar',
            fill: '#5BC3BD',
            stroke: '#5BC3BD'
          },
          '10 15':
          {
            stackId: 'bar',
            fill: '#249892',
            stroke: '#249892'
          },
          '15 20':
          {
            stackId: 'bar',
            fill: '#00746F',
            stroke: '#00746F'
          },
          '20 25':
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
          content: () => (
            <g>
              <text
                x={365}
                y={50}
                fontSize={13}
                fill="rgba(0,0,0,0.54)"
              >
                mg Ha<tspan baselineShift = "super">-1</tspan>
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
