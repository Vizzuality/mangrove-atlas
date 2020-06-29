import React, { useEffect } from 'react';
import Select from 'components/select';
import ChartWidget from 'components/chart-widget';
import sortBy from 'lodash/sortBy';
import { format } from 'd3-format';

import config from './config';

const numberFormat = format(',.2f');

const MangroveHeight = ({
  data: rawData,
  isCollapsed,
  slug, name,
  currentLocation,
  addFilter,
  ui: date,
  setUi,
  ...props
}) => {
  useEffect(() => {
    addFilter({
      filter: {
        id: 'height',
        year: date,
        area: 'maximum'
      }
    });
  }, [date, addFilter]);

  if (!rawData) {
    return null;
  }

  // for widget to show 2016 until client has better data for the rest of the years
  const dataFiltered = rawData.filter(data => data.date.includes('2016'));
  const { chartData, metadata, chartConfig, heightCoverage } = config.parse(dataFiltered, date);

  if (chartData.length <= 0) {
    return null;
  }

  const location = currentLocation.name;

  const dateOptions = sortBy(metadata.map(year => ({
    label: year.toString(),
    value: year.toString()
  })), ['value']);

  const dateHandler = (value) => {
    setUi({ id: 'height', value });
    addFilter({
      filter: {
        id: 'height',
        year: value
      }
    });
  };

  const dateSelector = (
    <Select
      value={date}
      options={dateOptions}
      onChange={value => dateHandler(value)}
    />
  );

  const sentence = (
    <>
      Mean mangrove <strong>maximum</strong> canopy height in <strong>{location}</strong> was
      <strong> {numberFormat(heightCoverage)} m</strong> in <strong>{dateOptions.length > 1 ? dateSelector : dateOptions[0].label}</strong>.
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
      {...props}
    />
  );
};

export default MangroveHeight;
