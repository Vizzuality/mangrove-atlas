
import React from 'react';
import groupBy from 'lodash/groupBy';
import WidgetLegend from 'components/widget/legend';

export const CONFIG = {
  parse: () => ({
    chartData: [
      { year: 1996, '0 25m': 18, '25 50m': 50, '50 75m': 70, '75 100m': 90, '100 125m': 98 },
      { year: 2007, '0 25m': 30, '25 50m': 40, '50 75m': 60, '75 100m': 70, '100 125m': 75 },
      { year: 2008, '0 25m': 10, '25 50m': 40, '50 75m': 65, '75 100m': 80, '100 125m': 85 },
      { year: 2009, '0 25m': 15, '25 50m': 42, '50 75m': 67, '75 100m': 82, '100 125m': 90 },
      { year: 2010, '0 25m': 20, '25 50m': 50, '50 75m': 70, '75 100m': 98, '100 125m': 102 },
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
          '0 25m':
          {
            stackId: 'bar',
            fill: '#EAF19D',
            stroke: '#EAF19D'
          },
          '25 50m':
          {
            stackId: 'bar',
            fill: '#B8E98E',
            stroke: '#B8E98E'
          },
          '50 75m':
          {
            stackId: 'bar',
            fill: '#1B97C1',
            stroke: '#1B97C1'
          },
          '75 100m':
          {
            stackId: 'bar',
            fill: '#1C52A3',
            stroke: '#1C52A3'
          },
          '100 125m':
          {
            stackId: 'bar',
            fill: '#13267F',
            stroke: '#13267F'
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
