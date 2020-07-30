import React, { useEffect } from 'react';
import Select from 'components/select';
import ChartWidget from 'components/chart-widget';

import config from './config';

const MangroveAlerts = ({
  data,
  isCollapsed,
  slug, name,
  addFilter,
  ui = {},
  currentLocation,
  locationsList,
  setUi,
  fetchAlerts,
  ...props
}) => {
  const {
    year = 2020,
    startDate = { label: 'April, 2020', value: '2020-04-01' },
    endDate = { label: 'May, 2020', value: '2020-05-31' }
  } = ui;

  useEffect(() => {
    if (currentLocation && (currentLocation.id || currentLocation.iso)) {
      const location = locationsList.find((l) => {
        if (currentLocation.iso) {
          return l.iso === currentLocation.iso && l.location_type === 'country';
        }
        if (currentLocation.id && currentLocation.id !== 'worldwdie') {
          return l.id === Number(currentLocation.id);
        }
        return false;
      });

      if (location) {
        // eslint-disable-next-line camelcase
        const { id: location_id } = location;
        fetchAlerts({ location_id, start_date: startDate.value, end_date: endDate });
      } else if (location === undefined && currentLocation.id === 'worldwide') {
        fetchAlerts({ start_date: startDate.value, end_date: endDate.value });
      }
    }
  }, [year, currentLocation]);

  if (!data || data.length <= 0) {
    return null;
  }
  const {
    chartData, chartConfig, total, downloadData, startDateOptions, endDateOptions,
  } = config.parse(data, startDate, endDate, year);
  if (chartData.length <= 0) {
    return null;
  }
  const changeDate = (type, value) => {
    const yyyy = new Date(value).getFullYear();
    const mm = new Date(value).getMonth();

    const monthsConversionAlt = {
      0: 'January',
      1: 'February',
      2: 'March',
      3: 'April',
      4: 'May',
      5: 'June',
      6: 'July',
      7: 'August',
      8: 'September',
      9: 'October',
      10: 'November',
      11: 'December'
    };

    const monthLabel = monthsConversionAlt[mm];
    const label = `${monthLabel}, ${yyyy}`;

    setUi({
      id: 'alerts',
      value: {
        [type]: {
          label,
          value
        }
      }
    });
  };

  const startDateSelect = (
    <Select
      value={startDate.value}
      options={startDateOptions}
      isOptionDisabled={option => option.value > endDate
        || option.value === startDate}
      onChange={value => changeDate('startDate', value)}
    />
  );

  const endDateSelect = (
    <Select
      value={endDate.value}
      options={endDateOptions}
      isOptionDisabled={option => option < startDate.value
        || option.value === endDate.value}
      onChange={value => changeDate('endDate', value)}
    />
  );
  const sentence = (
    <>
      There were <strong>{total}</strong> mangrove disturbance alerts<br />
      between {startDateSelect}
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
      downloadData={downloadData}
      data={chartData}
      slug={slug}
      filename={slug}
      isCollapsed={isCollapsed}
      sentence={sentence}
      chartData={chartRData}
      onBrushEnd={({ startIndex, endIndex }) => {
        changeDate('startDate', chartData[startIndex].date.value);
        changeDate('endDate', chartData[endIndex].endDate);
      }}
      {...props}
    />
  );
};

export default MangroveAlerts;
