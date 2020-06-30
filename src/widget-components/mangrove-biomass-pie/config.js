import React from 'react';
import groupBy from 'lodash/groupBy';
import WidgetTooltip from 'components/widget-tooltip';
import WidgetLegend from 'components/widget-legend';
import looseJsonParse from 'utils/loose-json-parse';
import moment from 'moment';

const categoriesData = {
  '0–50': {
    color: '#EAF19D',
    label: '0 – 50'
  },
  '50–100': {
    color: '#B8E98E',
    label: '50 – 100'
  },
  '100–150': {
    color: '#1B97C1',
    label: '100 – 150'
  },
  '150–200': {
    color: '#1C52A3',
    label: '150 – 200'
  },
  '200–250': {
    color: '#13267F',
    label: '200 – 250'
  }
};

const widgetData = ({ list }) => list.flatMap((d) => {
  const year = new Date(d.date).getFullYear();

  if (!d.con_hotspot_summary_km2) return null;

  const hotSpotData = d.con_hotspot_summary_km2;

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

const getBars = (barValues) => {
  if (!barValues) return null;
  const barsData = Object.values(looseJsonParse(barValues));
  const total = barsData.reduce((previous, current) => current + previous);
  const chunkedData = chunk(barsData, 5);
  let formattedData = chunkedData.map(
    r => (r.reduce((previous, current) => current + previous))
  );

  formattedData = formattedData.map(data => data / total);
  return formattedData;
};

const histogramData = (data) => {
  if (!data) {
    return null;
  }

  console.log(data)

  const histogram = data.list.map(d => (
    {
      year: moment(d.date).year(),
      '0–50': getBars(d.agb_hist_mgha_1)[0] * 100,
      '50–100': getBars(d.agb_hist_mgha_1)[1] * 100,
      '100–150': getBars(d.agb_hist_mgha_1)[2] * 100,
      '150–200': getBars(d.agb_hist_mgha_1)[3] * 100,
      '200–250': getBars(d.agb_hist_mgha_1)[4] * 100,
    }
  ));
  console.log(histogram, '************')
  return histogram;
};

const filterData = data => sortBy(data.filter(d => d.agb_mgha_1 !== null && d.agb_hist_mgha_1 !== null), ['date']);

const biomassCoverage = (data, yearSelected) => {
  const yearData = data.find(d => d.date
    .includes(yearSelected));
  if (!yearData) return null;
  return yearData.agb_mgha_1.toFixed(2);
};

const metaData = data => Array.from(new Set(
  data.map(d => moment(d.date).year())
));

export const CONFIG = {
  parse: data => ({
    chartData: histogramData(data),
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
          return <WidgetLegend groups={groups} unit="km²" />;
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
              { label: 'Percentage:', key: 'percentage', format: percentage => `${percentage ? (percentage).toFixed(2) : null} %`, position: '_column' },
              { label: 'Coverage:', key: 'coverage', format: coverage => `${(coverage)} km²`, position: '_column' }
            ]}
          />
        )
      }
    }
  })
};

export default CONFIG;
