import React from 'react';
import { format } from 'd3-format';
import groupBy from 'lodash/groupBy';
import WidgetTooltip from 'components/widget-tooltip';
import WidgetLegend from 'components/widget-legend';

const numberFormat = format(',.2%');

const widgetData = ({ list }) => {

  const categoriesData = {
    'Benefits From Conservation' : {
      color: '#86CEE8',
      label: 'Benefits From Conservation' 
    },
    'Requires Conservation' : {
      color: '#ED896C',
      label: 'Requires Conservation'
    },
    'Requires Monitoring' : { 
      color: '#FDC067',
      label: 'Requires Monitoring' 
    },
    'Stable Ecosystem' : {
      color: '#0C3B6D',
      label: 'Stable Ecosystem' 
    },
    'Monitoring Advised' : {
      color: '#1B9ACC',
      label: 'Monitoring Advised'
    }
  }

  return list.flatMap((d) => {
    const year = new Date(d.date).getFullYear();
    if (!d.con_hotspot_summary_km2) return null;
    const total = Object.values(d.con_hotspot_summary_km2).reduce((previous, current) => current += previous);
    return Object.entries(d.con_hotspot_summary_km2).map(([catKey, catValue]) => ({
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
      height: 250,
      margin: { top: 20, right: 0, left: 0, bottom: 0 },
      xKey: 'percentage',
      yKeys: {
        pies: {
          y: {
            cx: '50%',
            cy: '50%',
            dataKey: 'percentage',
            nameKey: 'label',
            innerRadius: '60%',
            outerRadius: '80%'
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
              color: 'black',
              backgroundColor: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              marginLeft: '10px',
            }}
            settings={[
              { key: 'label' },
              { key: 'percentage', format: percentage => `Percentage: ${numberFormat(percentage / 100)}` },
              { key: 'coverage', format: coverage => `Coverage: ${(coverage)}km` }
            ]}
          />
        )
      }
    }
  })
};

export default CONFIG;
