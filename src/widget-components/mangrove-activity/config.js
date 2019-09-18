import React from 'react';
import Link from 'redux-first-router-link';

// Utils
import { format } from 'd3-format';
import moment from 'moment';
import flatten from 'lodash/flatten';
import orderBy from 'lodash/orderBy';

// Components
import WidgetTooltip from 'components/widget-tooltip';
import WidgetLegend from 'components/widget-legend';

import styles from 'components/widget/style.module.scss';

const numberFormat = format(',.3r');
const sortRanking = data => orderBy(data, d => Math.abs(d)).map((f, index) => ({ ...f, x: index }));

function processData(data) {
  return {
    gain: data.map(d => d.gain_m2/1000000).reduce((previous, current) => current += previous),
    loss: -data.map(d => d.loss_m2/1000000).reduce((previous, current) => current += previous),
    net: data.map(d => d.net_change_m2/1000000).reduce((previous, current) => current += previous),
  };
}
const widgetData = data => data.map(location => ({
  name: location.name,
  iso: location.iso,
  ...processData(location.mangrove_datum)
}));

const widgetMeta = data => data.dates.map(d => moment(d.date).year()).sort((a, b) => a - b);

export const CONFIG = {
  parse: data => {
    const chartData = widgetData(data.data);
    const dataRanked = sortRanking(chartData);
    const max = Math.max(...flatten(chartData.map(d => [Math.abs(d.gain), Math.abs(d.loss)])));
    const domainX = [(-max + (-max * 0.05)), (max + (max * 0.05))];
    const startDomain = parseInt(domainX[0]);
    const endDomain = parseInt(domainX[1]);

    return {
      chartData,
      metaData: widgetMeta(data.meta),
      chartConfig: {
        layout: 'vertical',
        height: 400,
        stackOffset: 'sign',
        margin: { top: 20, right: -30, left: 20, bottom: 20 },
        viewBox: '0 0 360 400',
        referenceLines: [
          { x: 0, label: null, stroke: 'rgba(0,0,0,0.5)' }
        ],
        xAxis: {	
          type: 'number',	
          allowDecimals: false,
          interval: 'preserveStartEnd',
          ticks: [startDomain, startDomain / 2, 0, endDomain / 2, endDomain]
        },
        yAxis: {
          type: 'category'
        },
        yKeys: {
          lines: {
            net: {
              barSize: 10,
              fill: 'rgba(0,0,0,0.7)',
              radius: 4,
              legend: 'Net result',
              strokeWidth: 0,
              activeDot: false,
              dot: ({key, cx, cy}) => (
                <rect
                  key={key}
                  x={cx - 1}
                  y={cy - 10}
                  width="2"
                  height="20"
                  fill="#000"
                  stroke="rgba(0, 0, 0, 0.7)"
                />
              )
            }
          },
          bars: {
            gain: {
              barSize: 10,
              fill: '#A6CB10',
              radius: [0, 10, 10, 0],
              legend: 'Gain',
              stackId: 'stacked',
              label: {
                content: (prs) => {
                  const { index, y } = prs;
                  const { name, iso } = dataRanked[index];

                  return (
                    <g className={styles.activity_widget}>
                      <Link key={name} to={{ type: 'PAGE/COUNTRY', payload: { iso: iso } }}>
                        <text className={styles.link} x="50%" y={y - 15} textAnchor="middle" fill="#000">
                          {name}
                        </text>
                      </Link> 
                    </g>
                  );
                }
              }
            },
            loss: {
              barSize: 10,
              fill: '#EB6240',
              radius: [0, 10, 10, 0],
              stackId: 'stacked',
              legend: 'Loss'
            }
          },
        },
        legend: {
          align: 'center',
          verticalAlign: 'top',
          layout: 'horizontal',
          height: 50,

          content: ({ payload }) => {
            const labels = payload.map(({ color, payload }) => ({
              color: color === '#3182bd' ? color.replace('#3182bd', 'rgba(0, 0, 0, 0.7)') : color,
              value: payload.legend
              }))
            return <WidgetLegend direction="vertical" groups={{ labels }} />;
          }
        },
        cartesianGrid: {
          vertical: true,
          horizontal: false,
          verticalPoints: [0, 100, 200, 300, 400, 500],
          strokeDasharray: '5 20'
        },
        tooltip: {
          cursor: false,
          content: (
            <WidgetTooltip
              settings={[
                { key: 'name' },
                { label: 'Gain', color: '#A6CB10', key: 'gain', format: value => `${numberFormat(value)}km²` },
                { label: 'Loss', color: '#EB6240', key: 'loss', format: value => `${numberFormat(Math.abs(value))}km²` },
                { label: 'Net result', color: 'rgba(0,0,0,0.7)', key: 'net', format: value => `${numberFormat(value)}km²` }
              ]}
              label={{ key: 'name'}}
              payload={[
                //{ key: 'name' },
                { name: 'Gain', format: value => `${numberFormat(value)}`, unit: 'km²' },
                { name: 'Loss', format: value => `${numberFormat(value)}`, unit: 'km²' },
                { name: 'Net result', format: value => `${numberFormat(value)}`, unit: 'km²' },
              ]}
            />
          )
        }
      }
    }
  }
};


export default CONFIG;
