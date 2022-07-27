
import React from 'react';

// utils
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import { format } from 'd3-format';

// components
import WidgetTooltip from 'components/widget-tooltip';
import WidgetLegend from 'components/widget-legend';
import { orderBy } from 'lodash';

const numberFormat = format(',.2f');
const removeDecimals = format(',.0f');
const COLORS = {
  '0--700': '#EEB66B',
  '700--1400': '#E68518',
  '1400--2100':'#B84E17',
  '2100--2800': '#933A06',
  '2800--3500': '#5C4A3D',
};

const getData = (data) => {
  if (!data || !data.length) return null;
  const dataFormatted = data[0].histogram;
  const total = Object.values(dataFormatted).reduce((previous, current) => current + previous);
  return Object.keys(dataFormatted).map((key, index) => ({
    label: key,
    value: dataFormatted[key],
    color: COLORS[key],
    percentage: dataFormatted[key] / total * 100,
  }));
};

const biomassCoverage = ({ list }, yearSelected) => {
  const yearData = list?.find(d => d.date
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

const getDownloadData = ({ list }) => {
  const data = list.filter(l => l.date.includes('2016'));
  const total = (Object.values(data[0].toc_hist_tco2eha)
    .reduce((previous, current) => current + previous)) / 100;

  // TO-DO: make dynamic depending on keys
  return data.map(l => (
    {
      Date: l.date,
      'Total organic carbon stored in mangroves estimation (tco2e)': l.toc_tco2e,
      'Amount stored in above-ground biomass (tco2e)': l.agb_tco2e,
      'Amount stored in the upper 1m of soil (tco2e)': l.soc_tco2e,
      'Histogram data 0--700': `${l.toc_hist_tco2eha['0--700']}
        - color: #EEB66B - percentage (%):
        ${(l.toc_hist_tco2eha['0--700']) / total}`,
      'Histogram data 700--1400': `${l.toc_hist_tco2eha['700--1400']}
        - color: #E68518 - percentage (%):
        ${l.toc_hist_tco2eha['700--1400'] / total}`,
      'Histogram data 1400-2100': `${l.toc_hist_tco2eha['1400--2100']}
        - color: #B84E17 - percentage (%):
        ${l.toc_hist_tco2eha['1400--2100'] / total}`,
      'Histogram data 2100-2800': `${l.toc_hist_tco2eha['2100--2800']}
        - color: #933A06 - percentage (%):
        ${l.toc_hist_tco2eha['2100--2800'] / total}`,
      'Histogram data 2800-3500': `${l.toc_hist_tco2eha['2800--3500']}
        - color: #5C4A3D - percentage (%):
        ${l.toc_hist_tco2eha['2800--3500'] / total}`,
    }));
};

export const CONFIG = {
  parse: (data, yearSelected = 2016) => {
    const dataFiltered = filterData(data, yearSelected);
    const chartData = dataFiltered.length ? getData(dataFiltered) : '';
    const downloadData = getDownloadData(data);
    return {
      chartData: orderBy(chartData, d => Number(d.label.split('--', 1)), 'desc'),
      coverage: biomassCoverage(data, yearSelected),
      downloadData,
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
          align: 'right',
          verticalAlign: 'middle',
          layout: 'vertical',
          fontSize: 9,
          content: (properties) => {
            const { payload } = properties;
            const groups = groupBy(payload, p => p.value);
            return <WidgetLegend widgetSpecific="blue-carbon" title="Total carbon density (t CO<sub>2</sub>e / ha)" groups={groups} />;
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
