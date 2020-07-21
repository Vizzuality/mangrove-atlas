import React from 'react';
import groupBy from 'lodash/groupBy';
import WidgetTooltip from 'components/widget-tooltip';
import WidgetLegend from 'components/widget-legend';

import { format } from 'd3-format';


const numberFormat = format(',.2f');

const widgetData = (data, unit) => {
  const { list, metadata } = data;
  if (list && list.length) {
      const { location_coast_length_m: total } = metadata;

    return list.filter(d => d.length_m).map((d) => {
      const year = new Date(d.date).getFullYear();

      return ({
        x: Number(year),
        y: d.length_m,
        color: '#06C4BD',
        percentage: d.length_m / total * 100,
        unit,
        area: d.area_m2,
        coverage: (d.length_m / 1000).toFixed(2),
        value: (d.length_m).toFixed(2),
        label: `Coastline coverage in ${year}`
      });
    });
  }

  return [];
};

const widgetMeta = ({ list, metadata }) => {
  if (list && list.length && metadata) {
    return {
      years: Array.from(
        new Set(
          list.filter(d => d.length_m).map(d => new Date(d.date).getFullYear())
        )
      ),
      total: metadata.location_coast_length_m
    };
  }

  return {
    years: [],
    total: null
  };
};

export const CONFIG = {
  parse: (data, unit) => ({
    chartData: widgetData(data, unit),
    metadata: widgetMeta(data),
    chartConfig: {
      type: 'pie',
      layout: 'centric',
      height: 250,
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
            isAnimationActive: false
          }
        }
      },
      legend: {
        align: 'left',
        verticalAlign: 'middle',
        layout: 'vertical',
        content: (properties) => {
          const { payload } = properties;
          const groups = groupBy(payload.map((item) => {
            const value = (item.payload.unit === 'ha' && item.payload.coverage * 100)
              || (item.payload.unit === '%' && item.payload.percentage)
              || (item.payload.unit === 'km' && Number(item.payload.coverage));
            return {
              ...item,
              payload: {
                ...item.payload,
                y: value,
              }
            };
          }), p => p.payload.label);
          return <WidgetLegend groups={groups} unit={unit === 'km' ? 'km' : unit} />;
        }
      },
      tooltip: {
        cursor: false,
        coordinate: { x: -10, y: -10 },
        active: true,
        content: (
          <WidgetTooltip
            style={{
              flexDirection: 'column',
              justifyContent: 'space-around',
              marginLeft: '10px',
            }}
            settings={[
              { key: 'label' },
              { label: 'Percentage:', key: 'percentage', format: percentage => `${percentage ? percentage.toFixed(2) : null} %`, position: '_column' },
              { label: 'Coverage:', key: 'coverage', format: coverage => `${unit === 'ha' ? numberFormat(coverage * 100) : numberFormat(coverage)} ${unit === 'ha' ? 'ha' : 'km'}`, position: '_column' },
            ]}
          />
        )
      }
    }
  })
};

export default CONFIG;
