
import React from 'react';

// utils
import { format } from 'd3-format';

// components
import WidgetTooltip from 'components/widget-tooltip';

const numberFormat = format(',.2f');

const getData = (data) => {

  if (!data) return [];

  const chartData = data.data[0];
  const protectedMangroves = (chartData.percentage * chartData.total) / 100;
  const nonProtected = chartData.total - protectedMangroves;

  return ([
    {
    color: '#06C4BD',
    percentage: chartData.percentage,
    total:  chartData.total,
    year: chartData.year,
    protection: protectedMangroves,
    unit: chartData.unit,
  },
  {
    color: '#ECECEF',
    percentage: 100 - chartData.percentage,
    protection: nonProtected,
    unit: chartData.unit,
  }])
};

export const CONFIG = {
  parse: (data) => {
    const chartData = getData(data);
    return {
      chartData,
      chartConfig: {
        type: 'pie',
        layout: 'centric',
        margin: { top: 20, right: 0, left: 0, bottom: 0 },
        xKey: 'percentage',
        yKeys: {
          pies: {
            protection: {
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
                      <tspan alignmentBaseline="middle" fill="rgba(0,0,0,0.85)" fontSize="26">{data.data[0].percentage}%</tspan>
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
                  { label: 'Percentage:', key: 'percentage', format: value => `${numberFormat(value)} %`, position: '_column' },
                  { label: 'Area:', key: 'protection', format: value => `${numberFormat(value)} ha`, position: '_column' },
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
