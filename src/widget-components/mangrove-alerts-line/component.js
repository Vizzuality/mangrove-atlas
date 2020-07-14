import React, { useEffect } from 'react';
import Select from 'components/select';
import ChartWidget from 'components/chart-widget';

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
  // useEffect(() => {
  //   addFilter({
  //     filter: {
  //       id: 'alerts',
  //       ui,
  //     }
  //   });
  // }, [addFilter, total]);

  if (!data || data.length <= 0) {
    return null;
  }

  const { startDate, endDate } = ui;
  const { chartData, chartConfig, total } = config.parse(data, startDate, endDate);

  if (chartData.length <= 0) {
    return null;
  }

  const changeDate = (type, value) => {
    const prop = (type === 'start') ? 'startDate' : 'endDate';
    setUi({
      id: 'alerts',
      value: {
        ...ui,
        [prop]: value
      }
    });
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

  const startDateSelect = (
    <Select
      value={startDate}
      options={monthOptions}
      isOptionDisabled={option => parseInt(option.value, 10) > parseInt(endDate, 10)
        || option.value === startDate}
      onChange={value => changeDate('start', value)}
    />
  );

  const endDateSelect = (
    <Select
      value={endDate}
      options={monthOptions}
      isOptionDisabled={option => parseInt(option.value, 10) < parseInt(startDate, 10)
        || option.value === endDate}
      onChange={value => changeDate('end', value)}
    />
  );

  const changeIndex = (type, value) => {
    const prop = (type === 'start') ? 'startDate' : 'endDate';
    setUi({
      id: 'alerts',
      value: {
        ...ui,
        [prop]: value
      }
    });
  };
  const sentence = (
    <>
      There were <strong>{total}</strong> mangrove disturbance alerts between {startDateSelect}
      &nbsp;and {endDateSelect}.
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
      onBrushStart={value => changeIndex('start', value)}
      onBrushEnd={value => changeIndex('end', value)}
      {...props}
    />
  );
};

export default MangroveAlertsLine;
