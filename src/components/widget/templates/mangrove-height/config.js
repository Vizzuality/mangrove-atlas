
import React from 'react';
import groupBy from 'lodash/groupBy';
import WidgetTooltip from 'components/widget/tooltip';
import WidgetLegend from 'components/widget/legend';

const CONFIG = {


  parse: data => ({
    // chartData: widgetData(data),
    metadata: [1996, 2007, 2008, 2009, 2010],
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
              { key: 'percentage', format: percentage => `Percentage: ${(percentage / 100)}` },
              { key: 'coverage', format: coverage => `Coverage: ${(coverage)}km` }
            ]}
          />
        )
      }
    }
  })
};

export default CONFIG;
