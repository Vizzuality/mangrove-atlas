import React from 'react';
// Utils
// import { format } from 'd3-format';
// import { replace } from 'layer-manager';
import groupBy from 'lodash/groupBy';

// Components
// import WidgetTooltip from 'components/widget/tooltip';
import WidgetLegend from 'components/widget/legend';

export const CONFIG = {
  parse: () => {
    const fakeData = [
      {
        label: '1996',
        gain: 122,
        median: 40,
        loss: -120
      },
      {
        label: '2002',
        gain: 155,
        median: 30,
        loss: -40
      },
      {
        label: '2009',
        gain: 194,
        median: 72,
        loss: -182
      },
      {
        label: '2016',
        gain: 135,
        median: 110,
        loss: -194
      }
    ];

    return {
      chart: fakeData.map(l => (
        {
          x: l.label,
          median: l.median,
          gain: l.gain,
          loss: l.loss,
          color: l.color,
          name: l.label,
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
    };
  }
};


export default CONFIG;
