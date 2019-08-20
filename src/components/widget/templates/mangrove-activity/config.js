import React from 'react';
import moment from 'moment';
import orderBy from 'lodash/orderBy';

// Utils
// import { format } from 'd3-format';
// import { replace } from 'layer-manager';
import groupBy from 'lodash/groupBy';

// Components
// import WidgetTooltip from 'components/widget/tooltip';
import WidgetLegend from 'components/widget/legend';

const widgetData = ({ list, metadata }) => {
  const data = list.map(l => (
    {
      label: JSON.stringify(moment(l.date).year()),
      year: moment(l.date).year(),
      gain: l.gain_m2,
      median: l.gain_m2 - l.loss_m2,
      loss: -l.loss_m2
    })).filter(l => l.netChange !== 0);
  return orderBy(data, l => l.year);
};
const fakeData = {
  gainRanking: [
    {
      name: 'country',
      label: '1996',
      gain: 12,
      median: 40,
      loss: -120
    },
    {
      name: 'country',
      label: '2002',
      gain: 15,
      median: 30,
      loss: -40
    },
    {
      name: 'country',
      label: '2009',
      gain: 19,
      median: 72,
      loss: -182
    },
    {
      name: 'country',
      label: '2016',
      gain: 13,
      median: 110,
      loss: -194
    }
  ],
  lossRanking: [
    {
      name: 'country',
      label: '1996',
      gain: 122,
      median: 40,
      loss: -12
    },
    {
      name: 'country',
      label: '2002',
      gain: 155,
      median: 30,
      loss: -4
    },
    {
      name: 'country',
      label: '2009',
      gain: 194,
      median: 72,
      loss: -18
    },
    {
      name: 'country',
      label: '2016',
      gain: 135,
      median: 110,
      loss: -19
    }
  ],
  netRanking: [
    {
      name: 'country',
      label: '1996',
      gain: 122,
      median: 40,
      loss: -120
    },
    {
      name: 'country',
      label: '2002',
      gain: 155,
      median: 30,
      loss: -40
    },
    {
      name: 'country',
      label: '2009',
      gain: 194,
      median: 72,
      loss: -182
    },
    {
      name: 'country',
      label: '2016',
      gain: 135,
      median: 110,
      loss: -194
    }
  ]
};


export const CONFIG = {
  parse: data => ({
    fakeData,
    chartData: widgetData(data).map(l => (
      {
        label: l.label,
        median: l.median,
        gain: l.gain,
        loss: l.loss,
        color: l.color,
        name: l.label
      }
    )),
    chartConfig: {
      layout: 'vertical',
      referenceLines: [
        { x: 0, label: null, stroke: 'rgba(0,0,0,0.5)' }
      ],
      margin: { top: 20, right: 0, left: 0, bottom: 20 },
      yKeys: {
        bars: {
          gain: {
            barSize: 10,
            transform: `translate(0, ${10 / 2})`,
            fill: '#077FAC',
            radius: [0, 10, 10, 0],
          },
          loss: {
            barSize: 10,
            transform: `translate(0, -${10 / 2})`,
            fill: '#EB6240',
            radius: [0, 10, 10, 0],
          },
          'Net result': {
            barSize: 5,
            transform: `translate(0, -${5 / 2})`,
            fill: 'rgba(0,0,0,0.7);',
            radius: [10, 0, 0, 10],
          }
        }
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
        tick: false,
      },
      cartesianGrid: {
        vertical: true,
        horizontal: false,
        verticalPoints: [0, 100, 200, 300, 400, 500],
        strokeDasharray: '5 20'
      }
    }
  })
};


export default CONFIG;
