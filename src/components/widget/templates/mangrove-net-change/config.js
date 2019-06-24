import React from 'react';
// Utils
// import { format } from 'd3-format';
// import { replace } from 'layer-manager';
import groupBy from 'lodash/groupBy';

// Components
// import WidgetTooltip from 'components/widget/tooltip';
import WidgetLegend from 'components/widget/legend';

export const CONFIG = {
  parse: ({ rows }) => {
    if (!rows.length) {
      return {
        chart: [],
        template: ''
      };
    }

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
          name: l.label
        }
      )),
      chartConfig: {
        stackOffset: 'sign',
        margin: { top: 20, right: 0, left: 0, bottom: 0 },
        referenceLines: [
          { y: 0, label: null, stroke: 'rgba(0,0,0,0.85)' }
        ],
        xKey: 'x',
        yKeys: {
          lines: {
            median: {
              stroke: 'rgba(0,0,0,0.7)'
            }
          },
          bars: {
            gain: {
              barSize: 10,
              transform: `translate(${(4 + 10) / 2}, 0)`,
              fill: '#077FAC',
              radius: [10, 10, 0, 0]
            },
            loss: {
              barSize: 10,
              transform: `translate(-${(4 + 10) / 2}, 0)`,
              fill: '#EB6240',
              radius: [10, 10, 0, 0]
            }
          }
        },
        xAxis: {
          tick: { fontSize: 12, fill: '#AAA' }
        },
        yAxis: {
          domain: [-300, 300]
        },
        cartesianGrid: {
          vertical: false,
          strokeDasharray: '6 6'
        },
        legend: {
          align: 'top',
          verticalAlign: 'top',
          layout: 'horizontal',
          height: 50,
          content: (properties) => {
            const { payload } = properties;
            const groups = groupBy(payload, p => p.payload.category);
            return <WidgetLegend direction="vertical" groups={groups} />;
          }
        },
        // tooltip: {
        //   cursor: false,
        //   content: (
        //     <WidgetTooltip
        //       style={{
        //         color: '#FFFFFF',
        //         backgroundColor: '#383838'
        //       }}
        //       settings={[
        //         { key: 'x' },
        //         { key: 'y', format: value => `${format('.2r')(value)}` }
        //       ]}
        //     />
        //   )
        // }
      }
    };
  }
};


export default CONFIG;
