
import React from 'react';

// utils
import groupBy from 'lodash/groupBy';

// components
import WidgetTooltip from 'components/widget-tooltip';
import SpeciesLegend from './species-legend';

import { RED_LIST_CATEGORIES, COLORS } from './constants';

const getData = (data) => {
  const { categories, total, species } = data;
  const speciesByGroup = groupBy(species, s => s.red_list_cat)

  if (!categories || Object.keys(categories).length === 0) return null;
  return Object.entries(categories).map((item) => ({
    value: item[1],
    color: COLORS[item[0]],
    percentage: item[1] / total * 100,
    label: `${RED_LIST_CATEGORIES[item[0]]}`,
    species: speciesByGroup[item[0]].sort()
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
          verticalAlign: 'top',
          layout: 'vertical',
          fontSize: 9,
          content: (properties) => {
            const { payload } = properties;
            if (!Object.keys(payload)) return null;
            const groups = groupBy(payload, p => p.value);
            return <SpeciesLegend groups={groups} />;
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
                    description: `Number of species: ${payload[0]?.payload.value}`,
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
