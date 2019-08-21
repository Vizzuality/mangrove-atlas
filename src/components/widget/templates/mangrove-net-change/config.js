import React from 'react';
import { format } from 'd3-format';
import WidgetLegend from 'components/widget/legend';
import WidgetTooltip from 'components/widget/tooltip';
import moment from 'moment';
import orderBy from 'lodash/orderBy';


const numberFormat = format(',.2f');

const widgetData = ({ list }) => {
  const data = list.map(l => (
    {
      label: JSON.stringify(moment(l.date).year()),
      year: moment(l.date).year(),
      gain: l.gain_m2,
      netChange: l.gain_m2 - l.loss_m2,
      loss: -l.loss_m2
    })).filter(l => l.netChange !== 0);
  return orderBy(data, l => l.year);
};

const widgetMetadata = ({ list }) => ({
  years: list.filter(l => (l.gain_m2 !== null && l.loss_m2 !== null)).map(l => (
    moment(l.date).year()
  )).sort((a, b) => a - b)
});

const CONFIG = {
  parse: data => ({
    chartData: widgetData(data).map(l => (
      {
        x: l.label,
        netChange: l.netChange,
        gain: l.gain,
        loss: l.loss,
        name: l.label,
        year: l.year
      })),
    metadata: widgetMetadata(data),
    chartConfig: {
      stackOffset: 'sign',
      margin: { top: 20, right: 0, left: 40, bottom: 0 },
      referenceLines: [
        { y: 0, label: null, stroke: 'rgba(0,0,0,0.85)' }
      ],
      xKey: 'year',
      yKeys: {
        lines: {
          netChange: {
            stroke: 'rgba(0,0,0,0.7)',
            legend: 'Net Change'
          }
        },
        bars: {
          gain: {
            barSize: 10,
            transform: `translate(${(4 + 10) / 2}, 0)`,
            fill: '#077FAC',
            radius: [10, 10, 0, 0],
            legend: 'Gain'
          },
          loss: {
            barSize: 10,
            transform: `translate(-${(4 + 10) / 2}, 0)`,
            fill: '#EB6240',
            radius: [10, 10, 0, 0],
            legend: 'Loss'
          }
        }
      },
      xAxis: {
        tick: { fontSize: 12, fill: '#AAA' }
      },
      yAxis: {
        tick: { fontSize: 12, fill: '#AAA' },
        tickFormatter: (v) => {
          const result = v / 1000000;
          return numberFormat(result);
        },
        tickMargin: 15,
        domain: [-300, 300]
      },
      cartesianGrid: {
        vertical: false,
        strokeDasharray: '6 6'
      },
      legend: {
        align: 'center',
        verticalAlign: 'top',
        layout: 'horizontal',
        height: 50,
        content: ({ payload }) => {
          const labels = payload.map(({color, value, payload}) => ({
            color,
            value: payload.legend || value
          }));

          return <WidgetLegend direction="vertical" groups={{labels}} />;
        }
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
              { key: 'year' },
              { key: 'gain', format: value => `Gain: ${numberFormat(value / 1000000)} km2` },
              { key: 'loss', format: value => `Loss: ${numberFormat(value / 1000000)} km2` },
              { key: 'netChange', format: value => `Net change: ${numberFormat(value / 1000000)} km2` }
            ]}
          />
        )
      }
    }
  })
};

export default CONFIG;
