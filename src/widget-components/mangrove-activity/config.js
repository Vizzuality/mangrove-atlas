import React from 'react';
import Link from 'redux-first-router-link';
import { Rectangle } from 'recharts';

// Utils
import { format } from 'd3-format';
import moment from 'moment';
import flatten from 'lodash/flatten';
import orderBy from 'lodash/orderBy';

// Components
import WidgetTooltip from 'components/widget-tooltip';
import WidgetLegend from 'components/widget-legend';

import styles from 'components/widget/style.module.scss';
import { faAssistiveListeningSystems } from '@fortawesome/free-solid-svg-icons';

const numberFormat = format(',.3r');
const sortRanking = (data, filter) => orderBy(data, d => -Math.abs(d[filter]))
  .map((f, index) => ({ ...f, x: index }));

function processData(data) {
  return {
    gain: data.map(d => d.gain_m2 / 1000000).reduce((previous, current) => current + previous, 0),
    loss: -data.map(d => d.loss_m2 / 1000000).reduce((previous, current) => current + previous, 0),
    net_change: data.map(d => d.net_change_m2 / 1000000)
      .reduce((previous, current) => current + previous, 0)
  };
}
const widgetData = data => data.map(location => ({
  name: location.name,
  iso: location.iso,
  ...processData(location.mangrove_datum)
}));

const widgetMeta = data => data.dates.map(d => moment(d.date).year()).sort((a, b) => a - b);

export const CONFIG = {
  parse: (data, filter, limit) => {
    const chartData = widgetData(data.data);
    const dataRanked = sortRanking(chartData, filter);
    const max = Math.max(...flatten(chartData.map(d => [Math.abs(d.gain), Math.abs(d.loss)])));
    const domainX = [(-max + (-max * 0.05)), (max + (max * 0.05))];
    const startDomain = parseInt(domainX[0], 10);
    const endDomain = parseInt(domainX[1], 10);

    return {
      chartData,
      dataRanked,
      metaData: [1996, 2007, 2008, 2009, 2010, 2015, 2016],
      chartConfig: {
        layout: 'vertical',
        height: limit === 5 ? 400 : limit / 5 * 100 + 350,
        stackOffset: 'sign',
        margin: { top: 20, right: 0, left: 0, bottom: 20 },
        // viewBox: '0 0 400 400',
        referenceLines: [
          { x: 0, label: null, stroke: 'rgba(0,0,0,0.5)' }
        ],
        xAxis: {
          type: 'number',
          allowDecimals: false,
          interval: 'preserveStartEnd',
          ticks: [startDomain, startDomain / 2, 0, endDomain / 2, endDomain],
          tickFormatter: value => numberFormat(value),
          label: {
            value: 'km²',
            position: 'insideBottomRight',
            offset: 5
          }
        },
        yAxis: {
          type: 'category',
          width: 0,
          hide: true
        },
        yKeys: {
          bars: {
            gain: {
              barSize: 2,
              fill: '#A6CB10',
              legend: 'Gain',
              radius: [0, 10, 10, 0],
              stackId: '1',
              label: {
                content: (prs) => {
                  const { index, y } = prs;
                  const { name, iso } = dataRanked[index];

                  return (
                    <g className={styles.activity_widget}>
                      <Link key={name} to={{ type: 'PAGE/COUNTRY', payload: { iso } }}>
                        <text className={styles.link} x="50%" y={y - 10} textAnchor="middle" fill="#000">
                          {name}
                        </text>
                      </Link>
                    </g>
                  );
                }
              },
              isAnimationActive: false,
              shape: ({ x, y, width, height, fill, ...props }) => {
                const center = y + 3 + (height / 2);
                return (
                  <g>
                    <rect
                      x={x}
                      y={center}
                      width={width}
                      height={height}
                      fill={fill}
                    />
                    <line
                      x1={x + width} y1={center - 4} x2={x + width} y2={center + 6}
                      stroke="#A6CB10"
                      strokeWidth={2}
                    />
                  </g>
                );
              }
            },
            loss: {
              barSize: 20,
              fill: '#EB6240',
              radius: [0, 10, 10, 0],
              stackId: '1',
              legend: 'Loss',
              isAnimationActive: faAssistiveListeningSystems,
              shape: ({ x, y, width, height, fill, ...props }) => {
                const center = y + 3 + (height / 2);
                return (
                  <g>
                    <rect
                      x={x - Math.abs(width)}
                      y={y + 3 + (height / 2)}
                      width={Math.abs(width)}
                      height={height}
                      fill={fill}
                    />
                    <line
                      x1={x + width}
                      y1={center - 4}
                      x2={x + width}
                      y2={center + 6}
                      stroke="#EB6240"
                      strokeWidth={2}
                    />
                  </g>
                );
              }
            },
            net_change: {
              barSize: 10,
              fill: '#000',
              stackId: '2',
              legend: 'Net',
              shape: ({ x, y, width, height, fill, ...props }) => {
                return (
                  <Rectangle
                    x={x}
                    y={y + 3 - (height / 1.25)}
                    width={width}
                    height={height}
                    fill={fill}
                    radius={[0, 10, 10, 0]}
                  />
                );
              }
            }
          }
        },
        legend: {
          align: 'center',
          verticalAlign: 'top',
          layout: 'horizontal',
          height: 50,

          //eslint-disable-next-line react/prop-types
          content: ({ payload }) => {
            // const labels = payload.map(({ color, payload: labelPayload }) => ({
            //   color: color === '#3182bd' ? color.replace('#3182bd', 'rgba(0, 0, 0, 0.7)') : color,
            //   value: labelPayload.legend,
            // }));
            const labels = [
              { color: '#000', value: 'Net' },
              { color: '#EB6240', value: 'Loss' },
              { color: '#A6CB10', value: 'Gain' }
            ];

            return <WidgetLegend widgetSpecific="activity" groups={{ labels }} position="left" />;
          }
        },
        cartesianGrid: {
          vertical: true,
          horizontal: false,
          strokeDasharray: '5 20'
        },
        tooltip: {
          cursor: false,
          content: (
            <WidgetTooltip
              settings={[
                { title: 'name', key: 'name' },
                { label: 'Gain', color: '#A6CB10', key: 'gain', format: value => `${numberFormat(value)} km²` },
                { label: 'Loss', color: '#EB6240', key: 'loss', format: value => `${numberFormat(Math.abs(value))} km²` },
                { label: 'Net', color: 'rgba(0,0,0,0.7)', key: 'net_change', format: value => `${numberFormat(value)} km²` }
              ]}
              label={{ key: 'name' }}
              payload={[
                { name: 'Gain', format: value => `${numberFormat(value)}`, unit: ' km²' },
                { name: 'Loss', format: value => `${numberFormat(value)}`, unit: ' km²' },
                { name: 'Net', format: value => `${numberFormat(value)}`, unit: ' km²' },
              ]}
            />
          )
        }
      }
    };
  }
};

export default CONFIG;

