import React from 'react';
import groupBy from 'lodash/groupBy';
import { format } from 'd3-format';
import WidgetLegend from 'components/widget-legend';
import WidgetTooltip from 'components/widget-tooltip';

const numberFormat = format(',.3r');

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
            fill: '#C9BB42',
            stroke: '#C9BB42',
            isAnimationActive: false
          },
          '5 10':
          {
            stackId: 'bar',
            fill: '#8BA205',
            stroke: '#8BA205',
            isAnimationActive: false
          },
          '10 15':
          {
            stackId: 'bar',
            fill: '#428710',
            stroke: '#428710',
            isAnimationActive: false
          },
          '15 20':
          {
            stackId: 'bar',
            fill: '#0A6624',
            stroke: '#0A6624',
            isAnimationActive: false
          },
          '20 25':
          {
            stackId: 'bar',
            fill: '#103C1F',
            stroke: '#103C1F',
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
                x={400}
                y={50}
                fontSize={13}
                fill="rgba(0,0,0,0.54)"
              >
                m
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
      },
      tooltip: {
        cursor: false,
        content: (
          <WidgetTooltip
            type='column'
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              flexDirection: 'column'
            }}
            settings={[
              { label: '0 5:', color: '#C9BB42', key: '0 5' , format: value => `${numberFormat(value)}`, position: '_column', type: '_stacked'},
              { label: '5 10:', color: '#8BA205', key: '5 10', format: value => `${numberFormat(value)}`, position: '_column', type: '_stacked'},
              { label: '10 15:', color: '#428710', key: '10 15', format: value => `${numberFormat(value)}`, position: '_column', type: '_stacked'},
              { label: '15 20:', color: '#0A6624', key: '15 20', format: value => `${numberFormat(value)}`, position: '_column', type: '_stacked'},
              { label: '20 25:', color: '#103C1F', key: '20 25', format: value => `${numberFormat(value)}`, position: '_column', type: '_stacked'},
            ]}
            label={{ key: 'name'}}
          />
        )
      } 
    },
  })
};


export default CONFIG;
