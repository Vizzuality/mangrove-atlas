import React from 'react';

// utils
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import { format } from 'd3-format';


// components
import WidgetTooltip from 'components/widget-tooltip';
import WidgetLegend from 'components/widget-legend';
import WidgetCustomLabel from 'components/widget-custom-label';

const numberFormat = format(',.3r');

const categoriesData = {
  '0–50': {
    color: '#EAF19D',
    label: '0 – 50 t ha-1'
  },
  '50–100': {
    color: '#B8E98E',
    label: '50 – 100 t ha-1'
  },
  '100–150': {
    color: '#1B97C1',
    label: '100 – 150 t ha-1'
  },
  '150–200': {
    color: '#1C52A3',
    label: '150 – 200 t ha-1'
  },
  '200–250': {
    color: '#13267F',
    label: '200 – 250 t ha-1'
  }
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

  const barsData = data[0].map(value => value[1]);
  const total = barsData.reduce((previous, current) => current + previous);

  const chunkedData = chunk(barsData, 5);
  let formattedData = chunkedData.map(
    r => (r.reduce((previous, current) => current + previous))
  );

  formattedData = formattedData.map(d => d / total);

  return [
    { x: Number(selectedYear), y: formattedData[0] * 100, label: '0–50 t / ha', value: formattedData[0] * 100, color: '#EAF19D', percentage: formattedData[0] / total * 100 },
    { x: Number(selectedYear), y: formattedData[1] * 100, label: '50–100 t / ha', value: formattedData[1] * 100, color: '#B8E98E', percentage: formattedData[1] / total * 100 },
    { x: Number(selectedYear), y: formattedData[2] * 100, label: '100–150 t / ha', value: formattedData[2] * 100, color: '#1B97C1', percentage: formattedData[2] / total * 100 },
    { x: Number(selectedYear), y: formattedData[3] * 100, label: '150–200 t / ha', value: formattedData[3] * 100, color: '#1C52A3', percentage: formattedData[3] / total * 100 },
    { x: Number(selectedYear), y: formattedData[4] * 100, label: '200–250 t / ha', value: formattedData[4] * 100, color: '#13267F', percentage: formattedData[4] / total * 100 },
  ];
};

const biomassCoverage = ({ list }, yearSelected) => {
  const yearData = list.find(d => d.date
    .includes(yearSelected));
  if (!yearData) return null;
  return yearData.agb_mgha_1.toFixed(2);
};

const filterData = ({ list }, yearSelected) => sortBy(
  list
    .filter(d => d.agb_mgha_1 !== null
      && d.agb_hist_mgha_1 !== null
      && d.date.includes(yearSelected)),
  ['date']
).map(i => i.agb_hist_mgha_1);


const CONFIG = {
  parse: (data, yearSelected = 2016) => {
    const dataFiltered = filterData(data, yearSelected);
    return {
      chartData: getData(dataFiltered),
      metadata: widgetMeta(filterData),
      coverage: biomassCoverage(data, yearSelected),
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
            return <WidgetLegend groups={groups} type="height" />;
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
                  { label: 'Percentage:', key: 'value', format: value => `${value ? (value).toFixed(2) : null} %`, position: '_column' },
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
