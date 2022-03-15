
import React from 'react';

// utils
import groupBy from 'lodash/groupBy';
import { format } from 'd3-format';

// components
import WidgetTooltip from 'components/widget-tooltip';
import WidgetLegend from 'components/widget-legend';

const numberFormat = format(',.2f');

const getChartRingData = (data) => {
  if (!data) return [];
  const protectedMangroves = data.protected_area;
  const nonProtected = data.total_area;
  const protectedPercentage = (data.protected_area * 100) / data.total_area;
  const nonProtectedPercentage = 100 - protectedPercentage;

  return ([
    {
      label: 'Total restorable area',
      value: 'protection',
      color: '#06C4BD',
      percentage: protectedPercentage,
      total: data.total,
      year: data.year,
      protection: protectedMangroves,
      // unit: chartData.unit,
    },
    {
      label: 'Total mangrove area in 2016',
      value: 'nonProtected',
      color: '#ECECEF',
      percentage: nonProtectedPercentage,
      protection: nonProtected,
      year: data.year,
      // unit: chartData.unit,
    }])
};

const CustomizedContent = (props) => {
  const { root, depth, x, y, width, height, index, name, value } = props;

  const colors = [
    "#E06666",
    "#FFE599",
    "#19C4BD",
  ];

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill:
            depth < 2
              ? colors[Math.floor((index / root.children.length) * 3)]
              : "none",
          stroke: "#fff",
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10)
        }}
      />
      {depth === 1 ? (
        <text
          x={x + width / 2}
          y={y + height / 2 + 7}
          textAnchor="middle"
          fill="#fff"
          fontSize={14}
        >
          {name}
        </text>
      ) : null}
      {depth === 1 ? (
        <text x={x + 4} y={y + 18} fill="#fff" fontSize={16} fillOpacity={0.9}>
          {index + 1}
        </text>
      ) : null}
    </g>
  );
};

const getChartLineData = () => ([{
  "restoration_potential_score": 68,
  "restorable_area": 186611,
  "restorable_area_perc": 68,
  total: 100,
  "mangrove_area_extent": 2703410,
  "year": 2016
}])

export const CONFIG = {
  parse: (data, unit) => {
    const chartLineData = getChartLineData();
    const chartRingData = getChartRingData(data);
    const protectedPercentage = data.protected_area * 100 / data.total_area;
    const chartTreeData = [
      {
        name: 'Commodities',
        children: [
          { name: 'rice', size: 1302 },
          { name: 'shrimp', size: 24593 },
          { name: 'oil palm cultivation', size: 652 },
        ],
      },
      {
        name: 'data',
        children: [
          { name: 'Data', size: 20544 },
          { name: 'DataList', size: 19788 },
          { name: 'DataSprite', size: 10349 },
          { name: 'EdgeSprite', size: 3301 },
          { name: 'NodeSprite', size: 19382 },
          {
            name: 'render',
            children: [
              { name: 'ArrowType', size: 698 },
              { name: 'EdgeRenderer', size: 5569 },
              { name: 'IRenderer', size: 353 },
              { name: 'ShapeRenderer', size: 2247 },
            ],
          },
          { name: 'ScaleBinding', size: 11275 },
          { name: 'Tree', size: 7147 },
          { name: 'TreeBuilder', size: 9930 },
        ],
      },
      {
        name: 'events',
        children: [
          { name: 'DataEvent', size: 7313 },
          { name: 'SelectionEvent', size: 6880 },
          { name: 'TooltipEvent', size: 3701 },
          { name: 'VisualizationEvent', size: 2117 },
        ],
      },
    ];
    return {
      chartLineData,
      chartRingData,
      chartTreeData,
      chartRingConfig: {
        type: 'pie',
        layout: 'center',
        height: 300,
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
          maxWidth: 150,
          layout: 'vertical',
          fontSize: 9,
          content: (properties) => {
            const { payload } = properties;
            const groups = groupBy(payload, p => console.log(p) || p.payload.value);
            console.log(groups, 'restor')
            return <WidgetLegend style={{
              align: 'left',
              verticalAlign: 'middle',
              maxWidth: 150,
              layout: 'vertical',
              fontSize: 9,
            }} groups={groups} widgetSpecific="este" />;
          }
        },
        tooltip: {
          cursor: false,
          content: ((properties) => {
            const { payload } = properties;
            if (!payload.length) return null;
            const year = 2016;

            return (
              <WidgetTooltip
                style={{
                  flexDirection: 'column',
                  marginTop: '10px',

                }}
                payload={payload}
                settings={[
                  { label: 'Total restorable area:', key: 'percentage', format: value => `${numberFormat(value)} %`, position: '_column' },
                  { label: `Total mangrove area in ${year}:`, key: 'protection', format: value => `${numberFormat(value)}`, position: '_column' },
                ]}
              />
            );
          })
        }
      },
      chartTreeConfig: {
        height: 400,
        width: 200,
        margin: { top: 20, right: 0, left: 0, bottom: 0 },
        dataKey: 'size',
        aspectRatio: 3 / 4,
        yKeys: {
          tree: true,
        },
        content: (props) => <CustomizedContent {...props} />,
        // legend: {
        //   align: 'left',
        //   verticalAlign: 'middle',
        //   layout: 'vertical',
        //   fontSize: 9,
        //   content: (properties) => {
        //     const { payload } = properties;
        //     console.log(payload, 'legend')
        //     const groups = groupBy(payload, p => p.value);
        //     console.log(groups)
        //     return (
        //       <>
        //         <WidgetLegend widgetSpecific="restoration" title="" groups={groups} />
        //       </>
        //     )
        //   }
        // },
        tooltip: {
          cursor: false,
          content: ((properties) => {
            const { payload } = properties;
            if (!payload.length) return null;
            const year = 2016;

            return (
              <WidgetTooltip
                style={{
                  flexDirection: 'column',
                  marginTop: '10px',

                }}
                payload={payload}
                settings={[
                  { label: 'Total restorable area:', key: 'percentage', format: value => `${numberFormat(value)} %`, position: '_column' },
                  { label: `Total mangrove area in ${year}:`, key: 'protection', format: value => `${numberFormat(value)}`, position: '_column' },
                ]}
              />
            );
          })
        }
      },
      chartLineConfig: {
        layout: 'vertical',
        height: 150,
        margin: { top: 10, right: 0, left: 0, bottom: 0 },
        xAxis: {
          type: 'number',
          allowDecimals: false,
          interval: 'preserveStartEnd',
          domain: [0, 100],
          hide: true
        },
        yAxis: {
          type: 'category',
          width: 0,
          hide: true
        },
        xKey: 'total',
        yKeys: {
          bars: {
            restorable_area_perc: {
              barSize: 30,
              stackId: 'a',
              fill: '#06C4BD',
              isAnimationActive: false,
              label: {
                content: (prs) => {
                  const { width, y, height, offset } = prs;
                  return (
                      <svg x={width - offset * 2} y={y - height / 2} height="13.3" width="100" id="canvas">
                        <polygon points="10.0,13.3 20,0 0,0 " style={ { fill: '#000', stroke: '#000', 'stroke-width': 1 }} />
                      </svg>
                  );
                }
              },
            },
            total: {
              barSize: 30,
              stackId: 'a',
              fill: '#ECECEF',
              isAnimationActive: false
            },
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
            return <WidgetLegend widgetSpecific="blue-carbon" title="Total carbon density (t CO<sub>2</sub>e / ha)" groups={groups} />;
          }
        },
        tooltip: {
          cursor: false,
          content: (
            <WidgetTooltip
              settings={[
                { label: 'Restoration potential Score', color: '#06C4BD', key: 'restorable_area_perc', format: value => `${value} %` },
                { label: 'Total', color: '#ECECEF', key: 'total', format: value => `${numberFormat(Math.abs(value))} ha` },
              ]}
              style={{
                flexDirection: 'column',
                marginTop: '10px',
                marginLeft: '-50px'
              }}
            />
          )
        }
      }
    };
  }
};

export default CONFIG;
