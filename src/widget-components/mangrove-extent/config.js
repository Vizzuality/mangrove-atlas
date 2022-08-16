import React from 'react';
import groupBy from 'lodash/groupBy';
import WidgetTooltip from 'components/widget-tooltip';
import WidgetLegend from 'components/widget-legend';

import { format } from 'd3-format';

const tooltipFormat = format(',~');

const widgetData = (data, unit) => {
  const { list, metadata = {} } = data;
  if (list && list.length) {
    const {
      total_lenght,
      total_area,
    } = metadata;

    return list.filter(d => d.value).map((d) => {
      return ({
        x: d.year,
        y: d.value,
        color: '#06C4BD',
        percentage: (d.value / total_lenght) * 100,
        unit,
        area: d.value,
        coverage: d.value.toFixed(2),
        value: (d.value).toFixed(2),
        label: `Coastline coverage in ${d.year}`
      });
    });
  }

  return [];
};

const getDownloadData = ({ metadata, list }) => {
  const coastline = metadata.location_coast_length_m;
  const data = list.filter(l => l.year === 2016);
  return data.map(l => (
    {
      // Date: l.date,
      year: l.year,
      'Total coast length (m)': coastline,
      'Mangrove habitat area (m2)': l.area_m2,
      'Mangrove coastline coverage (m)': l.length_m,
      'Percentage (%)': l.length_m / coastline * 100
    }));
};

export const CONFIG = {
  parse: (data, unit) => ({
    chartData: widgetData(data, unit),
    metadata: data.metadata || {},
    downloadData: getDownloadData(data),
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
        maxWidth: 170,
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
          return <WidgetLegend groups={groups} unit={unit === 'km' ? 'km' : unit} direction="vertical" />;
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
              marginLeft: '5px',
            }}
            settings={[
              { key: 'label' },
              { label: 'Percentage:', key: 'percentage', format: percentage => `${percentage ? percentage.toFixed(2) : null} %`, position: '_column' },
              { label: 'Coverage:', key: 'coverage', format: coverage => `${unit === 'ha' ? tooltipFormat(coverage * 100) : tooltipFormat(coverage)} ${unit === 'ha' ? 'ha' : 'km'}`, position: '_column' },
            ]}
          />
        )
      }
    }
  })
};

export default CONFIG;
