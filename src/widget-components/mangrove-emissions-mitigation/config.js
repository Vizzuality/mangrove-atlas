import React from "react";

// utils
import chroma from "chroma-js";
import groupBy from "lodash/groupBy";
import { format } from "d3-format";

// components
import WidgetLegend from "./emissions-legend";
import WidgetTooltip from "components/widget-tooltip";

import styles from "./style.module.scss";

const numberFormat = format(",.3r");

const handleChartBars = (
  indicator,
  filteredIndicators,
  setFilteredIndicators
) => {
  const index = filteredIndicators.indexOf(indicator);
  if (index === -1) {
    setFilteredIndicators([...filteredIndicators, indicator]);
  } else {
    const filter = filteredIndicators.splice(index, 1);
    const updatedIndicators = filteredIndicators.filter(
      (indicator) => indicator !== filter
    );
    setFilteredIndicators(updatedIndicators);
  }
};

const getData = (data) => {
  const dataByCategory = groupBy(data, "category");
  const bars = Object.values(dataByCategory);

  return bars.reduce(
    (acc, d) => [
      ...acc,
      d.reduce(
        (acc2, r) => ({
            category: r.category,
            ...acc2,
            [r.indicator]: r.value,
          }),
        {}
      ),
    ],
    []
  );
};

const getBars = (indicators, filteredIndicators) =>
  indicators.reduce(
    (acc, indicator) => ({
      ...acc,
      [Object.keys(indicator)[0]]: {
        stackId: "bar",
        barSize: 60,
        fill: Object.values(indicator)[0],
        stroke: Object.values(indicator)[0],
        isAnimationActive: false,
        opacity:
          filteredIndicators.includes(Object.keys(indicator)[0]) ||
          !filteredIndicators.length
            ? 1
            : 0.5,
      },
    }),
    {}
  );

const getLegendPayload = (data) =>
  data.map((d) => ({
    label: Object.keys(d)[0],
    color: Object.values(d)[0],
  }));

const LabelContent = ({ viewBox }) => {
  const { x, y, width } = viewBox;
  return (
    <g>
      <text
        x={x - width / 2}
        y={y / 2}
        textAnchor="top"
        fill="#000"
        fontSize="12px"
        fontWeight={700}
        opacity="0.6"
      >
        tCO2/ha
      </text>
    </g>
  );
};

const CustomizedAxisTick = (props) => {
  const { x, y, width, payload } = props;
  return (
    <foreignObject
      x={x - width / 2 + payload?.offset + payload?.offset / 2 - 3}
      y={y}
      width="100%"
      height="100%"
      textAnchor="start"
    >
      <div title={payload?.name} className={styles.customAxis}>
        {payload?.value}
      </div>
    </foreignObject>
  );
};

export const CONFIG = {
  parse: (data, filteredIndicators, setFilteredIndicators) => {
    const COLOR_RAMP = chroma
      .scale(["#1C52A3", "#7996F3", "#1B97C1", "#B8E98E", "#B8E98E", "#EB6240"])
      .colors(data.length);
    const indicators = data.map((d, i) => ({
      [d.indicator]: COLOR_RAMP[i],
    }));
    const chartData = getData(data);
    const legendPayload = getLegendPayload(indicators);

    return {
      chartData,
      legendPayload,
      chartConfig: {
        height: 360,
        cartesianGrid: {
          vertical: false,
          horizontal: true,
          strokeDasharray: '5 20'
        },
        margin: { top: 40, right: 0, left: 0, bottom: 20 },
        xKey: "category",
        yKeys: {
          bars: getBars(indicators, filteredIndicators),
        },
        referenceLines: [
          {
            y: 0,
            stroke: "black",
            strokeDasharray: "solid",
            fill: "black",
            opacity: "1",
            label: null,
          },
        ],
        xAxis: {
          tick: <CustomizedAxisTick textAnchor="center" />,
          interval: 0,
        },
        yAxis: {
          orientation: "right",
          tick: {
            fontSize: 12,
            fill: "rgba(0,0,0,0.54)",
          },
          width: 40,
          tickFormatter: (value) => Math.round(value),
          interval: 0,
          label: {
            content: LabelContent,
          },
          type: "number",
        },
        legend: {
          align: "left",
          verticalAlign: "middle",
          layout: "vertical",
          fontSize: 9,
          maxWidth: 200,
          maxHeight: 360,
          top: 0,
          content: () => (
            <WidgetLegend
              title="Intervention"
              groups={legendPayload}
              filteredIndicators={filteredIndicators}
              setFilteredIndicators={setFilteredIndicators}
              onClick={handleChartBars}
            />
          ),
        },
        tooltip: {
          cursor: false,
          content: (properties) => {
            const { payload } = properties;
            return (
              <WidgetTooltip
                payload={payload}
                type="column"
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  flexDirection: "column",
                }}
                settings={payload?.map((p) => ({
                  label: p.name,
                  key: p.name,
                  color: p.color,
                  format: () => numberFormat(p.value),
                  position: "_column",
                  type: "_stacked",
                }))}
              />
            );
          },
        },
      },
    };
  },
};

export default CONFIG;
