import React from "react";
import groupBy from "lodash/groupBy";
import WidgetTooltip from "components/widget-tooltip";
import WidgetLegend from "components/widget-legend";

import { format } from "d3-format";

const tooltipFormat = format(",~");

const widgetData = (data, metadata, unit) => {
  if (data) {
    const { total_area: totalAreaPercentage } = metadata;

    const { value, year } = data;
    const totalAreaMangroves = (value * 100) / totalAreaPercentage;
    const nonMangrove = totalAreaMangroves;

    return [
      {
        x: year,
        y: value,
        color: "#06C4BD",
        percent: totalAreaPercentage,
        unit,
        area: value,
        coverage: value.toFixed(2),
        value: value.toFixed(2),
        label: `Coastline coverage in ${year}`,
      },
      {
        x: 0,
        y: nonMangrove,
        color: "#ECECEF",
        percent: 100 - totalAreaPercentage,
        unit,
        coverage: nonMangrove.toFixed(2),
        label: "Non mangroves",
      },
    ];
  }
};

const getDownloadData = (data, metadata) => {
  return {
    "Total coast length (km)": metadata.total_lenght,
    "Total area (km²)": metadata.total_area,

    ...data.map((l) => ({
      year: l.year,
      "Mangrove habitat area (km²)": l.value,
      "Mangrove coastline coverage (km)": metadata.total_lenght - l.value,
      "Percentage (%)": (l.value / metadata.total_lenght) * 100,
    })),
  };
};

export const CONFIG = {
  parse: (data, metadata, currentYear, unit) => {
    const dataByYear = data.find(({ year }) => year === currentYear);
    const totalMangroveArea = dataByYear.value;
    return {
      totalMangroveArea,
      chartData: widgetData(dataByYear, metadata, unit),
      downloadData: getDownloadData(data, metadata),
      chartConfig: {
        type: "pie",
        layout: "centric",
        height: 250,
        margin: { top: 20, right: 0, left: 0, bottom: 0 },
        xKey: "percent",
        yKeys: {
          pies: {
            coverage: {
              cx: "50%",
              cy: "50%",
              paddingAngle: 2,
              dataKey: "percent",
              nameKey: "label",
              innerRadius: "55%",
              outerRadius: "80%",
              isAnimationActive: false,
            },
          },
        },
        legend: {
          align: "left",
          maxWidth: 170,
          verticalAlign: "middle",
          layout: "vertical",
          content: (properties) => {
            const { payload } = properties;
            const groups = groupBy(
              payload.map((item) => {
                const value =
                  (item.payload.unit === "ha" && item.payload.coverage * 100) ||
                  (item.payload.unit === "%" && item.payload.percentage) ||
                  (item.payload.unit === "km" && Number(item.payload.coverage));

                return {
                  ...item.payload,
                  value: item.payload.label,
                  y: value,
                  label: item.payload.label,
                };
              }),
              "label"
            );

            return (
              <WidgetLegend
                groups={groups}
                unit={unit === "km" ? "km" : unit}
                direction="vertical"
              />
            );
          },
        },
        tooltip: {
          cursor: false,
          coordinate: { x: -10, y: -10 },
          active: true,
          content: (
            <WidgetTooltip
              style={{
                flexDirection: "column",
                justifyContent: "space-around",
                marginLeft: "5px",
              }}
              settings={[
                { key: "label" },
                {
                  label: "Percentage:",
                  key: "percent",
                  format: (percentage) =>
                    `${percentage ? percentage.toFixed(2) : null} %`,
                  position: "_column",
                },
                {
                  label: "Coverage:",
                  key: "coverage",
                  format: (coverage) =>
                    `${
                      unit === "ha"
                        ? tooltipFormat(coverage * 100)
                        : tooltipFormat(coverage)
                    } ${unit === "ha" ? "ha" : "km"}`,
                  position: "_column",
                },
              ]}
            />
          ),
        },
      },
    };
  },
};

export default CONFIG;
