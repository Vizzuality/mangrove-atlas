import React from 'react';

// utils
import chroma from 'chroma-js';
import groupBy from 'lodash/groupBy';
import { format } from 'd3-format';

// components
import WidgetLegend from './emissions-legend';
import WidgetTooltip from 'components/widget-tooltip';

const numberFormat = format(',.3r');

const handleChartBars = (indicator, filteredIndicators, setFilteredIndicators) => {
  const index = filteredIndicators.indexOf(indicator)
  if (index === -1) {
    setFilteredIndicators([ ...filteredIndicators, indicator ]);
  }
  else {
    const filter = filteredIndicators.splice(index, 1);
    const updatedIndicators = filteredIndicators.filter((indicator) => indicator !== filter);
    setFilteredIndicators(updatedIndicators);
  }
};

const getData = (data) => {
  const dataByCategory = groupBy(data, 'category');
  const bars = Object.values(dataByCategory);

  return bars.reduce(
    (acc, d) => [
      ...acc,
      d.reduce(
        (acc2, r) => ({
          category: r.category,
          ...acc2,
          [r.indicator]: r.value
        }
      ), {}
    )], []
  )
};

const getBars = (indicators, filteredIndicators) => indicators.reduce((acc, indicator, i) => ({
    ...acc,
    [Object.keys(indicator)[0]]: {
      stackId: 'bar',
      barSize: 60,
      fill: Object.values(indicator)[0],
      stroke: Object.values(indicator)[0],
      isAnimationActive: false,
      opacity: filteredIndicators.includes(Object.keys(indicator)[0]) || !filteredIndicators.length ? 1 : 0.5,
    }
  }), {})  

const getLegendPayload = (data) => data.map((d) => ({
  label:  Object.keys(d)[0],
  color: Object.values(d)[0],
}));

const LabelContent = () => (
  <g>
    <text x={-180} y={15} transform="rotate(270)" textAnchor="middle" fill="#000" fontSize="14px">
      Mitigation (tCO2/ha)
    </text>
  </g>
);

const LabelXAxis = ({ viewBox }) => {
  const { x, y, height, width } = viewBox;
  return (
    <g>
      <text x={x + width / 2} y={y + height + 5} textAnchor="middle" fill="#000" fontSize="14px">
        Interventions
      </text>
    </g>
  )
};


export const CONFIG = {
  parse: (data, filteredIndicators, setFilteredIndicators) => {
    const COLOR_RAMP = chroma.scale(["#D4A6C8", "#8CD17D"]).colors(data.length);
    const indicators = data.map((d, i) => ({
      [d.indicator]: COLOR_RAMP[i]
    }))
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
          // strokeDasharray: '5 20'
        },
        margin: { top: 20, right: 0, left: 15, bottom: 20 },
        xKey: 'category',
        yKeys: {
          bars: getBars(indicators, filteredIndicators)
        },
        referenceLines: [{
          y: 0,
          stroke: 'black',
          strokeDasharray: 'solid',
          fill: 'black',
          opacity: '1',
          label: null
        }],
        xAxis: {
          tick: {
            fontSize: 12,
            lineheight: 20,
            fill: 'rgba(0, 0, 0, 0.54)'
          },
          interval: 0,
          label: {
            content: LabelXAxis,
          },
        },
        yAxis: {
          tick: {
            fontSize: 12,
            fill: 'rgba(0,0,0,0.54)'
          },
          width: 40,
          tickFormatter: value => Math.round(value),
          interval: 0,
          label: {
            content: LabelContent,
          },
          type: 'number'
        },
        legend: {
          align: 'right',
          verticalAlign: 'middle',
          layout: 'vertical',
          fontSize: 9,
          maxWidth: 200,
          content: () => (
          <WidgetLegend
            title="Intervention"
            groups={legendPayload}
            filteredIndicators={filteredIndicators}
            setFilteredIndicators={setFilteredIndicators}
            onClick={handleChartBars}
          />
          )
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
                  display: 'flex',
                  justifyContent: 'space-around',
                  flexDirection: 'column'
                }}
                settings={payload.map(p => (
                  { label: p.name, key: p.value, color: p.color, format: value => numberFormat(p.value), position: '_column', type: '_stacked'}
                ))}
              />
            );
          }
        }
      },
    };
  }
};

export default CONFIG;
