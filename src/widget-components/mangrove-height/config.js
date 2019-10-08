import React from 'react';
import groupBy from 'lodash/groupBy';
import { format } from 'd3-format';
import moment from 'moment';
import WidgetLegend from 'components/widget-legend';
import WidgetTooltip from 'components/widget-tooltip';
import looseJsonParse from 'utils/loose-json-parse';

const numberFormat = format(',.3r');

const chunk = (array, size) => {
  const chunked_arr = [];
  for (let i = 0; i < array.length; i++) {
    const last = chunked_arr[chunked_arr.length - 1];
    if (!last || last.length === size) {
      chunked_arr.push([array[i]]);
    } else {
      last.push(array[i]);
    }
  }
  return chunked_arr;
}

let maxValue = 0;

const getBars = (barValues) => {
  if (!barValues) return null;
  const barsData = (Object.values(looseJsonParse(barValues)));
  const chnkedData = chunk(barsData, 5)
  const formattedData = chnkedData.map(
    r => numberFormat((r.reduce((previous, current) => current + previous) / 1000))
  );
  maxValue = Math.max(...formattedData)
  return formattedData;
}


const histogramData = (data) => {
  if (!data) {
    return null;
  }

  const histogram = data.map(d => (
    {
      year: moment(d.date).year(),
      '0 5': getBars(d.hmax_hist_m)[0],
      '5 10': getBars(d.hmax_hist_m)[1],
      '10 15': getBars(d.hmax_hist_m)[2],
      '15 20': getBars(d.hmax_hist_m)[3],
      '20 25': getBars(d.hmax_hist_m)[4],
    }
  ));
  return histogram;
}

const filterData = data => data.filter(d => d.hmax_m !== null && d.hmax_hist_m !== null);

const sentenceData = data => ({
  height: data.map(d => d.hmax_m).reduce((previous, current) => current + previous, 0),
  year: data.map(d => moment(d.date).year())
});

const metaData = data => Array.from(new Set(
  data.map(d => moment(d.date).year())
));

export const CONFIG = {
  parse: (data) => {
    {
      const dataFiltered = filterData(data);

      return {

        chartData: histogramData(dataFiltered),
        heightData: sentenceData(dataFiltered),
        metadata: metaData(dataFiltered),
        chartConfig: {
          cartesianGrid: {
            vertical: false,
            horizontal: true,
            strokeDasharray: '5 20'
          },
          margin: { top: 10, right: 50, left: 0, bottom: 0 },
          xKey: 'year',
          yKeys: {
            bars:
            {
              '0 5':
              {
                stackId: 'bar',
                fill: '#C9BB42',
                stroke: '#C9BB42',
                isAnimationActive: false
              },
              '5 10':
              {
                stackId: 'bar',
                fill: '#8BA205',
                stroke: '#8BA205',
                isAnimationActive: false
              },
              '10 15':
              {
                stackId: 'bar',
                fill: '#428710',
                stroke: '#428710',
                isAnimationActive: false
              },
              '15 20':
              {
                stackId: 'bar',
                fill: '#0A6624',
                stroke: '#0A6624',
                isAnimationActive: false
              },
              '20 25':
              {
                stackId: 'bar',
                fill: '#103C1F',
                stroke: '#103C1F',
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
              fontSize: 12,
              lineHeight: 20,
              fill: 'rgba(0,0,0,0.2)',
              stroke: 'rgba(0,0,0,0.2)',
              textShadow: '0 2px 4px 0 rgba(0,0,0,0.5)'
            },
            ticks: metaData(data),
            domain: [metaData(data)[0], metaData(data)[metaData(data).length - 1]],
            interval: 0
          },
          yAxis: {
            tick: {
              fontSize: 12, fill: 'rgba(0,0,0,0.54)'
            },
            domain: [0, maxValue + 50],
            interval: 0,
            orientation: 'right',
            label: {
              content: () => (
                <g>
                  <text
                    x='95%'
                    y={50}
                    style={{ marginRight: 30 }}
                    fontSize={13}
                    fill="rgba(0,0,0,0.54)"
                  >
                    km
              </text>
                </g>
              )
            },
            type: 'number'
          },
          legend: {
            align: 'left',
            verticalAlign: 'top',
            layout: 'horizontal',
            height: 80,
            top: 0,
            left: 0,
            position: 'relative',
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
                type='column'
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  flexDirection: 'column'
                }}
                settings={[
                  { label: '0 5:', color: '#C9BB42', key: '0 5', format: value => `${numberFormat(value)}`, position: '_column', type: '_stacked' },
                  { label: '5 10:', color: '#8BA205', key: '5 10', format: value => `${numberFormat(value)}`, position: '_column', type: '_stacked' },
                  { label: '10 15:', color: '#428710', key: '10 15', format: value => `${numberFormat(value)}`, position: '_column', type: '_stacked' },
                  { label: '15 20:', color: '#0A6624', key: '15 20', format: value => `${numberFormat(value)}`, position: '_column', type: '_stacked' },
                  { label: '20 25:', color: '#103C1F', key: '20 25', format: value => `${numberFormat(value)}`, position: '_column', type: '_stacked' },
                ]}
                label={{ key: 'name' }}
              />
            )
          }
        },
      }
    }
  }
};


export default CONFIG;
