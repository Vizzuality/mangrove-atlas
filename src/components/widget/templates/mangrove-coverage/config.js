import React from 'react';

// Utils
import { format } from 'd3-format';
// import { replace } from 'layer-manager';
import groupBy from 'lodash/groupBy';

// Components
import WidgetTooltip from 'components/widget/tooltip';

export const CONFIG = {
  parse: ({ rows }, params = null) => {
    if (!rows.length) {
      return {
        chart: [],
        template: ''
      };
    }

    const fakeData = [
      {
        label: 'Mangroves',
        percentage: 30,
        color: 'green'
      },
      {
        label: 'Non Mangroves',
        percentage: 100 - 30,
        color: 'gray'
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
      template: 'Im a sentence sent from backend!',
      config: {
        type: 'pie',
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
            const groups = groupBy(payload, p => p.payload.category);

            return (
              <div className="widget--legend">
                {Object.keys(groups).map(g => (
                  <div key={g} className="widget--legend-group">
                    <ul className="widget--legend-list">
                      {groups[g].map(item => (
                        <li
                          key={`item-${item.color}`}
                          className="widget--legend-list-item"
                        >
                          <svg height="12" width="12">
                            <rect width="13" height="13" fill={item.color} />
                          </svg>

                          <span>
                            {item.value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            );
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
                { key: 'percentage', format: value => `Percentage: ${format('.1%')(value/100)}` }
              ]}
            />
          )
        }
      }
    }
  }
}

export default CONFIG;
