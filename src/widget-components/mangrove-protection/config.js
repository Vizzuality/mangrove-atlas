
import React from 'react';

// utils
import { format } from 'd3-format';

// components
import WidgetTooltip from 'components/widget-tooltip';

const numberFormat = format(',.2f');

const getData = (data) => {

  if (!data) return [];
  return ([{
    color: '#06C4BD',
    percentage: data.data.percentage,
    year: data.data.year,
  },
  {
    color: '#ECECEF',
    percentage: 100 - data.data.percentage,
    year: 0,
  }]);
};

export const CONFIG = {
  parse: (data, yearSelected = 2016) => {
    // const dataFiltered = filterData(data, yearSelected);
    // const chartData = dataFiltered.length ? getData(dataFiltered) : '';
    const chartData = getData(data);
    return {
      chartData,
      // totalValues: dataFiltered[0],
      chartConfig: {
        type: 'pie',
        layout: 'centric',
        margin: { top: 20, right: 0, left: 0, bottom: 0 },
        xKey: 'percentage',
        yKeys: {
          pies: {
            coverage: {
              cx: '50%',
              cy: '50%',
              paddingAngle: 2,
              dataKey: 'percentage',
              nameKey: 'label',
              innerRadius: '55%',
              outerRadius: '80%',
              isAnimationActive: false,
              customLabel: ({ viewBox }) => {
                const { cx, cy } = viewBox;
                return (
                  <g>
                    <text x={cx} y={cy} className="recharts-text recharts-label-large" textAnchor="middle" dominantBaseline="central">
                      <tspan alignmentBaseline="middle" fill="rgba(0,0,0,0.85)" fontSize="26">{data.data.percentage}%</tspan>
                    </text>
                  </g>
                );
              }
            }
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
                }}
                payload={payload}
                settings={[
                  { label: 'Percentage', key: 'percentage', format: value => `${numberFormat(value)} %`, position: '_column' },
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
