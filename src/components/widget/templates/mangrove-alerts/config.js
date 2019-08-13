import React from 'react';
import WidgetLegend from 'components/widget/legend';
import { range } from 'lodash';

import {
  Text
} from 'recharts';

const widgetData = () => [
  {
    label: '2001',
    year: 2001,
    signal: 0
  },
  {
    label: '2005',
    year: 2005,
    signal: 0
  },
  {
    label: '2007',
    year: 2007,
    signal: 0
  }
];

export const CONFIG = {
  parse: ({startYear, endYear}) => {
    return {
      chartData: widgetData().map(l => (
        {
          ...l,
          x: l.label
        }
      )),
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
        referenceLines: [
          {
            x: startYear,
            stroke: 'rgb(0,0,0)',
            strokeWidth: 1,
            label: {
              value: 'v',
              content: ({viewBox: o}) => (
                <g transform={`translate(${o.x - 10}, ${o.y})`}>
                  <path d="m 0,0 h 1 v 1 z" transform="scale(10, 20)" fill="#000"></path>
                </g>
              )
            }
          },
          {
            x: endYear,
            stroke: 'rgb(0,0,0)',
            strokeWidth: 1,
            label: {
              value: 'v',
              content: ({viewBox: o}) => (
                <g transform={`translate(${o.x}, ${o.y})`}>
                  <path d="m 0,0 h 1 v 1 z" transform="translate(10, 0) scale(-10, 20)" fill="#000"></path>
                </g>
              )
            }
          }
        ],
        referenceAreas: [
          {
            x1: 1996,
            x2: 2016,
            y1: -100,
            y2: 90,
            fill: 'url(#diagonal-stripe-1) #000'
          },
          {
            x1: startYear,
            x2: endYear,
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
          domain: [1996, 2016],
          scale: 'linear',
          ticks: range(1996,2017),
          tick: props => {
            const { payload: { value } } = props;
            const options = {...props};
            let show = false;
          
            if (value === 1996) {
              show = true;
              options.textAnchor = 'start';
              options.y = options.y + 6;
            }

            if (value === 2016) {
              show = true;
              options.textAnchor = 'end';
              options.y = options.y + 6;
            }

            return show ? <Text {...options}>{value}</Text> : null;
          }
        },
        yAxis: {
          tick: { fontSize: 12, fill: '#AAA' },
          domain: [-100, 100]
        },
        xKey: 'year',
        yKeys: {
          lines: {
            signal: {
              strokeWidth: 0,
              isAnimationActive: false,
              dot: {
                stroke: 'red',
                strokeWidth: 5
              },
              title: 'Alerts'
            }
          }
        },
        legend: {
          align: 'center',
          verticalAlign: 'bottom',
          layout: 'horizontal',
          height: 50,
          content: (properties) => {
            const { payload } = properties;
            const labels = payload.map(({color, value, payload}) => ({
              color,
              value: payload.title || value
            }));
            return <WidgetLegend direction="vertical" groups={{labels}} />;
          }
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
