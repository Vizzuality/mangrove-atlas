
import React from 'react';
import groupBy from 'lodash/groupBy';
import WidgetLegend from 'components/widget/legend';

export const CONFIG = {
  parse: () => ({
    chartData: [
      { year: '1996', uv: 4000, '0-10m': 18, '10-20m': 50, '20-30m': 70, '30-40m': 90, '40-50m': 98 },
      { year: '2007', uv: 3000, '0-10m': 30, '10-20m': 40, '20-30m': 60, '30-40m': 70, '40-50m': 75 },
      { year: '2008', uv: 2000, '0-10m': 10, '10-20m': 40, '20-30m': 65, '30-40m': 80, '40-50m': 85 },
      { year: '2009', uv: 2780, '0-10m': 15, '10-20m': 42, '20-30m': 67, '30-40m': 82, '40-50m': 90 },
      { name: '2010', uv: 1890, '0-10m': 20, '10-20m': 50, '20-30m': 70, '30-40m': 98, '40-50m': 102 },
    ],
    metadata: [1996, 2007, 2008, 2009, 2010],
    chartConfig: {
      cartesianGrid: {
        vertical: false,
        horizontal: true,
        strokeDasharray: '5 20'
      },
      xKey: 'years',
      yKeys: {
        bars:
        {
          '0-10m':
          {
            stackId: 'bar',
            fill: '#9ADBD9',
            stroke: '#9ADBD9'
          },
          '10-20m':
          {
            stackId: 'bar',
            fill: '#5BC3BD',
            stroke: '#5BC3BD'
          },
          '20-30m':
          {
            stackId: 'bar',
            fill: '#249892',
            stroke: '#249892'
          },
          '30-40m':
          {
            stackId: 'bar',
            fill: '#00746F',
            stroke: '#00746F'
          },
          '40-50m':
          {
            stackId: 'bar',
            fill: '#004B47',
            stroke: '#004B47'
          }
        }
      },
      xAxis: {
        tick: {
          color: 'rgba(0,0,0,0.54)',
          fontSize: 12,
          lineHeight: 20,
          fill: 'rgba(0,0,0,0.54)',
          stroke: 'rgba(0,0,0,0.54)',
          textShadow: '0 2px 4px 0 rgba(0,0,0,0.5)'
        },
        //
        domain: [1996, 2007, 2008, 2009, 2010]
        // domain: [0, 20, 40, 60, 80, 100]
      },
      yAxis: {
        tick: {
          fontSize: 12, fill: 'rgba(0,0,0,0.54)'
        },
        orientation: 'right',
        unit: 'Mg Ha-1',
        // domain: [1996, 2007, 2008, 2009, 2010],

        // domain: [0, 20, 40, 60, 80, 100],
        // type: 'number'
      },
      legend: {
        align: 'left',
        verticalAlign: 'top',
        layout: 'horizontal',
        height: 50,
        content: (properties) => {
          const { payload } = properties;
          const groups = groupBy(payload, p => p.payload.category);
          return <WidgetLegend type="height" groups={groups} />;
        }
      }
    },
  })
};


export default CONFIG;
