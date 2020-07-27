import React from 'react';

// utils
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import { format } from 'd3-format';

// components
import WidgetTooltip from 'components/widget-tooltip';
import WidgetLegend from 'components/widget-legend';

const numberFormat = format(',.2f');
const removeDecimals = format(',.0f');

const getData = (data) => {
  if (!data || !data.length) return null;
  const dataFormatted = data[0].histogram;
  const total = Object.values(dataFormatted).reduce((previous, current) => current + previous);
  return [
    { label: '400-1000', value: dataFormatted['400--700'] + dataFormatted['700--1000'], color: '#5C4A3D', percentage: (dataFormatted['400--700'] + dataFormatted['700--1000']) / total * 100 },
    { label: '1000-1300', value: dataFormatted['1000--1300'], color: '#933A06', percentage: dataFormatted['1000--1300'] / total * 100 },
    { label: '1300-1600', value: dataFormatted['1300--1600'], color: '#B84E17', percentage: dataFormatted['1300--1600'] / total * 100 },
    { label: '1600-1900', value: dataFormatted['1600--1900'], color: '#E68518', percentage: dataFormatted['1600--1900'] / total * 100 },
    { label: '1900-2200', value: dataFormatted['1900--2200'], color: '#EEB66B', percentage: dataFormatted['1900--2200'] / total * 100 },
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
    .filter(d => d.toc_hist_tco2eha
      && d.soc_tco2e
      && d.toc_tco2e
      && d.bgb_tco2e
      && d.agb_tco2e
      && d.date.includes(yearSelected)),
  ['date']
).map((i) => {
  return {
    histogram: i.toc_hist_tco2eha,
    soils: numberFormat(i.soc_tco2e / 1000000),
    totalBiomass: numberFormat(i.toc_tco2e / 1000000),
    totalRing: removeDecimals(i.toc_tco2e / 1000000),
    biomass: numberFormat(i.bgb_tco2e / 1000000),
    avobeGround: numberFormat(i.agb_tco2e / 1000000)
  };
});


export const CONFIG = {
  parse: (data, yearSelected = 2016) => {
    const dataFiltered = filterData(data, yearSelected);
    const chartData = dataFiltered.length ? getData(dataFiltered) : '';
    return {
      chartData,
      coverage: biomassCoverage(data, yearSelected),
      totalValues: dataFiltered[0],
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
                    <text x={cx} y={cy - 30} lineheight="19" className="recharts-text recharts-label-medium" textAnchor="middle" dominantBaseline="central">
                      <tspan alignmentBaseline="middle" fill="rgba(0,0,0,0.85)" fontSize="14">Total</tspan>
                    </text>
                    <text x={cx} y={cy} className="recharts-text recharts-label-large" textAnchor="middle" dominantBaseline="central">
                      <tspan alignmentBaseline="middle" fill="rgba(0,0,0,0.85)" lineheight="29" fontSize="30">{dataFiltered[0].totalRing || ''}</tspan>
                    </text>
                    <text x={cx} y={cy + 30} className="recharts-text recharts-label-medium" textAnchor="middle" dominantBaseline="central">
                      <tspan alignmentBaseline="middle" fill="rgba(0,0,0,0.85)" fontSize="14">Mt CO₂e</tspan>
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
          fontSize: 9,
          content: (properties) => {
            const { payload } = properties;
            const groups = groupBy(payload, p => p.payload.label);
            return <WidgetLegend title="Total carbon density (t CO<sub>2</sub>e / ha)" groups={groups} />;
          }
        },
        tooltip: {
          cursor: false,
          content: ((properties) => {
            const { payload } = properties;
            if (!payload.length) return null;
            return (
              <WidgetTooltip
                style={{
                  flexDirection: 'column',
                  marginTop: '10px',
                  marginLeft: '-50px'
                }}
                payload={payload}
                settings={[
                  { label: 'Percentage', key: 'percentage', format: value => `${numberFormat(value)} %`, position: '_column' },
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
