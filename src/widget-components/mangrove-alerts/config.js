import React from 'react';
import WidgetLegend from 'components/widget-legend';
import WidgetTooltip from 'components/widget-tooltip';
import { Text } from 'recharts';
import { range } from 'lodash';

const Months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

export const CONFIG = {
  
  parse: (data, { startMark, endMark, series }) => {
    return {
      chartData: data,
      metadata: {},
      chartConfig: {
        patterns: {
          diagonal: {
            attributes: {
              id: 'diagonal-stripe-1',
              patternUnits: 'userSpaceOnUse',
              patternTransform: 'rotate(-45)',
              width: 4,
              height: 6
            },
            children: {
              rect2: {
                tag: 'rect',
                x: 0,
                y: 0,
                width: 4,
                height: 6,
                transform: 'translate(0,0)',
                fill: '#d2d2d2'
              },
              rect: {
                tag: 'rect',
                x: 0,
                y: 0,
                width: 3,
                height: 6,
                transform: 'translate(0,0)',
                fill: '#fff'
              }
            }
          }
        },
        height: 500,
        referenceLines: [
          {
            x: startMark,
            stroke: 'rgb(0,0,0)',
            strokeWidth: 1,
            label: {
              value: 'v',
              content: ({ viewBox: o }) => (
                <g transform={`translate(${o.x - 10}, ${o.y})`}>
                  <path d="m 0,0 h 1 v 1 z" transform="scale(10, 20)" fill="#000" />
                </g>
              )
            }
          },
          {
            x: endMark,
            stroke: 'rgb(0,0,0)',
            strokeWidth: 1,
            label: {
              value: 'v',
              content: ({ viewBox: o }) => (
                <g transform={`translate(${o.x}, ${o.y})`}>
                  <path d="m 0,0 h 1 v 1 z" transform="translate(10, 0) scale(-10, 20)" fill="#000" />
                </g>
              )
            }
          }
        ],
        referenceAreas: [
          {
            x1: 0,
            x2: 11,
            y1: -100,
            y2: 90,
            fill: 'url(#diagonal-stripe-1) #000'
          },
          {
            x1: startMark,
            x2: endMark,
            y1: -100,
            y2: 100,
            fill: '#fff',
            fillOpacity: 1
          }
        ],
        margin: { top: 20, right: 0, left: 0, bottom: 20 },
        xAxis: {
          tickLine: true,
          tickCount: 30,
          minTickGap: 1,
          interval: 0,
          type: 'number',
          domain: [0, 11],
          scale: 'linear',
          ticks: range(0, 12),
          tick: (props) => {
            const { payload: { value } } = props;
            const options = { ...props };

            options.y += 6;

            if (value === 0) {
              options.textAnchor = 'start';
            }

            if (value === 11) {
              options.textAnchor = 'end';
            }

            return <Text {...options}>{Months[value]}</Text>;
          }
        },
        yAxis: {
          tick: { fontSize: 12, fill: '#AAA' },
          domain: [-100, 100]
        },
        xKey: 'mark',
        yKeys: {
          lines: series
        },
        legend: {
          align: 'center',
          verticalAlign: 'bottom',
          layout: 'horizontal',
          height: 50,
          content: ({ payload }) => {
            const labels = payload.map(({ color, value, payload }) => ({
              color,
              value: payload.title || value
            })).slice(0, 1);
            return <WidgetLegend direction="vertical" groups={{ labels }} variant="circle" />;
          }
        },
        tooltip: {
          cursor: false,
          content: (data,
            <WidgetTooltip
              settings={[
                { label: 'Date:', key: 'date', format: value => `${value}`, position: '_column' },
                { label: 'Category:', key: 'category', format: value => `${value || '--'}`, position: '_column' }
              ]}
            />
          )
        },
        cartesianAxis: {
          axisLine: true,
          ticks: [
            { dy: 8, fontSize: '12px', fill: '#AAA' }
          ],
          height: 1,
          width: 100
        }
      }
    };
  }
};


export default CONFIG;
