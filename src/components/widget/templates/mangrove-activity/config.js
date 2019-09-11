import React from 'react';

// Utils
import { format } from 'd3-format';

// Components
import WidgetTooltip from 'components/widget/tooltip';
import WidgetLegend from 'components/widget/legend';

const numberFormat = format(',.2f');

function processData(data) {
  return {
    gain: data[0].gain_m2,
    loss: - data[0].loss_m2,
    net: data[0].net_change_m2
  }
}
const widgetData = data => data.map(location => ({
    name: location.name,
    ...processData(location.mangrove_datum)
}));

export const CONFIG = {
  parse: data => ({
    chartData: widgetData(data),
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
