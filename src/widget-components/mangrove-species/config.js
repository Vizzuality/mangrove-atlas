
import React from 'react';

// utils
import groupBy from 'lodash/groupBy';

// components
import WidgetTooltip from 'components/widget-tooltip';
import WidgetLegend from 'components/widget-legend';

import { RED_LIST_CATEGORIES } from './constants';

const COLORS = ['#F9737C', '#7C7C7C', '#F9443E', '#FEA740', '#FCC862', '#ECECEF',];

const getData = (data) => {
  const { list } = data;
  const { categories, total } = list;

  if (!categories || Object.keys(categories).length === 0) return null;
  return Object.entries(categories).map((item, index) => ({
    value: item[1],
    color: COLORS[index],
    percentage: item[1] / total * 100,
    label: `${RED_LIST_CATEGORIES[item[0]]}`
  }));
};

export const CONFIG = {
  parse: (data) => {
    return {
      chartData: getData(data),

      chartConfig: {
        type: 'pie',
        layout: 'centric',
        margin: { top: 20, right: 0, left: 0, bottom: 0 },
        xKey: 'percentage',
        yKeys: {
          pies: {
            y: {
              cx: '60%',
              cy: '50%',
              paddingAngle: 2,
              dataKey: 'percentage',
              nameKey: 'label',
              innerRadius: '55%',
              outerRadius: '85%',
              isAnimationActive: false,
            }
          }
        },
        legend: {
          align: 'left',
          verticalAlign: 'middle',
          layout: 'vertical',
          fontSize: 9,
          content: (properties) => {
            const { payload } = properties;
            const groups = groupBy(payload, p => p.value);
            return <WidgetLegend widgetSpecific="species" groups={groups} />;
          }
        },
        tooltip: {
          cursor: false,
          content: ((properties) => {
            const { payload } = properties;
            if (!payload.length) return null;
            return (
              <WidgetTooltip
                style={{
                  flexDirection: 'column',
                  marginTop: '10px',
                  marginLeft: '-50px'
                }}
                payload={payload}
                settings={[
                  {
                    key: 'label',
                    color: 'color',
                    description: `Number of species: ${payload[0]?.payload.value}`, //'Camptostemon philippinense Heritiera globosa (endemic)',
                    position: '_row',
                    type: 'species',
                  },
                ]}
              />
            );
          })
        }
      }
    };
  }
};

export default CONFIG;
