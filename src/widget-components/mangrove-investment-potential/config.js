import React from "react";

// utils
import { format } from "d3-format";

// components
import WidgetTooltip from "components/widget-tooltip";

const numberFormat = format(",.2f");
const COLORS = {
  remaining: "#ff7f0f",
  protected: "#2da02b",
  carbon_10: "#1f78b4",
  carbon_5: "#d72729"
};

const getData = (data, total) => {
  if (!data || !data.length) return null;

  return data.map((d, index) => ({
    label: d.category,
    value: d.value,
    color: COLORS[d.category],
    total: total,
    percentage: d.percentage,
  })
)};


export const CONFIG = {
  parse: (data) => {
    const total = data.reduce(
      (previous, current) => current.value + previous
    );
    const chartData = getData(data, total);
    const widgetSentence = data?.find(d => d?.text?.includes('$5'))?.text;

    return {
      chartData,
      totalValues: total,
      widgetSentence,
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
              labelLine: false,
              label: ({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                label,
                startAngle,
                ...rest
              }) => {
                const RADIAN = Math.PI / 180;
                const radius = 5 + innerRadius + (outerRadius - innerRadius);
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                const getDy = () => {
                  if (startAngle === 0) return -5
                  if (x < cx) return 0
                  else return 0
                };
                const dy = getDy();

                return (
                  <text
                    x={x}
                    y={y}
                    dy={dy}
                    fill="#8884d8"
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                    style={{ padding: 20 }}
                  >
                    {label}
                  </text>
                );
              }
              
            },
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
