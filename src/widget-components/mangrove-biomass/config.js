
import React from 'react';
import groupBy from 'lodash/groupBy';
import { format } from 'd3-format';
import WidgetLegend from 'components/widget-legend';
import WidgetTooltip from 'components/widget-tooltip';

const numberFormat = format(',.3r');

export const CONFIG = {
  parse: () => ({
    chartData: [
      { year: 1996, '0 50': 18, '50 100': 50, '100 150': 70, '150 200': 90, '200 250': 98 },
      { year: 2007, '0 50': 30, '50 100': 40, '100 150': 60, '150 200': 70, '200 250': 75 },
      { year: 2008, '0 50': 10, '50 100': 40, '100 150': 65, '150 200': 80, '200 250': 85 },
      { year: 2009, '0 50': 15, '50 100': 42, '100 150': 67, '150 200': 82, '200 250': 90 },
      { year: 2010, '0 50': 20, '50 100': 50, '100 150': 70, '150 200': 98, '200 250': 102 },
    ],
    metadata: [1996, 2007, 2008, 2009, 2010],
    chartConfig: {
      height: 300,
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
          '0 50':
          {
            stackId: 'bar',
            fill: '#EAF19D',
            stroke: '#EAF19D',
            isAnimationActive: false
          },
          '50 100':
          {
            stackId: 'bar',
            fill: '#B8E98E',
            stroke: '#B8E98E',
            isAnimationActive: false
          },
          '100 150':
          {
            stackId: 'bar',
            fill: '#1B97C1',
            stroke: '#1B97C1',
            isAnimationActive: false
          },
          '150 200':
          {
            stackId: 'bar',
            fill: '#1C52A3',
            stroke: '#1C52A3',
            isAnimationActive: false
          },
          '200 250':
          {
            stackId: 'bar',
            fill: '#13267F',
            stroke: '#13267F',
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
        ticks: [0, 100, 200, 300],
        interval: 0,
        orientation: 'right',
        label: {
          content: () => (
            <g>
              <text
                x={367}
                y={45}
                fontSize={11}
                fill="rgba(0,0,0,0.54)"
              >
                mg ha<tspan baselineShift = "super">-1</tspan>
              </text>
            </g>
          )
        },
        type: 'number'
      },
      legend: {
        position: 'relative',
        verticalAlign: 'top',
        top: 10,
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
              { label: '0 50:', color: '#EAF19D', key: '0 50' , format: value => `${numberFormat(value)}`, position: '_column', type: '_stacked'},
              { label: '50 100:', color: '#B8E98E', key: '50 100', format: value => `${numberFormat(value)}`, position: '_column', type: '_stacked'},
              { label: '100 150:', color: '#1B97C1', key: '100 150', format: value => `${numberFormat(value)}`, position: '_column', type: '_stacked'},
              { label: '150 200:', color: '#1C52A3', key: '150 200', format: value => `${numberFormat(value)}`, position: '_column', type: '_stacked'},
              { label: '200 250:', color: '#13267F', key: '200 250', format: value => `${numberFormat(value)}`, position: '_column', type: '_stacked'},
            ]}
            label={{ key: 'name'}}
          />
        )
      } 
    },
  })
};


export default CONFIG;
