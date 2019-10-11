import React from 'react';
import { format } from 'd3-format';
import WidgetLegend from 'components/widget-legend';
import WidgetTooltip from 'components/widget-tooltip';
import moment from 'moment';
import orderBy from 'lodash/orderBy';

export const numberFormat = format(',.2f');

const widgetData = ({ list }) => {
  const data = list.map(l => (
    {
      label: JSON.stringify(moment(l.date).year()),
      year: moment(l.date).year(),
      gain: l.gain_m2,
      netChange: l.net_change_m2,
      loss: -l.loss_m2
    })).filter(l => l.netChange !== 0);
  return orderBy(data, l => l.year);
};

const widgetMetadata = ({ list }) => ({
  years: Array.from(
    new Set(
      list
        .filter(l => (l.gain_m2 !== null && l.loss_m2 !== null))
        .map(l => (moment(l.date).year()))
        .sort((a, b) => a - b)
    )
  )
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
      height: 360,
      margin: { top: 20, right: 15, left: 0, bottom: 20 },
      referenceLines: [
        { y: 0, label: null, stroke: 'rgba(0,0,0,0.85)' }
      ],
      xKey: 'year',
      yKeys: {
        lines: {
          netChange: {
            stroke: 'rgba(0,0,0,0.7)',
            legend: 'Net',
            isAnimationActive: false
          }
        },
        bars: {
          gain: {
            barSize: 10,
            transform: `translate(${(4 + 10) / 2}, 0)`,
            fill: '#A6CB10',
            radius: [10, 10, 0, 0],
            legend: 'Gain',
            isAnimationActive: false
          },
          loss: {
            barSize: 10,
            transform: `translate(-${(4 + 10) / 2}, 0)`,
            fill: '#EB6240',
            radius: [10, 10, 0, 0],
            legend: 'Loss',
            isAnimationActive: false
          }
        }
      },
      xAxis: {
        tick: { fontSize: 12, fill: 'rgba(0, 0, 0, 0.54)' }
      },
      yAxis: {
        tick: { fontSize: 12, fill: 'rgba(0, 0, 0, 0.54)' },
        tickFormatter: (v) => {
          const result = v / 1000000;
          return numberFormat(result);
        },
        tickMargin: 15,
        orientation: 'right',
        label: {
          value: 'km²',
          position: 'top',
          offset: 35
        }
      },
      cartesianGrid: {
        vertical: false,
        strokeDasharray: '5 20'
      },
      legend: {
        align: 'left',
        verticalAlign: 'top',
        layout: 'horizontal',
        height: 50,
        // eslint-disable-next-line react/prop-types
        content: ({ payload }) => {
          const labels = payload.map(({ color, value, payload: labelPayload }) => ({
            color,
            value: labelPayload.legend || value,
            variant: (labelPayload.dataKey === 'netChange') ? 'bar' : 'rect'
          }));
          return <WidgetLegend direction="vertical" groups={{ labels }} />;
        }
      },
      tooltip: {
        cursor: false,
        content: (
          <WidgetTooltip
            type="column"
            style={{
              color: 'black',
              backgroundColor: 'white',
              display: 'flex',
              justifyContent: 'space-around',
              marginLeft: '30px'
            }}
            payload={[
              { label: 'Gain', color: '#A6CB10', key: 'gain', format: value => `${numberFormat(value / 1000000)} km²` },
              { label: 'Loss', color: '#EB6240', key: 'loss', format: value => `${numberFormat(Math.abs(value / 1000000))} km²` },
              { label: 'Net', color: 'rgba(0,0,0,0.7)', key: 'netChange', format: value => `${numberFormat(value / 1000000)} km²` }
            ]}
            settings={[
              { label: 'Gain', color: '#A6CB10', key: 'gain', format: value => `${numberFormat(value / 1000000)} km²` },
              { label: 'Loss', color: '#EB6240', key: 'loss', format: value => `${numberFormat(Math.abs(value / 1000000))} km²` },
              {
                label: 'Net result',
                color: 'rgba(0,0,0,0.7)',
                key: 'netChange',
                format: value => `${numberFormat(value / 1000000)} km²`,
                bulletType: 'bar'
              }
            ]}
          />
        )
      }
    }
  })
};

export default CONFIG;
