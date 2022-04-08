import React from "react";

// utils
import { format } from "d3-format";

// components
import WidgetTooltip from "components/widget-tooltip";

const numberFormat = format(",.2f");
const COLORS = ["#ff7f0f", "#2da02b", "#1f78b4", "#d72729"];

const getData = (data) => {
  if (!data || !data.length) return null;
  const dataFormatted = data[0].blue_carbon_rate;
  const total = Object.values(dataFormatted).reduce(
    (previous, current) => current + previous
  );
  return Object.keys(dataFormatted).map((key, index) => ({
    label: key,
    value: dataFormatted[key],
    color: COLORS[index],
    total: total,
    percentage: (dataFormatted[key] / total) * 100,
  }));
};

const filterData = (data, yearSelected) =>
  data
    .filter((d) => d.date.includes(yearSelected))
    .map((i) => {
      return {
        blue_carbon_rate: i.blue_carbon_rate,
      };
    });

export const CONFIG = {
  parse: (data, yearSelected = 2016) => {
    const dataFiltered = filterData(data, yearSelected);
    const chartData = dataFiltered.length ? getData(dataFiltered) : "";

    return {
      chartData,
      totalValues: chartData[0].total,
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
              }) => {
                const RADIAN = Math.PI / 180;
                const radius = 15 + innerRadius + (outerRadius - innerRadius);
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                return (
                  <text
                    x={x}
                    y={y}
                    fill="#8884d8"
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                  >
                    {label
                      .split("_")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() + word.substring(1)
                      )
                      .join(" ")}
                  </text>
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
