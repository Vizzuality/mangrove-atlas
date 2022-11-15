import React from "react";

// utils
import sortBy from "lodash/sortBy";
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
  remaining: "Remaining mangrove",
  protected: "Area of Mangrove in Protected Areas",
};

const getData = (data) => {
  if (!data || !data.length) return null;

  return sortBy(
    data.map((d) => {
      const hasLabel = d.label.toLowerCase() !== d.category;
      const labelDisplayed = `${CATEGORY_DICTIONARY[d.category]} ${
        hasLabel ? d.label : ""
      }`;

      return {
        category: labelDisplayed,
        label: hasLabel ? d.label : null,
        value: d.value,
        color: COLORS[d.category],
        description: d.description,
        percentage: d.percentage,
        tooltipValue: `${numberFormat(d.value)} ha`,
      };
    }),
    "value"
  );
};

export const CONFIG = {
  parse: (data, investibleBlueCarbon) => {
    const total = data.reduce(
      (previous, current) => current.value + previous,
      0
    );
    const chartData = getData(data, total);
    const investibleBlueCarbonValue = data.find(({ label }) =>
      label.includes(investibleBlueCarbon)
    );

    return {
      chartData,
      investibleBlueCarbonValue,
      chartConfig: {
        type: "pie",
        layout: "centric",
        margin: { top: 20, right: 0, left: 0, bottom: 20 },
        xKey: "percentage",
        yKeys: {
          pies: {
            y: {
              cx: "50%",
              cy: "60%",
              paddingAngle: 2,
              dataKey: "percentage",
              nameKey: "label",
              innerRadius: "60%",
              outerRadius: "80%",
              isAnimationActive: true,
              labelLine: false,
              label: (props) => {
                const {
                  cx,
                  cy,
                  midAngle,
                  endAngle,
                  outerRadius,
                  category,
                  percentage,
                  index,
                } = props;

                const RADIAN = Math.PI / 180;
                const sin = Math.sin(-RADIAN * midAngle);
                const cos = Math.cos(-RADIAN * midAngle);
                const mx = cx + outerRadius * cos;
                const my = cy + outerRadius * sin;
                const ex = mx + (cos >= 0 ? 1 : -1) * 12 - (cos >= 0 ? 0 : 130);
                const ey = my;
                const heightMargin = percentage < 5 ? 16 : 5;
                const top = endAngle < cy ? 6 : 0;

                return (
                  <g>
                    <foreignObject
                      x={ex + (cos >= 0 ? 1 : -6)}
                      y={ey - heightMargin * index - top}
                      height="20px"
                      width="125px"
                    >
                      <div
                        style={{
                          marginTop: 2,
                          marginBottom: 5,
                          display: "flex",
                          color: "#A5A5A5",
                          lineHeight: "10px",
                          width: "100%",
                          fontSize: "11px",
                        }}
                      >
                        {category}
                      </div>
                    </foreignObject>
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
                  { title: "category", key: "category" },
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
