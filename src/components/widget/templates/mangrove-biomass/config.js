
import React from 'react';
import groupBy from 'lodash/groupBy';
import WidgetLegend from 'components/widget/legend';

export const CONFIG = {
  parse: () => ({
    chartData: [
      { year: 1996, '0-50m': 18, '50-100m': 50, '100-150m': 70, '150-200m': 90, '200-250m': 98 },
      { year: 2007, '0-50m': 30, '50-100m': 40, '100-150m': 60, '150-200m': 70, '200-250m': 75 },
      { year: 2008, '0-50m': 10, '50-100m': 40, '100-150m': 65, '150-200m': 80, '200-250m': 85 },
      { year: 2009, '0-50m': 15, '50-100m': 42, '100-150m': 67, '150-200m': 82, '200-250m': 90 },
      { year: 2010, '0-50m': 20, '50-100m': 50, '100-150m': 70, '150-200m': 98, '200-250m': 102 },
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
          '0-50m':
          {
            stackId: 'bar',
            fill: '#4DB36D',
            stroke: '#4DB36D'
          },
          '50-100m':
          {
            stackId: 'bar',
            fill: '#178A6B',
            stroke: '#178A6B'
          },
          '100-150m':
          {
            stackId: 'bar',
            fill: '#189370',
            stroke: '#189370'
          },
          '150-200m':
          {
            stackId: 'bar',
            fill: '#178F6E',
            stroke: '#178F6E'
          },
          '200-250m':
          {
            stackId: 'bar',
            fill: '#168368',
            stroke: '#168368'
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
                y={41}
                fontSize={11}
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
        position: 'relative',
        verticalAlign: 'top',
        width: '100%',
        top: 10,
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
