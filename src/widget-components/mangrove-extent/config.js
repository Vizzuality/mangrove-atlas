import React from 'react';
import groupBy from 'lodash/groupBy';
import WidgetTooltip from 'components/widget-tooltip';
import WidgetLegend from 'components/widget-legend';

import { format } from 'd3-format';


const numberFormat = format(',.2f');

const widgetData = ({ list, metadata }) => {
  if (list && list.length) {
    const { location_coast_length_m: total } = metadata;

    return list.filter(d => d.length_m).map((d) => {
      const year = new Date(d.date).getFullYear();

      return ({
        x: Number(year),
        y: d.length_m,
        color: '#06C4BD',
        percentage: d.length_m / total * 100,
        unit: '%',
        coverage: (d.length_m / 1000).toFixed(2),
        value: (d.length_m).toFixed(2),
        label: `Mangroves in ${year}`
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
  parse: data => ({
    chartData: widgetData(data),
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
            paddingAngle: 3,
            dataKey: 'percentage',
            nameKey: 'label',
            innerRadius: '55%',
            outerRadius: '80%',
            cornerRadius: 4,
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
          const groups = groupBy(payload.map(item => ({
            ...item,
            payload: {
              ...item.payload,
              y: (item.payload.y / 1000).toFixed(2)
            }
          })), p => p.payload.label);
          return <WidgetLegend groups={groups} unit="km²" />;
        }
      },
      tooltip: {
        cursor: false,
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
              { label: 'Coverage:', key: 'coverage', format: coverage => `${(numberFormat(coverage))} km²`, position: '_column' }

            ]}
          />
        )
      }
    }
  })
};

export default CONFIG;
