import React from 'react';
import { format } from 'd3-format';
import groupBy from 'lodash/groupBy';
import WidgetTooltip from 'components/widget/tooltip';
import WidgetLegend from 'components/widget/legend';

const numberFormat = format(',.2%');

const widgetData = (data, currentLocation) => {
  const total = currentLocation.coast_length_m;

  return data.map((d) => {
    const year = new Date(d.date).getFullYear();

    return ({
      x: Number(year),
      y: 100,
      color: '#00857F',
      percentage: d.value / total * 100,
      unit: '%',
      value: d.value,
      label: `Mangroves in ${year}`
    });
  });
};

export const CONFIG = {
  parse: (data, currentLocation) => ({
    // data: widgetData(data, currentLocation),
    data: () => console.log(data) || data.list,
    // metadata: {
    //   years: data.map(d => new Date(d.date).getFullYear()),
    //   total: currentLocation.coast_length_m
    // },
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
              { key: 'percentage', format: value => `Percentage: ${numberFormat(value / 100)}` }
            ]}
          />
        )
      }
    }
  })
};

export default CONFIG;
