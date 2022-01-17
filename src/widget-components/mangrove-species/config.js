
import React from 'react';

// utils
import groupBy from 'lodash/groupBy';
import { format } from 'd3-format';

// components
import WidgetTooltip from 'components/widget-tooltip';
import WidgetLegend from 'components/widget-legend';

import { RED_LIST_CATEGORIES } from './constants';

const COLORS = ['#F9737C', '#7C7C7C', '#F9443E', '#FEA740', '#FCC862', '#FCC862'];

const getData = (data) => {
  const { list } = data;
  const total = 100;
  const { categories } = list;
  if (!categories || Object.keys(categories).length === 0) return null;
  return Object.entries(categories).map((item, index) => ({
    value: item[1],
    color: COLORS[index],
    percentage: 5 / total * 100,
    label: `${RED_LIST_CATEGORIES[item[0]]}`
  }));
};

// const filterData = ({ list }, yearSelected) => sortBy(
//   list
//     .filter(d => d.toc_hist_tco2eha
//       && d.soc_tco2e
//       && d.toc_tco2e
//       && d.bgb_tco2e
//       && d.agb_tco2e
//       && d.date.includes(yearSelected)),
//   ['date']
// ).map((i) => {
//   return {
//     histogram: i.toc_hist_tco2eha,
//     soils: numberFormat(i.soc_tco2e / 1000000),
//     totalBiomass: numberFormat(i.toc_tco2e / 1000000),
//     totalRing: removeDecimals(i.toc_tco2e / 1000000),
//     biomass: numberFormat(i.bgb_tco2e / 1000000),
//     avobeGround: numberFormat(i.agb_tco2e / 1000000)
//   };
// });

export const CONFIG = {
  parse: (data, yearSelected = 2016) => {
    console.log('--->  DATA', getData(data))
    return {
      chartData: getData(data),
      coverage: null,
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
                    description: 'Camptostemon philippinense Heritiera globosa(endemic)',
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
