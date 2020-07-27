import React, { useEffect } from 'react';
import Select from 'components/select';
import ChartWidget from 'components/chart-widget';

import hiddenCountries from 'modules/alerts/constants';
import config from './config';

const MangroveAlertsLine = ({
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
      const exceptions = hiddenCountries
        .find(country => country === (currentLocation.id || currentLocation.iso))

      if (exceptions) return null;
      const location = locationsList.find((l) => {
        if (currentLocation.id) {
          return l.id === Number(currentLocation.id);
        }
        if (currentLocation.iso) {
          return l.iso === currentLocation.iso && l.location_type === 'country';
        }
        return false;
      });
      if (location) {
        // eslint-disable-next-line camelcase
        const { id: location_id } = location;
        fetchAlerts({ location_id, start_date: startDate, end_date: endDate });
      }
    } else { fetchAlerts({ start_date: startDate, end_date: endDate }); }
  }, [year, currentLocation]);

  if (!data || data.length <= 0) {
    return null;
  }
  const {
    chartData, chartConfig, total, dateOptions, downloadData
  } = config.parse(data, startDate, endDate, year);
  if (chartData.length <= 0) {
    return null;
  }
  const changeDate = (type, value) => {
    setUi({
      id: 'alerts',
      value: {
        [type]: value
      }
    });
  };

  const startDateSelect = (
    <Select
      value={startDate}
      options={dateOptions}
      isOptionDisabled={option => option.value > endDate
        || option.value === startDate}
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

export default MangroveAlertsLine;
