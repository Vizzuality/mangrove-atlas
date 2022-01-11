
import React from 'react';

// utils
import sortBy from 'lodash/sortBy';
import { format } from 'd3-format';

// components
import WidgetTooltip from 'components/widget-tooltip';

const numberFormat = format(',.2f');

const getData = (data) => {
  if (!data) return [];
  return ({
    x: Number(data.data.year),
    y: data.data.total,
    color: '#06C4BD',
    percentage: data.data.percentage,
    year: data.data.year,
    total: data.data.total,
    unit: data.metadata.unit,
    protected: data.data.protected,
  });
};

// const filterData = ({ list }, yearSelected) => sortBy(
//   list
//     .filter(d => d.toc_hist_tco2eha
//       && d.soc_tco2e
//       && d.toc_tco2e
//       && d.bgb_tco2e
//       && d.agb_tco2e
//       && d.date.includes(yearSelected)),
//   ['date']
// ).map((i) => {
//   return {
//     histogram: i.toc_hist_tco2eha,
//     soils: numberFormat(i.soc_tco2e / 1000000),
//     totalBiomass: numberFormat(i.toc_tco2e / 1000000),
//     totalRing: removeDecimals(i.toc_tco2e / 1000000),
//     biomass: numberFormat(i.bgb_tco2e / 1000000),
//     avobeGround: numberFormat(i.agb_tco2e / 1000000)
//   };
// });s

export const CONFIG = {
  parse: (data, yearSelected = 2016) => {
    // const dataFiltered = filterData(data, yearSelected);
    // const chartData = dataFiltered.length ? getData(dataFiltered) : '';
    const chartData = getData(data);
    // const downloadData = getDownloadData(data);
    return {
      chartData,
      // coverage: biomassCoverage(data, yearSelected),
      // downloadData,
      // totalValues: dataFiltered[0],
      chartConfig: {
        type: 'pie',
        layout: 'centric',
        margin: { top: 20, right: 0, left: 0, bottom: 0 },
        xKey: 'percentage',
        yKeys: {
          pies: {
            coverage: {
              cx: '50%',
              cy: '50%',
              paddingAngle: 2,
              dataKey: 'percentage',
              nameKey: 'label',
              innerRadius: '55%',
              outerRadius: '80%',
              isAnimationActive: false,
              customLabel: ({ viewBox }) => {
                const { cx, cy } = viewBox;
                return (
                  <g>
                    <text x={cx} y={cy} className="recharts-text recharts-label-large" textAnchor="middle" dominantBaseline="central">
                      {/* <tspan alignmentBaseline="middle" fill="rgba(0,0,0,0.85)" lineheight="29" fontSize="30">{dataFiltered[0].totalRing || ''}</tspan> */}
                      <tspan alignmentBaseline="middle" fill="rgba(0,0,0,0.85)" lineheight="29" fontSize="30">{data.total || ''}</tspan>
                      <tspan alignmentBaseline="middle" fill="rgba(0,0,0,0.85)" fontSize="26">{data.data.percentage}%</tspan>
                    </text>
                  </g>
                );
              }
            }
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
