import React from 'react';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import WidgetLegend from 'components/widget-legend';
import WidgetTooltip from 'components/widget-tooltip';

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
  const colorSchema = [
    '#FFC200',
    '#EB4444',
    '#C72BD6'
  ];

  const gradient = colorSchema.map((d, index) => (
    {
      offset: `${index / (colorSchema.length - 1) * 100}%`,
      stopColor: d,
      //stopOpacity: 0.5
    }
  ));
  return gradient;
};

const getData = (data, year) => sortBy(data
  .filter(d => new Date(d.date.value).getFullYear() === year)
  .map((d) => {
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
        ...d,
        month: date.value,
        name: monthsConversion[date.label],
        alerts: d.count
      }
    );
  }),
['month']);


const getTotal = data => data.reduce((previous, current) => current.count + previous, 0);

export const CONFIG = {
  parse: ({ data }, startDate, endDate, year) => {
    const chartData = getData(data, year);
    const startIndex = chartData.findIndex(d => d.month === startDate);
    const endIndex = chartData.findIndex(d => d.month === endDate);
    const dataFiltered = data
      .filter(d => endDate >= new Date(d.date.value).getMonth() + 1 && new Date(d.date.value).getMonth() + 1 >= startDate);

    return {
      chartData,
      total: getTotal(dataFiltered),
      chartConfig: {
        height: 250,
        cartesianGrid: {
          vertical: false,
          horizontal: false,
        },
        margin: { top: 20, right: 10, left: 10, bottom: 20 },
        label: 'alerts',
        gradients: {
          key: {
            attributes: {
              id: 'colorAlerts',
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: getStops(data),
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
            x1: startDate,
            x2: endDate,
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
          value: 'alerts',
          label: {
            value: 'Alerts',
            position: 'top',
            offset: 50,
            fontSize: 9,
          },
          type: 'number'
        },
        brushes: {
          margin: { top: 60, right: 65, left: 25, bottom: 20 },
          startIndex,
          endIndex
        },
        legend: {
          align: 'left',
          verticalAlign: 'top',
          layout: 'horizontal',
          height: 80,
          top: 0,
          left: 0,
          position: 'left',
          content: (properties) => {
            const { payload } = properties;
            const groups = groupBy(payload, p => p.payload);
            return <WidgetLegend type="height" groups={groups} />;
          }
        },
        tooltip: {
          cursor: false,
          content: (properties = {}) => {
            const { payload } = properties;
            if (!payload || payload.lenght) return null;
            return (
              <WidgetTooltip
                style={{
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  marginLeft: '10px',
                }}
                payload={payload}
                settings={[
                  { label: 'alerts', key: 'count', format: value => value, position: '_column' },
                ]}
              />
            );
          }
        }
      },
    };
  },
};


export default CONFIG;
