import React from "react";
import { format } from "d3-format";
import WidgetLegend from "components/widget-legend";
import WidgetTooltip from "components/widget-tooltip";
import orderBy from "lodash/orderBy";

export const numberFormat = format(".2~f");
export const smallNumberFormat = format(".4~f");
export const formatAxis = format(",.0d");

// const getFormat = (v) => {
//   const decimalCount = -Math.floor(Math.log10(v) + 1);
//   // if (!decimalCount) return null;

//   const formatByDecimals = format(
//     `.${decimalCount === "Infinity" ? 1 : decimalCount}~f`
//   );
//   return formatByDecimals(v);
//   if (v < 0.01) return smallNumberFormat(v);
//   else if (v < 0.001) return smallNumberFormat(v);
//   else return formatAxis(v);
// };

const widgetData = (data, unit) => {
  const firstYear = data[0]?.year;
  const netChangeValues = data.map((d) => d.net_change);
  netChangeValues.shift();

  const cumulativeValuesNetChange = [0, ...netChangeValues]?.reduce(
    (acc, value, i) => {
      acc.push((acc[i] += value));
      return acc;
    },
    [0]
  );

  return orderBy(
    data.map((l, i) => {
      return {
        label: l.year,
        year: l.year,

        netChange:
          unit === "ha"
            ? cumulativeValuesNetChange[i] * 100
            : cumulativeValuesNetChange[i],
        gain: l.year === firstYear ? 0 : unit === "ha" ? l.gain * 100 : l.gain,
        loss:
          l.year === firstYear ? 0 : unit === "ha" ? -l.loss * 100 : -l.loss,
        netChangeRaw: l.value,
      };
    }),
    (l) => l.year
  );
};

const getBars = (drawingMode) =>
  drawingMode
    ? {
        gain: {
          barSize: 10,
          transform: `translate(${(4 + 10) / 2}, 0)`,
          fill: "#A6CB10",
          radius: [10, 10, 0, 0],
          legend: "Gain",
          isAnimationActive: false,
        },
        loss: {
          barSize: 10,
          transform: `translate(-${(4 + 10) / 2}, 0)`,
          fill: "#EB6240",
          radius: [10, 10, 0, 0],
          legend: "Loss",
          isAnimationActive: false,
        },
      }
    : {};

const CONFIG = {
  parse: (data, unit, drawingMode = false) => {
    const chartData = widgetData(data, unit);
    const change = chartData[chartData.length - 1]?.netChange;

    return {
      change,
      chartData,
      metadata: data.metadata || {},
      chartConfig: {
        stackOffset: "sign",
        height: 360,
        margin: { top: 60, right: 15, left: 0, bottom: 20 },
        referenceLines: [{ y: 0, label: null, stroke: "rgba(0,0,0,0.85)" }],
        xKey: "year",
        yKeys: {
          lines: {
            netChange: {
              stroke: "rgba(0,0,0,0.7)",
              legend: "Net change",
              isAnimationActive: false,
            },
          },
          // temporary hidden because of wrong calculations in data
          bars: getBars(drawingMode),
        },
        xAxis: {
          tick: { fontSize: 12, fill: "rgba(0, 0, 0, 0.54)" },
        },
        yAxis: {
          tick: { fontSize: 12, fill: "rgba(0, 0, 0, 0.54)" },
          tickFormatter: (v) => {
            const result = unit === "ha" ? v * 100 : v;
            return result === 0
              ? 0
              : Math.abs(v) < 0.01
              ? smallNumberFormat(result)
              : formatAxis(result);
          },
          tickMargin: 10,
          orientation: "right",
          label: {
            value: unit === "km²" ? "km²" : unit,
            position: "top",
            offset: 35,
          },
        },
        cartesianGrid: {
          vertical: false,
          strokeDasharray: "5 20",
        },
        legend: {
          align: "left",
          verticalAlign: "top",
          layout: "horizontal",
          height: 50,
          // eslint-disable-next-line react/prop-types
          content: ({ payload }) => {
            const labels = payload.map(
              ({ color, value, payload: labelPayload }) => ({
                color,
                value: labelPayload.legend || value,
                variant: labelPayload.dataKey === "netChange" ? "bar" : "rect",
              })
            );

            // TO DO - gain and loss should come from API. REmove hardcoded labels when API is ready
            const labelsForLayer = [
              ...labels,
              {
                color: "#A6CB10",
                value: "Gain",
                variant: "rect",
              },
              {
                color: "#EB6240",
                value: "Loss",
                variant: "rect",
              },
            ];
            return (
              <WidgetLegend
                position="top"
                direction="vertical"
                groups={drawingMode ? { labels } : { labelsForLayer }}
              />
            );
          },
        },
        tooltip: {
          cursor: false,
          content: (
            <WidgetTooltip
              type="column"
              style={{
                color: "black",
                backgroundColor: "white",
                display: "flex",
                justifyContent: "space-around",
                marginLeft: "30px",
              }}
              settings={[
                ...(drawingMode
                  ? [
                      {
                        label: "Gain",
                        color: "#A6CB10",
                        key: "gain",
                        format: (value) =>
                          `${
                            value === 0
                              ? value
                              : value < 1000
                              ? smallNumberFormat(value)
                              : numberFormat(value)
                          } ${unit === "ha" ? "ha" : "km²"}`,
                      },
                    ]
                  : []),
                ...(drawingMode
                  ? [
                      {
                        label: "Loss",
                        color: "#EB6240",
                        key: "loss",
                        format: (value) =>
                          `${
                            value === 0
                              ? value
                              : value < 1000
                              ? smallNumberFormat(value)
                              : numberFormat(value)
                          } ${unit === "ha" ? "ha" : "km²"}`,
                      },
                    ]
                  : []),
                {
                  label: "Net change",
                  color: "rgba(0,0,0,0.7)",
                  key: "netChange",
                  format: (value) =>
                    `${
                      value === 0
                        ? value
                        : value < 1000
                        ? smallNumberFormat(value)
                        : numberFormat(value)
                    } ${unit === "ha" ? "ha" : "km²"}`,
                  bulletType: "bar",
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
