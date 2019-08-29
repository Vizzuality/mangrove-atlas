import React, { useState } from 'react';
import Select from 'components/select';
import Chart from 'components/chart';
import groupBy from 'lodash/groupBy';
import WidgetLegend from 'components/widget/legend';

//{"bars":{"y0":{"stackId":"bar","fill":"#43f3f3","stroke":"#43f3f3"},"y1":{"stackId":"bar","fill":"#ff66e5","stroke":"#ff66e5"},"y2":{"stackId":"bar","fill":"#517fee","stroke":"#517fee"},"y3":{"stackId":"bar","fill":"#8c28ff","stroke":"#8c28ff"},"y4":{"stackId":"bar","fill":"#72ea28","stroke":"#72ea28"},"y5":{"stackId":"bar","fill":"#ffb314","stroke":"#ffb314"},"y6":{"stackId":"bar","fill":"#8339aa","stroke":"#8339aa"}}}


import styles from 'components/widget/style.module.scss';
import { number } from '@storybook/addon-knobs';

const MangroveHeight = () => {
  const [startDate, setStartDate] = useState('1996');
  const [endDate, setEndDate] = useState('2010');
  const metadata = [1996, 2007, 2008, 2009, 2010];
  // const dateOptions = [
  //   { label: '1996', value: '1996' },
  //   { label: '2007', value: '2007' },
  //   { label: '2008', value: '2008' },
  //   { label: '2009', value: '2009' },
  //   { label: '2010', value: '2010' },
  // ];
  const data = [
    { year: '1996', uv: 4000, '0-10m': 18, '10-20m': 50, '20-30m': 70, '30-40m': 90, '40-50m': 98 },
    { year: '2007', uv: 3000, '0-10m': 30, '10-20m': 40, '20-30m': 60, '30-40m': 70, '40-50m': 75 },
    { year: '2008', uv: 2000, '0-10m': 10, '10-20m': 40, '20-30m': 65, '30-40m': 80, '40-50m': 85 },
    { year: '2009', uv: 2780, '0-10m': 15, '10-20m': 42, '20-30m': 67, '30-40m': 82, '40-50m': 90 },
    { name: '2010', uv: 1890, '0-10m': 20, '10-20m': 50, '20-30m': 70, '30-40m': 98, '40-50m': 102 },
  ];
  const chartConfig = {
    cartesianGrid: {
      vertical: false,
      horizontal: true,
      strokeDasharray: '3 3'
    },
    xAxis: {
      type: number,
      // dataKey: 'year'
    },
    yAxis: {
      bars:
      {
        '0-10m':
        {
          stackId: 'bar',
          fill: '#9ADBD9',
          stroke: '#9ADBD9'
        },
        '10-20m':
        {
          stackId: 'bar',
          fill: '#5BC3BD',
          stroke: '#5BC3BD'
        },
        '20-30m':
        {
          stackId: 'bar',
          fill: '#249892',
          stroke: '#249892'
        },
        '30-40m':
        {
          stackId: 'bar',
          fill: '#00746F',
          stroke: '#00746F'
        },
        '40-50m':
        {
          stackId: 'bar',
          fill: '#004B47',
          stroke: '#004B47'
        }
      }
    },
    legend: {
      align: 'left',
      verticalAlign: 'top',
      layout: 'horizontal',
      height: 50,
      content: (properties) => {
        const { payload } = properties;
        const groups = groupBy(payload, p => p.payload.category);
        return <WidgetLegend direction="vertical" groups={groups} />;
      }
    }


      // <Bar dataKey="0-10m" stackId="a" fill="#9ADBD9" />
      // <Bar dataKey="10-20m" stackId="a" fill="#5BC3BD" />
      // <Bar dataKey="20-30m" stackId="a" fill="#249892" />
      // <Bar dataKey="30-40m" stackId="a" fill="#00746F" />
      // <Bar dataKey="40-50m" stackId="a" fill="#004B47" />
  };
  const dateOptions = metadata.map(year => ({
    label: year.toString(),
    value: year.toString()
  }));
  const unit = 'km';
  return (
    <div className={styles.widget_template}>
      <div className={styles.sentence}>
        Over the past 20 years, mangroves in the world have decreased by x
        {' '}
        {unit}
        {' '}
        between
        <Select
          value={startDate}
          options={dateOptions}
          menuIsOpen
          onChange={value => setStartDate(value)}
        /> and
        <Select
          value={endDate}
          options={dateOptions}
          menuIsOpen
          onChange={value => setEndDate(value)}
        />.
        <Chart
          data={data}
          config={chartConfig}
        />
      </div>
    </div>
  );
};

export default MangroveHeight;
