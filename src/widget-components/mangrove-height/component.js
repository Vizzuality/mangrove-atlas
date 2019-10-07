import React, { useState, useEffect } from 'react';
import Select from 'components/select';
import ChartWidget from 'components/chart-widget';
import sortBy from 'lodash/sortBy';

import config from './config';

const MangroveHeight = ({
  data: rawData,
  isCollapsed,
  slug, name,
  currentLocation,
  addFilter,
  ...props
}) => {
  const [endDate, setEndDate] = useState('2010');
  const [area, setAreaType] = useState('canopy');
  useEffect(() => {
    addFilter({
      filter: {
        id: 'height',
        year: '2010'
      }
    });
  }, []);

  if (!rawData) {
    return null;
  }

  const { chartData, metadata, chartConfig, heightData } = config.parse(rawData);

  if (chartData.length <= 0) {
    return null;
  }

  const location = currentLocation.name;
  const areaOptions = [
    { label: 'canopy', value: 'canopy' }
  ];

  const dateOptions = sortBy(metadata.map(year => ({
    label: year.toString(),
    value: year.toString()
  })), ['value']);

  const endDateHandler = (value) => {
    setEndDate(value);
    addFilter({
      filter: {
        id: 'height',
        year: value
      }
    });
  };

  const areaSelector = (
    <Select
      value={area}
      options={areaOptions}
      onChange={value => setAreaType(value)}
    />
  );

  const endDateSelector = (
    <Select
      value={endDate}
      options={dateOptions}
      isOptionDisabled={option => option.value === endDate}
      onChange={value => endDateHandler(value)}
    />
  );

  const sentence = (
    <>
      Mean mangrove {areaSelector} height (m) in <strong>{location}</strong> was <strong>average({heightData.height})</strong> between <strong>1996</strong> and {endDateSelector}.
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
