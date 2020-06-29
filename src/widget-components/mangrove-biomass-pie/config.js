import React from 'react';
import groupBy from 'lodash/groupBy';
import WidgetTooltip from 'components/widget-tooltip';
import WidgetLegend from 'components/widget-legend';
import looseJsonParse from 'utils/loose-json-parse';


import { format } from 'd3-format';


const numberFormat = format(',.2f');

const categoriesData = {
  'Benefits From Conservation': {
    color: '#86CEE8',
    label: 'Benefits From Conservation'
  },
  'Requires Conservation': {
    color: '#ED896C',
    label: 'Requires Conservation'
  },
  'Requires Monitoring': {
    color: '#FDC067',
    label: 'Requires Monitoring'
  },
  'Stable Ecosystem': {
    color: '#0C3B6D',
    label: 'Stable Ecosystem'
  },
  'Monitoring Advised': {
    color: '#1B9ACC',
    label: 'Monitoring Advised'
  }
};

const scopeKeyMap = new Map([
  ['short', 'ST_advice'],
  ['medium', 'MT_advice'],
  ['long', 'LT_advice']
]);

const widgetData = ({ list }, { scope }) => list.flatMap((d) => {
  const year = new Date(d.date).getFullYear();

  if (!d.con_hotspot_summary_km2) return null;

  const hotSpotData = (typeof d.con_hotspot_summary_km2 === 'string')
    ? looseJsonParse(d.con_hotspot_summary_km2)[scopeKeyMap.get(scope)]
    : d.con_hotspot_summary_km2;

  const total = Object.values(hotSpotData).reduce((previous, current) => current + previous);

  return (typeof hotSpotData === 'string')
    ? []
    : Object.entries(hotSpotData).map(([catKey, catValue]) => ({
      x: Number(year),
      y: catValue,
      color: categoriesData[catKey].color || '',
      label: categoriesData[catKey].label,
      value: catValue,
      percentage: (catValue / total) * 100,
      unit: '%',
      coverage: (catValue).toFixed(2)
    }));
});

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
            innerRadius: '60%',
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
          const groups = groupBy(payload.map(item => ({
            ...item,
            payload: {
              ...item.payload,
              y: (item.payload.y / 1000).toFixed(2)
            }
          })), p => p.payload.label);
          return <WidgetLegend groups={groups} unit="km" />;
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
              { label: 'Coverage:', key: 'coverage', format: coverage => `${(numberFormat(coverage))} km`, position: '_column' }

            ]}
          />
        )
      }
    }
  })
};

export default CONFIG;
