import React from 'react';
import groupBy from 'lodash/groupBy';
import { format } from 'd3-format';
import sortBy from 'lodash/sortBy';
import WidgetLegend from 'components/widget-legend';
import WidgetTooltip from 'components/widget-tooltip';
import realData from './constants';

const numberFormat = format(',.3r');

const months = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
];

const getStops = () => {
  //const colorSchema = ['#E8C869', 'F47F24', 'EC4A40', '#D232A9'];
  const colorSchema = ['FFC200', '#EB4444', '#C72BD6'];

  const gradient = colorSchema.map((d, index) => (
    {
      offset: `${index / (colorSchema.length - 1) * 100}%`,
      stopColor: d,
      //stopOpacity: 0.5
    }
  ));
  return gradient;
};

const getData = data => sortBy(data.map((d) => {
  const date = months.find(month => month.value === new Date(d.date.value).getMonth() + 1);
  const monthsConversion = {
    January: 'J',
    February: 'F',
    March: 'M',
    April: 'A',
    May: 'M',
    June: 'J',
    July: 'J',
    August: 'A',
    September: 'S',
    October: 'O',
    November: 'N',
    December: 'D'
  };

  return (
    {
      month: date.value,
      name: monthsConversion[date.label],
      alerts: d.count
    }
  );
}), ['month']);


const getTotal = data => data.reduce((previous, current) => current.count + previous, 0)

export const CONFIG = {
  parse: (data, startMonth, endMonth) => {
    const dataFiltered = realData
      .filter(d => endMonth >= new Date(d.date.value).getMonth() + 1 && new Date(d.date.value).getMonth() + 1 >= startMonth)
    return {
      chartData: getData(dataFiltered),
      total: getTotal(dataFiltered),
      chartConfig: {
        height: 250,
        cartesianGrid: {
          vertical: false,
          horizontal: false,
        },
        margin: { top: 20, right: 10, left: 10, bottom: 20 },
        gradients: {
          key: {
            attributes: {
              id: 'colorAlerts',
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: getStops(dataFiltered),
          }
        },
        patterns: {
          diagonal: {
            attributes: {
              id: 'diagonal-stripe-1',
              patternUnits: 'userSpaceOnUse',
              patternTransform: 'rotate(-45)',
              width: 4,
              height: 6
            },
            children: {
              rect2: {
                tag: 'rect',
                x: 0,
                y: 0,
                width: 4,
                height: 6,
                transform: 'translate(0,0)',
                fill: '#d2d2d2'
              },
              rect: {
                tag: 'rect',
                x: 0,
                y: 0,
                width: 3,
                height: 6,
                transform: 'translate(0,0)',
                fill: '#fff'
              }
            }
          }
        },
        referenceAreas: [
          {
            x1: 0,
            x2: 11,
            y1: -100,
            y2: 480,
            fill: 'url(#diagonal-stripe-1) #000'
          },
          {
            x1: startMonth,
            x2: endMonth,
            y1: -100,
            y2: 480,
            fill: '#fff',
            fillOpacity: 1
          }
        ],
        xKey: 'name',
        yKeys: {
          lines: {
            alerts: {
              stroke: 'url(#colorAlerts)',
              strokeWidth: 2.5,
              isAnimationActive: false
            }
          },
        },
        xAxis: {
          tick: {
            strokeHeight: 5,
            strokeWidth: 1,
            fill: 'rgba(0,0,0,0.54)'
          }
        },
        yAxis: {
          tick: {
            fontSize: 12,
            fill: 'rgba(0,0,0,0.54)'
          },
          width: 40,
          tickFormatter: value => Math.round(value),
          domain: [0, 100],
          interval: 0,
          orientation: 'right',
          label: {
            value: 'Sum of alerts',
            position: 'top',
            offset: 50,
            fontSize: 9,
          },
          type: 'number'
        },
        brushes: {
          margin: { top: 60, right: 65, left: 25, bottom: 20 },
          // startIndex: 0,
          // endIndex: dataFiltered.length - 1
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
              type="column"
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                flexDirection: 'column'
              }}
              settings={[
                { label: '0–5 m', color: '#C9BB42', key: '0–5', format: value => `${numberFormat(value)} %`, position: '_column', type: '_stacked' },
                { label: '5–10 m', color: '#8BA205', key: '5–10', format: value => `${numberFormat(value)} %`, position: '_column', type: '_stacked' },
                { label: '10–15 m', color: '#428710', key: '10–15', format: value => `${numberFormat(value)} %`, position: '_column', type: '_stacked' },
                { label: '15–20 m', color: '#0A6624', key: '15–20', format: value => `${numberFormat(value)} %`, position: '_column', type: '_stacked' },
                { label: '20–25 m', color: '#103C1F', key: '20–25', format: value => `${numberFormat(value)} %`, position: '_column', type: '_stacked' },
              ].reverse()}
              label={{ key: 'month' }}
            />
          )
        }
      },
    }
  },
};


export default CONFIG;
