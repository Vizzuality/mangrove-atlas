import React from 'react';
import moment from 'moment';
import orderBy from 'lodash/orderBy';
import flatten from 'lodash/flatten';

import { scaleLinear } from 'd3-scale';

import styles from 'components/widget/style.module.scss';

// Utils
import { format } from 'd3-format';

// Components
import WidgetTooltip from 'components/widget/tooltip';
import WidgetLegend from 'components/widget/legend';

const numberFormat = format(',.2f');

const widgetData = (activityData) => {
  if (!activityData) return null;
  console.log(activityData, 'activityData')
  const formattedData = activityData.map(p => (p.mangrove_datum.map(l => (
    {
      label: p.name,
      year: moment(l.date).year(),
      gain: l.gain_m2,
      net: l.net_change_m2,
      loss: l.loss_m2
    })).filter(l => l.net !== 0)
  ));
  return orderBy(formattedData, l => l.year);
};

const widgetMetadata = (activityData) => {
  const dates = activityData.map(p => (p.mangrove_datum.map(l => (
    moment(l.date).year()
  )).filter(l => l.netChange !== 0)
  ));
  return dates;
};

const getDomain = (activityData) => {
  const data = widgetData(activityData);
  if (!data) return [1996, 2005, 2007];
  const max = Math.max(...flatten(data
    .map(d => [Math.abs(d.gain), Math.abs(d.loss)])));
  return [-max + (-max * 0.05), max + (max * 0.05)];
};

export const CONFIG = {
  parse: data => ({
    chartData: widgetData(data),
    metadata: [ 1996, 2005, 2007],
  //  metadata: widgetMetadata(data),
    chartConfig: {
      layout: 'vertical',
      referenceLines: [
        { x: 0, label: null, stroke: 'rgba(0,0,0,0.5)' }
      ],
      height: 300,
      stackOffset: 'sign',
      margin: { top: 20, right: 0, left: 0, bottom: 20 },
      legend: {
        align: 'center',
        verticalAlign: 'top',
        layout: 'horizontal',
        height: 50,

        content: ({ payload }) => {
          const labels = payload.map(({ color, value }) => ({
            color,
            value: payload.legend || value
          }));
          return <WidgetLegend direction="vertical" groups={{ labels }} />;
        }
      },
      xAxis: {
        type: 'number',
        domain: getDomain(),
        interval: 0,
        tick: true,
      },
      yKeys: {
        lines: {
          net: {
            barSize: 10,
            fill: 'rgba(0,0,0,0.7)',
            radius: 4,
            legend: 'Net result',
          }
        },
        bars: {
          gain: {
            barSize: 10,
            fill: '#077FAC',
            radius: [0, 10, 10, 0],
            legend: 'Gain',
            stackId: 'stacked',
            label: {
              content: (prs) => {
                const w = 12;

                const { index, y } = prs;
                const { name } = data[index];

                return (
                  <g className={styles.activity_widget}>
                    <text className={styles.label} x={w / 2} y={y - 15} textAnchor="middle" fill="#000">
                      {name}
                    </text>
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
            legend: 'Loss',
            label: {
              content: (prs) => {
                const w = 12  ;

                const { index, y } = prs;
                const { loss, gain } = data[index];
                const net = loss + gain;

                const scale = scaleLinear()
                  .domain(getDomain(data))
                  .range([0, w]);

                const x = scale((net));

                return (
                  <g>
                    <rect x={x} y={y - 5} width={2} height={20} fill="#000" />
                  </g>
                );
              }
            }
          }
        },
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
            style={{
              color: '#FFFFFF',
              backgroundColor: '#383838'
            }}
            settings={[
              { key: 'name' },
              { key: 'gain', format: value => `Gain: ${numberFormat(value / 1000000)} km2` },
              { key: 'loss', format: value => `Loss: ${numberFormat(value / 1000000)} km2` },
              { key: 'net', format: value => `Net change: ${numberFormat(value / 1000000)} km2` }
            ]}
          />
        )
      }
    }
  })
};


export default CONFIG;
