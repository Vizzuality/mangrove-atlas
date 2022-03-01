
import React from 'react';

// utils
import groupBy from 'lodash/groupBy';
import { format } from 'd3-format';

// components
import WidgetTooltip from 'components/widget-tooltip';
import WidgetLegend from 'components/widget-legend';

const numberFormat = format(',.2f');

const getData = (data) => {

  if (!data) return [];
  const protectedMangroves = data.protected_area;
  const nonProtected = data.total_area;
  const protectedPercentage = (data.protected_area * 100) / data.total_area;
  const nonProtectedPercentage = 100 - protectedPercentage;

  return ([
    {
      color: '#06C4BD',
      percentage: protectedPercentage,
      total: data.total,
      year: data.year,
      protection: protectedMangroves,
      // unit: chartData.unit,
    },
    {
      color: '#ECECEF',
      percentage: nonProtectedPercentage,
      protection: nonProtected,
      // unit: chartData.unit,
    }])
};

export const CONFIG = {
  parse: (data, unit) => {
    const chartData = getData(data);
    const protectedPercentage = data.protected_area * 100 / data.total_area;

    return {
      chartData,
      chartConfig: {
        type: 'pie',
        layout: 'center',
        margin: { top: 20, right: 0, left: 0, bottom: 0 },
        xKey: 'percentage',
        yKeys: {
          pies: {
            protection: {
              cx: '65%',
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
                      <tspan alignmentBaseline="middle" fill="rgba(0,0,0,0.85)" fontSize="26">{numberFormat(protectedPercentage)}%</tspan>
                    </text>
                  </g>
                );
              }
            }
          }
        },
        legend: {
          align: 'left',
          verticalAlign: 'middle',
          layout: 'vertical',
          fontSize: 9,
          content: (properties) => {
            console.log({ properties })
            const { payload } = properties;
            const groups = groupBy(payload, p => p.value);
            return (
              <>
                <WidgetLegend widgetSpecific="restoration" title="" groups={groups} />
              </>
            )
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
                  { label: 'Area:', key: 'protection', format: value => `${numberFormat(value)} ${unit}`, position: '_column' },
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
