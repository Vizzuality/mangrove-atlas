import React from 'react';

// Utils
import { format } from 'd3-format';
// import { replace } from 'layer-manager';
import groupBy from 'lodash/groupBy';

// Components
import WidgetTooltip from 'components/widget/tooltip';
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
        label: 'Mangroves',
        value: 1388272.6370640127,
        percentage: 30,
        year: 1996,
        color: '#BED246'
      },
      {
        label: 'Non Mangroves',
        percentage: 100 - 30,
        color: '#ECECEF'
      }
    ];

    return {
      chart: fakeData.map(l => (
        {
          x: l.label,
          color: l.color,
          percentage: l.percentage,
          unit: '%',
          y: 100
        }
      )),
      chartConfig: {
        type: 'pie',
        layout: 'centric',
        height: 250,
        margin: { top: 20, right: 0, left: 0, bottom: 0 },
        xKey: 'percentage',
        yKeys: {
          pies: {
            y: {
              cx: '40%',
              cy: '50%',
              dataKey: 'percentage',
              nameKey: 'x',
              innerRadius: '60%',
              outerRadius: '80%',
            }
          }
        },
        legend: {
          align: 'left',
          verticalAlign: 'middle',
          layout: 'vertical',
          content: (properties) => {
            const { payload } = properties;
            const groups = groupBy(payload, p => p.payload.category);
            return <WidgetLegend groups={groups} />;
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
                { key: 'x' },
                { key: 'percentage', format: value => `Percentage: ${format('.1%')(value / 100)}` }
              ]}
            />
          )
        }
      }
    };
  }
};

export default CONFIG;
