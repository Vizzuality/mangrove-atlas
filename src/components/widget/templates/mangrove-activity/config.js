import React from 'react';
import moment from 'moment';
import orderBy from 'lodash/orderBy';

// Utils
import { format } from 'd3-format';

// Components
import WidgetTooltip from 'components/widget/tooltip';
import WidgetLegend from 'components/widget/legend';

const numberFormat = format(',.2f');

const widgetData = ({ list }) => {
  const data = list.map(l => (
    {
      label: JSON.stringify(moment(l.date).year()),
      year: moment(l.date).year(),
      gain: l.gain_m2,
      net: l.gain_m2 - l.loss_m2,
      loss: -l.loss_m2
    })).filter(l => l.netChange !== 0);
  return orderBy(data, l => l.year);
};
const fakeData = {
  gain: [
    {
      name: 'place 1',
      label: '1996',
      gain: 13,
      loss: -120
    },
    {
      name: 'place 2',
      label: '2002',
      gain: 15,
      loss: -40
    },
    {
      name: 'place 3',
      label: '2009',
      gain: 19,
      loss: -18
    },
    {
      x: 3,
      name: 'place 4',
      label: '2016',
      gain: 20,
      net: 110,
      loss: -194
    }
  ],
  loss: [
    {
      name: 'place',
      label: '1996',
      gain: 122,
      net: 40,
      loss: -12
    },
    {
      name: 'place',
      label: '2002',
      gain: 155,
      net: 30,
      loss: -4
    },
    {
      name: 'place',
      label: '2009',
      gain: 194,
      net: 72,
      loss: -18
    },
    {
      name: 'place',
      label: '2016',
      gain: 135,
      net: 110,
      loss: -19
    }
  ],
  net: [
    {
      name: 'place',
      label: '1996',
      gain: 122,
      net: 40,
      loss: -120
    },
    {
      name: 'place',
      label: '2002',
      gain: 155,
      net: 30,
      loss: -40
    },
    {
      name: 'place',
      label: '2015',
      gain: 194,
      net: 72,
      loss: -182
    },
    {
      name: 'place',
      label: '2016',
      gain: 135,
      net: 110,
      loss: -194
    }
  ]
};

const widgetMetadata = ({ metadata }) => {
  if (metadata) {
    const { location_coast_length_m = 0 } = metadata;
    return Number(location_coast_length_m / 1000000).toFixed(2);
  }
};

export const CONFIG = {
  parse: data => ({
    fakeData,
    metadata: widgetMetadata(data),
    chartData: widgetData(data).map(l => (
      {
        label: l.label,
        net: l.net,
        gain: l.gain,
        loss: l.loss,
        color: l.color,
        name: l.name
      }
    )),
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
