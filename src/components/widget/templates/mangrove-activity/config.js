import React from 'react';

// Utils
import { format } from 'd3-format';
import moment from 'moment';

// Components
import WidgetTooltip from 'components/widget/tooltip';
import WidgetLegend from 'components/widget/legend';

const numberFormat = format(',.2f');

function processData(data) {
  return {
    gain: data.map(d => d.gain_m2).reduce((previous, current) => current += previous),
    loss: -data.map(d => d.loss_m2).reduce((previous, current) => current += previous),
    net: data.map(d => d.net_change_m2).reduce((previous, current) => current += previous)
  };
}
const widgetData = data => data.map(location => ({
  name: location.name,
  iso: location.iso,
  ...processData(location.mangrove_datum)
}));

const widgetMeta = data => data.dates.map(d => moment(d.date).year()).sort((a, b) => a - b);

export const CONFIG = {
  parse: data => ({
    chartData: widgetData(data.data),
    metaData: widgetMeta(data.meta),
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
          console.log(payload.legend, payload.value)
          const labels = payload.map(({ color, value }) => ({
            color,
            value: payload.legend || value
          }));
          return <WidgetLegend direction="vertical" groups={{ labels }} />;
        }


      },
      xAxis: {
        type: 'number',
        tick: true,
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
              { label: 'Gain', color: '#077FAC', key: 'gain', format: value => `${numberFormat(value / 1000000)}km²` },
              { label: 'Loss', color: '#A6CB10', key: 'loss', format: value => `${numberFormat(Math.abs(value / 1000000))}km²` },
              { label: 'Net result', color: 'rgba(0,0,0,0.7)', key: 'net', format: value => `${numberFormat(value / 1000000)}km²` }
            ]}
            label={{ key: 'name'}}
            payload={[
              //{ key: 'name' },
               { name: 'Gain', format: value => `${numberFormat(value / 1000000)}`, unit: 'km²' },
               { name: 'Loss', format: value => `${numberFormat(value / 1000000)}`, unit: 'km²' },
               { name: 'Net result', format: value => `${numberFormat(value / 1000000)}`, unit: 'km²' },
             ]}
          />
        )
      }
    }
  })
};


export default CONFIG;
