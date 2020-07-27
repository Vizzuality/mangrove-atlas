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
  const { year = 2020, startDate = '2020-04-01', endDate = '2020-05-01' } = ui;

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
        fetchAlerts({ location_id, start_date: startDate, end_date: endDate });
      } else if (location === undefined && currentLocation.id === 'worldwide') {
        fetchAlerts({ start_date: startDate, end_date: endDate });
      }
    }
  }, [year, currentLocation]);

  if (!data || data.length <= 0) {
    return null;
  }
  const {
    chartData, chartConfig, total, dateOptions, downloadData, startDateOptions, endDateOptions,
  } = config.parse(data, startDate, endDate, year);
  if (chartData.length <= 0) {
    return null;
  }
  const changeDate = (type, value) => {
    const yyyy = new Date(value).getFullYear();
    const mm = new Date(value).getMonth();
    const dd = new Date(2020, mm, 0).getDate();
    const date = `${yyyy}-${mm}-${dd}`;

    setUi({
      id: 'alerts',
      value: {
        [type]: date
      }
    });
  };
  console.log(startDateOptions, startDate)

  const startDateSelect = (
    <Select
      value={startDate}
      options={startDateOptions}
      // isOptionDisabled={option => console.log(option.value, endDate, '****')||option.value > endDate
      //   || option.value === startDate}
      onChange={value => changeDate('startDate', value)}
    />
  );

  const endDateSelect = (
    <Select
      value={endDate}
      options={dateOptions}
      isOptionDisabled={option => option.value < startDate
        || option.value === endDate}
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
        changeDate('endDate', chartData[endIndex].date.value);
      }}
      {...props}
    />
  );
};

export default MangroveAlerts;
