import React from 'react';

// utils
import groupBy from 'lodash/groupBy';
import looseJsonParse from 'utils/loose-json-parse';
import sortBy from 'lodash/sortBy';
import { format } from 'd3-format';

// components
import WidgetTooltip from 'components/widget-tooltip';
import WidgetLegend from 'components/widget-legend';
import WidgetCustomLabel from 'components/widget-custom-label';

const numberFormat = format(',.2r');

const categoriesData = {
  '0–50': {
    color: '#5C4A3D',
    label: '0 – 50'
  },
  '50–100': {
    color: '#933A06',
    label: '50 – 100'
  },
  '100–150': {
    color: '#B84E17',
    label: '100 – 150'
  },
  '150–200': {
    color: '#E68518',
    label: '150 – 200'
  },
  '200–250': {
    color: '#EEB66B',
    label: '200 – 250'
  }
};

const widgetMeta = ({ list, metadata }) => {
  if (list && list.length && metadata) {
    return {
      years: list.filter(d => d.length_m).map(d => new Date(d.date).getFullYear()),
      total: metadata.location_coast_length_m
    };
  }

  return {
    years: [],
    total: null
  };
};


const getData = (data) => {
  if (!data || !data.length) return null;

  const histogram = data.map(d => d['toc_co2eha-1_hist']);
  const total = Object.values(histogram[0]).reduce((previous, current) => current + previous);
  const result = histogram[0];
  return [
    { label: '400-1000 t CO₂e/ha', value: result[400], color: '#5C4A3D', percentage: result[400] / total * 100 },
    { label: '1000-1300 t CO₂e/ha', value: result[400], color: '#933A06', percentage: result[400] / total * 100 },
    { label: '1300-1600 t CO₂e/ha', value: result[400], color: '#B84E17', percentage: result[400] / total * 100 },
    { label: '1600-1900 t CO₂e/ha', value: result[400], color: '#E68518', percentage: result[400] / total * 100 },
    { label: '1900-2200 t CO₂e/ha', value: result[400], color: '#EEB66B', percentage: result[400] / total * 100 },
  ];
};

const biomassCoverage = ({ list }, yearSelected) => {
  const yearData = list.find(d => d.date
    .includes(yearSelected));
  if (!yearData) return null;
  return yearData.agb_mgha_1.toFixed(2);
};

const filterData = ({ list }, yearSelected) => sortBy(
  list
    .filter(d => d.total_carbon
      && d.date.includes(yearSelected)),
  ['date']
).map(i => i.total_carbon);

const getTotals = ({ list }, yearSelected) => list
  .filter(d => d.total_carbon && d.date.includes(yearSelected))
  .map(i => i.total_carbon);


export const CONFIG = {
  parse: (data, yearSelected = 2016) => {

    const dataFiltered = filterData(data, yearSelected);
    const chartData = getData(dataFiltered);
    const totalValues = (getTotals(data, yearSelected))[0]
    return {
      chartData,
      coverage: biomassCoverage(data, yearSelected),
      totalValues,
      chartConfig: {
        type: 'pie',
        layout: 'centric',
        margin: { top: 20, right: 0, left: 0, bottom: 0 },
        xKey: 'percentage',
        yKeys: {
          pies: {
            y: {
              cx: '50%',
              cy: '50%',
              paddingAngle: 2,
              dataKey: 'percentage',
              nameKey: 'label',
              innerRadius: '60%',
              outerRadius: '80%',
              isAnimationActive: false,
              customLabel: ({ viewBox }) => {
                const { cx, cy } = viewBox;
                return (
                  <g>
                    <text x={cx} y={cy - 30} lineheight="19" className="recharts-text recharts-label" textAnchor="middle" dominantBaseline="central">
                      <tspan alignmentBaseline="middle" fill="rgba(0,0,0,0.85)" fontSize="14">Total</tspan>
                    </text>
                    <text x={cx} y={cy} className="recharts-text recharts-label" textAnchor="middle" dominantBaseline="central">
                      <tspan alignmentBaseline="middle" fill="rgba(0,0,0,0.85)" lineheight="29" fontSize="40">{numberFormat(totalValues.soc_co2e / 1000000)}</tspan>
                    </text>
                    <text x={cx} y={cy + 30} className="recharts-text recharts-label" textAnchor="middle" dominantBaseline="central">
                      <tspan alignmentBaseline="middle" fill="rgba(0,0,0,0.85)" fontSize="14">Mt CO₂e/ha</tspan>
                    </text>
                  </g>
                );
              }
            }
          }
        },
        legend: {
          align: 'left',
          verticalAlign: 'middle',
          layout: 'vertical',
          fontSize: 10,
          content: (properties) => {
            const { payload } = properties;
            const groups = groupBy(payload, p => p.payload.label);
            return <WidgetLegend groups={groups} unit="%" />;
          }
        },
        tooltip: {
          cursor: false,
          content: ((properties) => {
            const { payload } = properties;
            if (!payload.length) return null;
            const tooltipData = payload[0].payload;
            return (
              <WidgetTooltip
                style={{
                  flexDirection: 'column',
                  marginTop: '10px',
                  marginLeft: '-50px'
                }}
                settings={[
                  { label: tooltipData.label, key: 'label', color: tooltipData.color, format: () => `${tooltipData.value ? (tooltipData.value).toFixed(2) : null} %`, position: '_column' },
                ]}
              />
            );
          })
        }
      }
    };
  }
};

export default CONFIG;
