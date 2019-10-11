import React, { useState, useEffect } from 'react';
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
  ...props
}) => {
  const [date, setDate] = useState('2016');
  const [area, setAreaType] = useState('maximun');
  useEffect(() => {
    addFilter({
      filter: {
        id: 'height',
        year: date,
        area
      }
    });
  }, [date, area]);

  if (!rawData) {
    return null;
  }

  const { chartData, metadata, chartConfig, heightCoverage } = config.parse(rawData, date);

  if (chartData.length <= 0) {
    return null;
  }

  const location = currentLocation.name;
  const areaOptions = [
    { label: 'maximun', value: 'maximun' },
    { label: 'basal', value: 'basal' }
  ];

  const dateOptions = sortBy(metadata.map(year => ({
    label: year.toString(),
    value: year.toString()
  })), ['value']);

  const dateHandler = (value) => {
    setDate(value);
    addFilter({
      filter: {
        id: 'height',
        year: value
      }
    });
  };

  const areaHandler = (value) => {
    setAreaType(value);
    addFilter({
      filter: {
        id: 'height',
        area: value
      }
    });
  };

  // const areaSelector = (
  //   <Select
  //     value={area}
  //     options={areaOptions}
  //     onChange={value => areaHandler(value)}
  //   />
  // ); TO-DO - add back when date is ready, changing maximun for area selector

  const dateSelector = (
    <Select
      value={date}
      options={dateOptions}
      onChange={value => dateHandler(value)}
    />
  );

  const sentence = (
    <>
      Mean mangrove <strong>maximun</strong> canopy height in <strong>{location}</strong> was
      <strong> {numberFormat(heightCoverage)} m</strong> in <strong>{dateSelector}</strong>.
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
