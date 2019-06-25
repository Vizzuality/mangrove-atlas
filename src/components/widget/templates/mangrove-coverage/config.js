import React from 'react';
import { format } from 'd3-format';
import groupBy from 'lodash/groupBy';
import WidgetTooltip from 'components/widget/tooltip';
import WidgetLegend from 'components/widget/legend';

export const CONFIG = {
  parse: () => ({
    chart: [],
    chartConfig: {
      type: 'pie',
      layout: 'centric',
      height: 250,
      margin: { top: 20, right: 0, left: 0, bottom: 0 },
      xKey: 'percentage',
      yKeys: {
        pies: {
          y: {
            cx: '50%',
            cy: '50%',
            dataKey: 'percentage',
            nameKey: 'label',
            innerRadius: '60%',
            outerRadius: '80%'
          }
        }
      },
      legend: {
        align: 'left',
        verticalAlign: 'middle',
        layout: 'vertical',
        content: (properties) => {
          const { payload } = properties;
          const groups = groupBy(payload, p => p.payload.label);
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
              { key: 'label' },
              { key: 'percentage', format: value => `Percentage: ${format('.1%')(value / 100)}` }
            ]}
          />
        )
      }
    }
  })
};

export default CONFIG;
