import React from 'react';
import { format } from 'd3-format';
import groupBy from 'lodash/groupBy';
import WidgetTooltip from 'components/widget-tooltip';
import WidgetLegend from 'components/widget-legend';
import looseJsonParse from 'utils/loose-json-parse';

const numberFormat = format(',.2%');

const widgetData = ({ list }) => {
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
  }

  return list.flatMap((d) => {
    const year = new Date(d.date).getFullYear();
    
    if (!d.con_hotspot_summary_km2) return null;

    const hotSpotData = (typeof d.con_hotspot_summary_km2 === 'string') ? looseJsonParse(d.con_hotspot_summary_km2) : d.con_hotspot_summary_km2;

    const total = Object.values(hotSpotData).reduce((previous, current) => current + previous);
    return Object.entries(hotSpotData).map(([catKey, catValue]) => ({
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

export const CONFIG = {
  parse: data => ({
    chartData: widgetData(data),
    metadata: widgetMeta(data),
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
          const groups = groupBy(payload, p => p.payload.label);
          return <WidgetLegend groups={groups} />;
        }
      },
      tooltip: {
        cursor: false,
        content: (
          <WidgetTooltip
            style={{
              flexDirection: 'column',
              marginTop: '10px',
              marginLeft: '-50px'
            }}
            settings={[
              { key: 'label' },
              { label: 'Percentage:', key: 'percentage', format: percentage => `${numberFormat(percentage / 100)}`, position: '_column' },
              { label: 'Coverage:', key: 'coverage', format: coverage => `${(coverage)}km²`, position: '_column' }
            ]}
          />
        )
      }
    }
  })
};

export default CONFIG;
