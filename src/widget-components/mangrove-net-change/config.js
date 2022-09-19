import React from "react";
import { format } from "d3-format";
import WidgetLegend from "components/widget-legend";
import WidgetTooltip from "components/widget-tooltip";
import orderBy from "lodash/orderBy";

export const numberFormat = format(",.2f");
export const formatAxis = format(",.0d");

const widgetData = (data) =>
  orderBy(
    data.map((l) => ({
      label: l.year,
      year: l.year,
      netChange: l.cum_sum,
    })),
    (l) => l.year
  );

const CONFIG = {
  parse: (data, unit) => {
    return {
      chartData: widgetData(data),
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
          // bars: {
          //   gain: {
          //     barSize: 0,
          //     transform: `translate(${(4 + 10) / 2}, 0)`,
          //     fill: '#A6CB10',
          //     radius: [10, 10, 0, 0],
          //     legend: 'Gain',
          //     isAnimationActive: false
          //   },
          //   loss: {
          //     barSize: 0,
          //     transform: `translate(-${(4 + 10) / 2}, 0)`,
          //     fill: '#EB6240',
          //     radius: [10, 10, 0, 0],
          //     legend: 'Loss',
          //     isAnimationActive: false
          //   }
          // }
        },
        xAxis: {
          tick: { fontSize: 12, fill: "rgba(0, 0, 0, 0.54)" },
        },
        yAxis: {
          tick: { fontSize: 12, fill: "rgba(0, 0, 0, 0.54)" },
          tickFormatter: (v) => {
            const result = unit === "ha" ? v * 100 : v;
            return formatAxis(result);
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
                groups={{ labelsForLayer }}
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
              payload={[
                // { label: 'Gain', color: '#A6CB10', key: 'gain', format: value => `${unit === 'ha' ? numberFormat(value / 10000) : numberFormat(value / 1000000)} ${unit === 'ha' ? 'ha' : 'km²'}²` },
                // { label: 'Loss', color: '#EB6240', key: 'loss', format: value => `${numberFormat(Math.abs(value / 1000000))} km²` },
                {
                  label: "Net change",
                  color: "rgba(0,0,0,0.7)",
                  key: "netChange",
                  format: (value) => `${numberFormat(value)} km²`,
                },
              ]}
              settings={[
                // { label: 'Gain', color: '#A6CB10', key: 'gain', format: value => `${unit === 'ha' ? numberFormat(value / 10000) : numberFormat(value / 1000000)} ${unit === 'ha' ? 'ha' : 'km²'}` },
                // { label: 'Loss', color: '#EB6240', key: 'loss', format: value => `${numberFormat(Math.abs(value / 1000000))} km²` },
                {
                  label: "Net result",
                  color: "rgba(0,0,0,0.7)",
                  key: "netChange",
                  format: (value) =>
                    `${
                      unit === "ha"
                        ? numberFormat(value * 100)
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
