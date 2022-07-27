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

const chunk = (array, size) => {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i++) {
    const last = chunkedArr[chunkedArr.length - 1];
    if (!last || last.length === size) {
      chunkedArr.push([array[i]]);
    } else {
      last.push(array[i]);
    }
  }
  return chunkedArr;
};

const getData = (data, selectedYear) => {
  if (!data || !data.length) return null;
  const filteredData = data.filter(({ date }) => date.includes(selectedYear))[0].agb_hist_mgha_1;
  const barsData = filteredData?.map(value => value[1]);
  const total = barsData.reduce((previous, current) => current + previous);

  const chunkNumber = barsData.length / 5;
  const chunkedData = chunk(barsData, chunkNumber);
  let formattedData = chunkedData.map(
    r => (r.reduce((previous, current) => current + previous))
  );

  formattedData = formattedData.map(d => d / total);
  return [
    { x: Number(selectedYear), y: formattedData[0] * 100, label: '0–250', percentage: formattedData[0] * 100, color: '#EAF19D', value: formattedData[0] / total * 100 },
    { x: Number(selectedYear), y: formattedData[1] * 100, label: '250-500', percentage: formattedData[1] * 100, color: '#B8E98E', value: formattedData[1] / total * 100 },
    { x: Number(selectedYear), y: formattedData[2] * 100, label: '500-750', percentage: formattedData[2] * 100, color: '#1B97C1', value: formattedData[2] / total * 100 },
    { x: Number(selectedYear), y: formattedData[3] * 100, label: '750-1000', percentage: formattedData[3] * 100, color: '#1C52A3', value: formattedData[3] / total * 100 },
    { x: Number(selectedYear), y: formattedData[4] * 100, label: '1000-1250', percentage: formattedData[4] * 100, color: '#13267F', value: formattedData[4] / total * 100 },
  ];
};

const biomassCoverage = ({ list }, yearSelected) => {
  const yearData = list?.find(d => d.date
    .includes(yearSelected));
  if (!yearData) return null;
  return yearData.agb_mgha_1.toFixed(2);
};

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
  parse: (data, yearSelected) => {
    const chartData = getData(data, yearSelected)?.filter(d => d.percentage !== 0);
    const coverage = biomassCoverage(data, yearSelected);
    const downloadData = getDownloadData(chartData, yearSelected, coverage);

    return {
      chartData,
      metadata: widgetMeta(data),
      coverage,
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
