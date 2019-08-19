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
        'Net change': l.netChange,
        Gain: l.gain,
        Loss: l.loss,
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
        // lines: {
        //   'Net result': {
        //     stroke: 'rgba(0,0,0,0.7)'
        //   }
        // },
        bars: {
          Gain: {
            barSize: 10,
            transform: `translate(${(4 + 10) / 2}, 0)`,
            fill: '#077FAC',
            radius: [10, 10, 0, 0]
          },
          Loss: {
            barSize: 10,
            transform: `translate(-${(4 + 10) / 2}, 0)`,
            fill: '#EB6240',
            radius: [10, 10, 0, 0]
          },
          'Net result': {
            barSize: 10,
            transform: `translate(-${(4 + 10) / 2}, 0)`,
            fill: 'rgba(0, 0, 0, 0.7)',
            radius: [10, 10, 0, 0]
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
        content: (properties) => {
          const { payload } = properties;
          const groups = { groups: payload };
          return <WidgetLegend direction="vertical" groups={groups} />;
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
              { key: 'Gain', format: value => `Gain: ${numberFormat(value / 1000000)} km2` },
              { key: 'Loss', format: value => `Loss: ${numberFormat(value / 1000000)} km2` },
              { key: 'Net result', format: value => `Net change: ${numberFormat(value / 1000000)} km2` }
            ]}
          />
        )
      }
    }
  })
};

export default CONFIG;
