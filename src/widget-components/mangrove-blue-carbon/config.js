import React from "react";

// utils
import groupBy from "lodash/groupBy";
import { format } from "d3-format";

// components
import WidgetTooltip from "components/widget-tooltip";
import WidgetLegend from "components/widget-legend";
import { orderBy } from "lodash";

const numberFormat = format(",.2f");
const removeDecimals = format(',.0f');

const COLORS = {
  "0-700": "#EEB66B",
  "700-1400": "#E68518",
  "1400-2100": "#B84E17",
  "2100-2800": "#933A06",
  "2800-3500": "#5C4A3D",
};

const getData = (data) => {
  if (!data || !data.length) return null;
  const orderedData = orderBy(data.map((d) => ({
    ...d,
    shortLabel: Number(d.indicator.split("-", 1)[0]),
  })), "shortLabel");

  const barsValues =
  orderedData.map(({ value }) => value);
 
  const total = barsValues.reduce((previous, current) => current + previous);

  return orderedData.map((d) => ({
    label: d.indicator,
    percentage: (d.value / total) * 100,
    color: COLORS[d.indicator],
  }));
};

// const getDownloadData = (data) => {
//   const total = (Object.values(data[0].toc_hist_tco2eha)
//     .reduce((previous, current) => current + previous)) / 100;

//   // TO-DO: make dynamic depending on keys
//   return data.map(l => (
//     {
//       Date: l.date,
//       'Total organic carbon stored in mangroves estimation (tco2e)': l.toc_tco2e,
//       'Amount stored in above-ground biomass (tco2e)': l.agb_tco2e,
//       'Amount stored in the upper 1m of soil (tco2e)': l.soc_tco2e,
//       'Histogram data 0--700': `${l.toc_hist_tco2eha['0--700']}
//         - color: #EEB66B - percentage (%):
//         ${(l.toc_hist_tco2eha['0--700']) / total}`,
//       'Histogram data 700--1400': `${l.toc_hist_tco2eha['700--1400']}
//         - color: #E68518 - percentage (%):
//         ${l.toc_hist_tco2eha['700--1400'] / total}`,
//       'Histogram data 1400-2100': `${l.toc_hist_tco2eha['1400--2100']}
//         - color: #B84E17 - percentage (%):
//         ${l.toc_hist_tco2eha['1400--2100'] / total}`,
//       'Histogram data 2100-2800': `${l.toc_hist_tco2eha['2100--2800']}
//         - color: #933A06 - percentage (%):
//         ${l.toc_hist_tco2eha['2100--2800'] / total}`,
//       'Histogram data 2800-3500': `${l.toc_hist_tco2eha['2800--3500']}
//         - color: #5C4A3D - percentage (%):
//         ${l.toc_hist_tco2eha['2800--3500'] / total}`,
//     }));
// };

export const CONFIG = {
  parse: (data, metadata) => {
    const chartData = getData(data);
    const { toc, agb, soc } = metadata;
    const agbFormat = numberFormat(agb / 1000000);
    const tocFormat = numberFormat(toc / 1000000);
    const socFormat = numberFormat(soc / 1000000);
    const tocInt = toc > 1000000 ? removeDecimals(toc / 1000000) : tocFormat;

    const downloadData = {}; //getDownloadData(data);

    return {
      agb: agbFormat,
      toc: tocFormat,
      soc: socFormat,
      chartData: orderBy(
        chartData,
        (d) => Number(d.label.split("--", 1)),
        "desc"
      ),
      coverage: 90,
      downloadData,
      chartConfig: {
        type: "pie",
        layout: "centric",
        margin: { top: 20, right: 0, left: 0, bottom: 0 },
        xKey: "percentage",
        yKeys: {
          pies: {
            y: {
              cx: "50%",
              cy: "50%",
              paddingAngle: 2,
              dataKey: "percentage",
              nameKey: "label",
              innerRadius: "60%",
              outerRadius: "80%",
              isAnimationActive: false,
              customLabel: ({ viewBox }) => {
                const { cx, cy } = viewBox;
                return (
                  <g>
                    <text
                      x={cx}
                      y={cy - 30}
                      lineheight="19"
                      className="recharts-text recharts-label-medium"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      <tspan
                        alignmentBaseline="middle"
                        fill="rgba(0,0,0,0.85)"
                        fontSize="14"
                      >
                        Total
                      </tspan>
                    </text>
                    <text
                      x={cx}
                      y={cy}
                      className="recharts-text recharts-label-large"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      <tspan
                        alignmentBaseline="middle"
                        fill="rgba(0,0,0,0.85)"
                        lineheight="29"
                        fontSize="30"
                      >
                        {tocInt}
                      </tspan>
                    </text>
                    <text
                      x={cx}
                      y={cy + 30}
                      className="recharts-text recharts-label-medium"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      <tspan
                        alignmentBaseline="middle"
                        fill="rgba(0,0,0,0.85)"
                        fontSize="14"
                      >
                        Mt CO₂e
                      </tspan>
                    </text>
                  </g>
                );
              },
            },
          },
        },
        legend: {
          align: "left",
          verticalAlign: "middle",
          layout: "vertical",
          fontSize: 9,
          content: (properties) => {
            const { payload } = properties;
            const groups = groupBy(payload, (p) => p.value);
            return (
              <WidgetLegend
                widgetSpecific="blue-carbon"
                title="Total carbon density (t CO<sub>2</sub>e / ha)"
                groups={groups}
              />
            );
          },
        },
        tooltip: {
          cursor: false,
          content: (properties) => {
            const { payload } = properties;
            if (!payload.length) return null;
            return (
              <WidgetTooltip
                style={{
                  flexDirection: "column",
                  marginTop: "10px",
                  marginLeft: "-50px",
                }}
                payload={payload}
                settings={[
                  {
                    label: "Percentage",
                    key: "percentage",
                    format: (value) => `${numberFormat(value)} %`,
                    position: "_column",
                  },
                ]}
              />
            );
          },
        },
      },
    };
  },
};

export default CONFIG;
