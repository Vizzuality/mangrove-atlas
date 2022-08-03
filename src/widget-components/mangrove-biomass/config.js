import React from 'react';

// utils
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';

// components
import WidgetTooltip from 'components/widget-tooltip';
import WidgetLegend from 'components/widget-legend';

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



const getData = (data, selectedYear = 2020) => {
  if (!data || !data.length) return null;
  const COLORS = ['#EAF19D', '#B8E98E', '#1B97C1', '#1C52A3', '#13267F']
  const barsValues = data.map(({ value })=> value);
  const total = barsValues.reduce((previous, current) => current + previous);
  return data.map((d, index) => ({
    x: selectedYear,
    y: d.value * 100, label: d.indicator, percentage: d.value * 100, color: COLORS[index], value: d.value / total * 100,

  }))
};

const filterData = ({ list }, yearSelected) => sortBy(
  list
    .filter(d => d.agb_mgha_1 !== null
      && d.agb_hist_mgha_1 !== null
      && d.date.includes(yearSelected)),
  ['date']
).map(i => i.agb_hist_mgha_1);

const getDownloadData = (chartData, date, coverage) => {
  if (!chartData) return null;
  return chartData.map(d => ({
    Date: date,
    'Mangrove aboveground biomass density (t / ha)': coverage,
    Label: d.label,
    'Aboveground biomass density (t / ha)': d.value,
    Percentage: d.percentage,
    Color: d.color
  }));
};

const CONFIG = {
  parse: (data, yearSelected = 2016, coverage) => {
    const chartData = getData(data);
    const downloadData = getDownloadData(chartData, yearSelected, coverage);

    return {
      chartData,
      metadata: widgetMeta(filterData),
      downloadData,
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
              dataKey: 'percentage',
              nameKey: 'label',
              paddingAngle: 2,
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
            return <WidgetLegend title="Aboveground biomass density </br>(t / ha)" groups={groups} type="height" />;
          }
        },
        tooltip: {
          cursor: false,
          content: (properties) => {
            const { payload } = properties;
            return (
              <WidgetTooltip
                payload={payload}
                style={{
                  flexDirection: 'column',
                  marginTop: '10px',
                  marginLeft: '-50px'
                }}
                settings={[
                  { key: 'label' },
                  { label: 'Percentage:', key: 'percentage', format: value => `${value ? (value).toFixed(2) : null} %`, position: '_column' },
                ]}
              />
            );
          }
        }
      }
    };
  }
};

export default CONFIG;
