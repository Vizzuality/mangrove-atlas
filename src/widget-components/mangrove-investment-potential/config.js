import React from "react";

// utils
import sortBy from 'lodash/sortBy';
import { format } from "d3-format";

// components
import WidgetTooltip from "components/widget-tooltip";

const numberFormat = format(",.2f");
const COLORS = {
  remaining: "#ff7f0f",
  protected: "#2da02b",
  carbon_10: "#1f78b4",
  carbon_5: "#d72729",
};

const CATEGORY_DICTIONARY = {
  carbon_5: "Investible Blue Carbon",
  carbon_10: "Additional Investible Blue Carbon",
  Remaining: "Remaining mangrove",
  Protected: "Area of Mangrove in Protected Areas"
}

const getData = (data) => {
  if (!data || !data.length) return null;

  return sortBy(data.map((d) => {
    const hasLabel = d.label.toLowerCase() !== d.category;
    return ({
      category: CATEGORY_DICTIONARY[d.category],
      label: d.label,
      value: d.value,
      color: COLORS[d.category],
      description: hasLabel ? d.description : null,
      percentage: d.percentage,
      tooltipValue: hasLabel ? d.description : `${numberFormat(d.value)} ha`,
    });
}), "value")};


export const CONFIG = {
  parse: (data, investibleBlueCarbon) => {   
    const total = data.reduce(
      (previous, current) => current.value + previous,
      0
    );
    const chartData = getData(data, total);
    const investibleBlueCarbonValue = data.find(({ label }) => label.includes(investibleBlueCarbon));

    return {
      chartData,
      investibleBlueCarbonValue,
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
              nameKey: "category",
              innerRadius: "60%",
              outerRadius: "80%",
              isAnimationActive: false,
              labelLine: false,
              label: ({ cx, cy, midAngle, outerRadius, label, category }) => {
                const RADIAN = Math.PI / 180;
                const sin = Math.sin(-RADIAN * midAngle);
                const cos = Math.cos(-RADIAN * midAngle);
                const mx = cx + (outerRadius + 10) * cos;
                const my = cy + (outerRadius + 10) * sin;
                const ex = mx + (cos >= 0 ? 1 : -1);
                const ey = my;
                const textAnchor = cos >= 0 ? "start" : "end";
                const hasLabel = label.toLowerCase() !== category;
                return (
                  <g>
                    {hasLabel && (
                      <text
                        x={ex + (cos >= 0 ? 1 : -1)}
                        y={ey}
                        textAnchor={textAnchor}
                        fill="#8884d8"
                      >
                        {category}
                      </text>
                    )}
                    <text
                      x={ex + (cos >= 0 ? 1 : -1)}
                      y={ey}
                      dy={hasLabel ? 10 : 0}
                      textAnchor={textAnchor}
                      fill="#8884d8"
                    >
                      {label}
                    </text>
                  </g>
                );
              },
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
                    label: "Area",
                    key: "tooltipValue",
                    position: "_column",
                  },
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
