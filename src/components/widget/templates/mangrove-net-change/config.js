import React from 'react';
import { format } from 'd3-format';
import WidgetLegend from 'components/widget/legend';
import WidgetTooltip from 'components/widget/tooltip';

const numberFormat = format(',.3r');

export const CONFIG = {
  parse: () => {
    const fakeData = [
      {
        label: '1996',
        year: 1996,
        gain: 122,
        netChange: 40,
        loss: -120
      },
      {
        label: '2002',
        year: 2002,
        gain: 155,
        netChange: 30,
        loss: -40
      },
      {
        label: '2009',
        year: 2009,
        gain: 194,
        netChange: 72,
        loss: -182
      },
      {
        label: '2016',
        year: 2016,
        gain: 135,
        netChange: 110,
        loss: -194
      }
    ];

    return {
      chart: fakeData.map(l => (
        {
          x: l.label,
          'Net change': l.netChange,
          Gain: l.gain,
          Loss: l.loss,
          color: l.color,
          name: l.label,
          year: l.year
        }
      )),
      chartConfig: {
        stackOffset: 'sign',
        margin: { top: 20, right: 0, left: 40, bottom: 0 },
        referenceLines: [
          { y: 0, label: null, stroke: 'rgba(0,0,0,0.85)' }
        ],
        xKey: 'year',
        yKeys: {
          lines: {
            'Net change': {
              stroke: 'rgba(0,0,0,0.7)'
            }
          },
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
                { key: 'Net change', format: value => `Net change: ${numberFormat(value / 1000000)} km2` }
              ]}
            />
          )
        }
      }
    };
  }
};


export default CONFIG;
