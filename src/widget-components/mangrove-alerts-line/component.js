import React, { useState } from 'react';
import Select from 'components/select';
import ChartWidget from 'components/chart-widget';
import realData from './constants';

import config from './config';

const MangroveAlertsLine = ({
  data,
  isCollapsed,
  slug, name,
  currentLocation,
  addFilter,
  ui,
  setUi,
  ...props
}) => {
  const [startMonth, setStartMonth] = useState(2);
  const [endMonth, setEndMonth] = useState(11);

  if (!data || data.length <= 0) {
    return null;
  }

  const { chartData, chartConfig, total } = config.parse(data, startMonth, endMonth);

  if (chartData.length <= 0) {
    return null;
  }

  const changeStartMonth = (value) => {
    setStartMonth(value);
  };

  const changeEndMonth = (value) => {
    setEndMonth(value);
  };

  const monthOptions = [
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

  const startMonthSelect = (
    <Select
      value={startMonth}
      options={monthOptions}
      onChange={value => changeStartMonth(value)}
    />
  );

  const endMonthSelect = (
    <Select
      value={endMonth}
      options={monthOptions}
      onChange={value => changeEndMonth(value)}
    />
  );

  const sentence = (
    <>
      There were <strong>{total}</strong> mangrove disturbance alerts between {startMonthSelect}
      &nbsp;and {endMonthSelect}.
    </>
  );
  const chartRData = {
    data: chartData,
    config: chartConfig
  };

  return (
    <ChartWidget
      name={name}
      data={chartData}
      slug={slug}
      filename={slug}
      isCollapsed={isCollapsed}
      sentence={sentence}
      chartData={chartRData}
      // onBrushEnd={change startIndex && endIndex}
      {...props}
    />
  );
};

export default MangroveAlertsLine;
