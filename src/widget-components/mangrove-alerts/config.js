import React from 'react';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import WidgetLegend from 'components/widget-legend';
import WidgetTooltip from 'components/widget-tooltip';
import { format } from 'd3-format';

const numberFormat = format(',.3r');
const formatAxis = format(',~s');

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

const getStops = () => {
  const colorSchema = [
    'rgba(199, 43, 214, 1)',
    'rgba(235, 68, 68, 0.7)',
    'rgba(255, 194, 0, 0.5)',
  ];

  const gradient = colorSchema.map((d, index) => (
    {
      offset: `${index / (colorSchema.length - 1) * 100}%`,
      stopColor: d,
    }
  ));
  return gradient;
};

const getData = (data, year) => sortBy(data
  .filter(d => new Date(d.date.value).getFullYear() === year && d.date.value >= '2020-04-01')
  .map((d) => {
    const date = months.find(month => month.value === new Date(d.date.value).getMonth() + 1);
    const month = new Date(d.date.value).getMonth() + 1;
    const day = new Date(year, month, 0).getDate();
    return (
      {
        ...d,
        month: date.value,
        startDate: date.value,
        endDate: `${year}-${month < 10 ? '0' : ''}${month}-${day}`,
        name: monthsConversion[date.label],
        alerts: d.count
      }
    );
  }),
['month']);

const getDownloadData = data => sortBy(data
  .map(d => ({
    date: d.date.value,
    alerts: d.count
  })),
['date']);

const getDates = data => sortBy(data
  .map((d) => {
    const monthsConversionAlt = {
      0: 'January',
      1: 'February',
      2: 'March',
      3: 'April',
      4: 'May',
      5: 'June',
      6: 'July',
      8: 'August',
      9: 'September',
      10: 'October',
      11: 'November',
      12: 'December'
    };
    const year = new Date(d.date.value).getFullYear();
    const month = monthsConversionAlt[new Date(d.date.value).getMonth()];

    return {
      label: `${month}, ${year}`,
      value: d.date.value
    };
  })
  .filter(m => m.value >= '2020-04-01'),
['date']);

const getStartDates = data => sortBy(data
  .map((d) => {
    const monthsConversionAlt = {
      1: 'January',
      2: 'February',
      3: 'March',
      4: 'April',
      5: 'May',
      6: 'June',
      7: 'July',
      8: 'August',
      9: 'September',
      10: 'October',
      11: 'November',
      12: 'December'
    };
    const year = new Date(d.date.value).getFullYear();
    const month = monthsConversionAlt[new Date(d.date.value).getMonth() + 1];

    return {
      label: `${month}, ${year}`,
      value: d.date.value
    };
  })
  .filter(m => m.value >= '2020-04-01'),
['date']);

const getEndDates = data => sortBy(data
  .map((d) => {
    const monthsConversionAlt = {
      1: 'January',
      2: 'February',
      3: 'March',
      4: 'April',
      5: 'May',
      6: 'June',
      7: 'July',
      8: 'August',
      9: 'September',
      10: 'October',
      11: 'November',
      12: 'December'
    };
    const year = new Date(d.date.value).getFullYear();
    const month = new Date(d.date.value).getMonth() + 1;
    const monthLabel = monthsConversionAlt[month];
    const day = new Date(year, month, 0).getDate();
    const date = `${year}-${month < 10 ? '0' : ''}${month}-${day}`;
    return {
      label: `${monthLabel}, ${year}`,
      value: date
    };
  }),
['date']);


const getTotal = data => data.reduce((previous, current) => current.count + previous, 0);

export const CONFIG = {
  parse: ({ data }, startDate, endDate, year) => {
    const chartData = getData(data, year);
    const downloadData = getDownloadData(data, year);
    const startIndex = chartData.findIndex(d => d.date.value === startDate.value);
    const endIndex = chartData
      .findIndex(d => new Date(d.date.value).getMonth() === new Date(endDate.value).getMonth());
    const monthsOptions = getDates(data, year);
    const dateOptions = getDates(data);
    const startDateOptions = getStartDates(data);
    const endDateOptions = getEndDates(data);

    const dataFiltered = data
      .filter(d => endDate >= d.date.value && d.date.value >= startDate.value);

    return {
      chartData,
      monthsOptions,
      startDateOptions,
      endDateOptions,
      dateOptions,
      downloadData,
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
            x1: startDate.value,
            x2: endDate.value,
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
            fontSize: 10,
            fill: 'rgba(0,0,0,0.54)'
          },
          width: 40,
          tickFormatter: value => formatAxis(Math.round(value)),
          interval: 0,
          orientation: 'right',
          value: 'alerts',
          // eslint-disable-next-line react/prop-types
          label: ({ viewBox }) => {
            const { x, y } = viewBox;
            return (
              <g>
                <text x={x + 20} y={y - 70} lineheight="19" className="recharts-text recharts-label-medium" textAnchor="middle" dominantBaseline="central">
                  <tspan alignmentBaseline="middle" fill="rgba(0,0,0,0.85)" fontSize="12">Alerts</tspan>
                </text>
                <text x={x + 20} y={y - 50} className="recharts-text recharts-label-large" textAnchor="middle" dominantBaseline="central">
                  <tspan alignmentBaseline="middle" fill="rgba(0,0,0,0.85)" lineheight="29" fontSize="12">2020</tspan>
                </text>
              </g>
            );
          },
          type: 'number'
        },
        brush: {
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
          position: 'right',
          content: (properties) => {
            const { payload } = properties;
            const groups = groupBy(payload, p => p.payload);
            return <WidgetLegend groups={groups} />;
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
                  { label: 'alerts', key: 'count', format: value => numberFormat(value), position: '_column' },
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
