
import React from 'react';
import groupBy from 'lodash/groupBy';

// Components
import WidgetLegend from 'components/widget-legend';
import WidgetTooltip from 'components/widget-tooltip';

// Utils
import { format } from 'd3-format';
import sortBy from 'lodash/sortBy';
import moment from 'moment';
import looseJsonParse from 'utils/loose-json-parse';

const numberFormat = format(',.3r');

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
  const barsData = (Object.values(looseJsonParse(barValues)));
  const total = barsData.reduce((previous, current) => current + previous)
  const chunkedData = chunk(barsData, 5)
  let formattedData = chunkedData.map(
    r => (r.reduce((previous, current) => current + previous))
  );

  formattedData = formattedData.map(data => data / total)
  return formattedData;
};


const histogramData = (data) => {
  if (!data) {
    return null;
  }

  const histogram = data.map(d => (
    {
      year: moment(d.date).year(),
      '0 50': getBars(d.agb_hist_mgha_1)[0] * 100,
      '50 100': getBars(d.agb_hist_mgha_1)[1] * 100,
      '100 150': getBars(d.agb_hist_mgha_1)[2] * 100,
      '150 200': getBars(d.agb_hist_mgha_1)[3] * 100,
      '200 250': getBars(d.agb_hist_mgha_1)[4] * 100,
    }
  ));
  return histogram;
};

const filterData = data => sortBy(data.filter(d => d.agb_mgha_1 !== null && d.agb_hist_mgha_1 !== null), ['date']);

const sentenceData = data => ({
  height: data.map(d => d.agb_mgha_1).reduce((previous, current) => current + previous, 0),
  year: data.map(d => moment(d.date).year())
});

const metaData = data => Array.from(new Set(
  data.map(d => moment(d.date).year())
));

export const CONFIG = {
  parse: (data) => {
    {
      const dataFiltered = filterData(data);
      const metadata = metaData(dataFiltered);

      return {
        biomassData: sentenceData(dataFiltered),
        metadata,
        chartData: histogramData(dataFiltered),
        chartConfig: {
          height: 300,
          cartesianGrid: {
            vertical: false,
            horizontal: true,
            strokeDasharray: '5 20'
          },
          margin: { top: 0, right: 50, left: 0, bottom: 0 },
          xKey: 'year',
          yKeys: {
            bars:
            {
              '0 50':
              {
                stackId: 'bar',
                fill: '#EAF19D',
                stroke: '#EAF19D',
                isAnimationActive: false
              },
              '50 100':
              {
                stackId: 'bar',
                fill: '#B8E98E',
                stroke: '#B8E98E',
                isAnimationActive: false
              },
              '100 150':
              {
                stackId: 'bar',
                fill: '#1B97C1',
                stroke: '#1B97C1',
                isAnimationActive: false
              },
              '150 200':
              {
                stackId: 'bar',
                fill: '#1C52A3',
                stroke: '#1C52A3',
                isAnimationActive: false
              },
              '200 250':
              {
                stackId: 'bar',
                fill: '#13267F',
                stroke: '#13267F',
                isAnimationActive: false
              }
            }
          },
          referenceLines: [{
            y: 0,
            stroke: 'black',
            strokeDasharray: 'solid',
            fill: 'black',
            opacity: '1',
            label: null
          }],
          xAxis: {
            tick: {
              x: {
                x: 0,
                stroke: 'solid'
              },
              fontSize: 12,
              lineHeight: 20,
              fill: 'rgba(0,0,0,0.2)',
              stroke: 'rgba(0,0,0,0.2)',
              textShadow: '0 2px 4px 0 rgba(0,0,0,0.5)'
            },
            ticks: metadata,
            domain: [1, 100],
            interval: 0
          },
          yAxis: {
            tick: {
              fontSize: 12, fill: 'rgba(0,0,0,0.54)'
            },
            domain: [0, 100],
            interval: 0,
            orientation: 'right',
            label: {
              content: () => (
                <g>
                  <text
                    x={415}
                    y={25}
                    style={
                      { position: 'absolute' }
                    }
                    fontSize={11}
                    fill="rgba(0,0,0,0.54)"
                  >
                    %
                  </text>
                </g>
              )
            },
            type: 'number'
          },
          legend: {
            position: 'relative',
            verticalAlign: 'top',
            top: 10,
            content: (properties) => {
              const { payload } = properties;
              const groups = groupBy(payload, p => p.payload);
              return <WidgetLegend type="height" groups={groups} />;
            }
          },
          tooltip: {
            cursor: false,
            content: (
              <WidgetTooltip
                type="column"
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  flexDirection: 'column'
                }}
                settings={[
                  { label: '200 250:', color: '#13267F', key: '200 250', format: value => `${numberFormat(value) * 100} `, position: '_column', type: '_stacked' },
                  { label: '150 200:', color: '#1C52A3', key: '150 200', format: value => `${numberFormat(value) * 100} `, position: '_column', type: '_stacked' },
                  { label: '100 150:', color: '#1B97C1', key: '100 150', format: value => `${numberFormat(value) * 100} `, position: '_column', type: '_stacked' },
                  { label: '50 100:', color: '#B8E98E', key: '50 100', format: value => `${numberFormat(value) * 100} `, position: '_column', type: '_stacked' },
                  { label: '0 50:', color: '#EAF19D', key: '0 50', format: value => `${numberFormat(value) * 100} `, position: '_column', type: '_stacked' },
                ]}
                label={{ key: 'name' }}
              />
            )
          }
        },
      };
    }
  }
};

export default CONFIG;
