import React from 'react';
import moment from 'moment';
import orderBy from 'lodash/orderBy';

// Utils
import { format } from 'd3-format';
// import { replace } from 'layer-manager';
import groupBy from 'lodash/groupBy';

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
      name: 'country',
      label: '1996',
      gain: 13,
      net: 40,
      loss: -120
    },
    {
      name: 'country',
      label: '2002',
      gain: 15,
      net: 30,
      loss: -40
    },
    {
      name: 'country',
      label: '2009',
      gain: 19,
      net: 72,
      loss: -18
    },
    {
      x: 3,
      name: 'country',
      label: '2016',
      gain: 20,
      net: 110,
      loss: -194
    }
  ],
  loss: [
    {
      name: 'country',
      label: '1996',
      gain: 122,
      net: 40,
      loss: -12
    },
    {
      name: 'country',
      label: '2002',
      gain: 155,
      net: 30,
      loss: -4
    },
    {
      name: 'country',
      label: '2009',
      gain: 194,
      net: 72,
      loss: -18
    },
    {
      name: 'country',
      label: '2016',
      gain: 135,
      net: 110,
      loss: -19
    }
  ],
  net: [
    {
      name: 'country',
      label: '1996',
      gain: 122,
      net: 40,
      loss: -120
    },
    {
      name: 'country',
      label: '2002',
      gain: 155,
      net: 30,
      loss: -40
    },
    {
      name: 'country',
      label: '2015',
      gain: 194,
      net: 72,
      loss: -182
    },
    {
      name: 'country',
      label: '2016',
      gain: 135,
      net: 110,
      loss: -194
    }
  ]
};

const widgetMetadata = ({ metadata: { location_coast_length_m } }) => Number(location_coast_length_m / 1000000).toFixed(2);

// const widgetMetadata = (fakeData) => {

//   const years = Object.keys(fakeData).reduce(function (acc, key) {
//     return acc.push(fakeData[key].label);
// }, []);

// console.log(years)
//   // years: fakeData.filter(l => (l.gain_m2 !== null && l.loss_m2 !== null)).map(l => (
//   //   moment(l.date).year()
//   // )).sort((a, b) => a - b)
// };


export const CONFIG = {
  parse: data => ({
    fakeData,
    metadata: widgetMetadata(data),
    // metadata: widgetMetadata(fakeData),
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
      margin: { top: 20, right: 0, left: 0, bottom: 20 },
      yKeys: {
        lines: {
          net: {
            fill: 'rgba(0, 0, 0, 0.7)',
            strokeWidth: 10,
            isAnimationActive: false,
            dot: {
              stroke: 'rgba(0, 0, 0, 0.7)',
              strokeWidth: 5,
              strokeHeight: 10,
              fill: 'red'
            },
          }
        },
        bars: {
          gain: {
            barSize: 10,
            transform: `translate(0, ${10 / 2})`,
            fill: '#077FAC',
            radius: [0, 10, 10, 0],
            legend: 'Gain'
          },
          loss: {
            barSize: 10,
            transform: `translate(0, -${10 / 2})`,
            fill: '#EB6240',
            radius: [0, 10, 10, 0],
            legend: 'Loss'
          }
        },
      },
      legend: {
        align: 'center',
        verticalAlign: 'top',
        layout: 'horizontal',
        height: 50,
        content: (properties) => {
          const { payload } = properties;
          const groups = groupBy(payload, p => p.payload.category);
          return <WidgetLegend direction="vertical" groups={groups} />;
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
