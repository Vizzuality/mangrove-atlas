import React from "react";
import groupBy from "lodash/groupBy";
import WidgetTooltip from "components/widget-tooltip";
import WidgetLegend from "components/widget-legend";

import { format } from "d3-format";

const tooltipFormat = format(",~");

const widgetData = (
  mangroveArea,
  mangroveCoastCoverage,
  mangroveCoastCoveragePercentage,
  metadata,
  currentYear,
  unit
) => {
  if (mangroveArea) {
    const { total_lenght: total_length } = metadata;
    const nonMangrove = total_length - mangroveCoastCoverage;
    return [
      {
        label: `Coastline coverage in ${currentYear}`,
        value: mangroveArea,
        color: "#06C4BD",
        y: unit === "ha" ? mangroveArea * 100 : mangroveArea,
        percentage: mangroveCoastCoveragePercentage,
        unit,
        area: mangroveArea,
        coverage: mangroveCoastCoverage?.toFixed(2),
        year: currentYear,
      },
      {
        color: "#ECECEF",
        percentage: 100 - mangroveCoastCoveragePercentage,
        y: nonMangrove,
        unit,
        coverage: nonMangrove.toFixed(2),
        label: "Non mangroves",
        value: nonMangrove,
        area: nonMangrove,
        year: currentYear,
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
    const dataByYear = data.filter(({ year }) => year === currentYear);
    const dataParsed = dataByYear.reduce(
      (acc, data) => ({
        ...acc,
        year: data.year,
        [data.indicator]: data.value,
      }),
      {}
    );
    const { total_lenght: total_length } = metadata;
    const mangroveArea = dataParsed.habitat_extent_area;
    const mangroveCoastCoverage = dataParsed.linear_coverage;
    const mangroveCoastCoveragePercentage =
      (mangroveCoastCoverage * 100) / total_length;

    return {
      mangroveArea,
      mangroveCoastCoverage,
      mangroveCoastCoveragePercentage,
      chartData: widgetData(
        mangroveArea,
        mangroveCoastCoverage,
        mangroveCoastCoveragePercentage,
        metadata,
        currentYear,
        unit
      ),
      downloadData: getDownloadData(data, metadata),
      chartConfig: {
        type: "pie",
        layout: "centric",
        height: 250,
        margin: { top: 20, right: 0, left: 0, bottom: 0 },
        xKey: "nonCovered",
        yKeys: {
          pies: {
            coverage: {
              cx: "50%",
              cy: "50%",
              paddingAngle: 2,
              dataKey: "percentage",
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
                  (item.payload.unit === "ha" && item.payload.value * 100) ||
                  (item.payload.unit === "%" && item.payload.percent) ||
                  (item.payload.unit === "km²" && Number(item.payload.value));

                return {
                  ...item.payload,
                  value: item.payload.label,
                  y: value,
                  unit,
                  label: item.payload.label,
                };
              }),
              "label"
            );

            return (
              <WidgetLegend
                groups={groups}
                unit={unit === "km²" ? "km²" : "ha"}
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
                  key: "percentage",
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
