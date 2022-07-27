import React, { useEffect, useMemo } from 'react';
import Select from 'components/select';
import ChartWidget from 'components/chart-widget';
import sortBy from 'lodash/sortBy';
import { format } from 'd3-format';

import config from './config';

const numberFormat = format(',.2f');

const MangroveHeight = ({
  data: rawData,
  isCollapsed = true,
  slug, name,
  currentLocation,
  addFilter,
  ui: date,
  setUi,
  ...props
}) => {
  const years = useMemo(() => sortBy(rawData
    .filter(({ hmax_hist_m }) => hmax_hist_m), ['date', 'desc'])
    .map(({ date }) => date),
  [rawData]);
  
  const yearSelected = years[0]?.split('-')[0];
 
  useEffect(() => {
    addFilter({
      filter: {
        id: 'height',
        year: date || yearSelected,
        area: 'maximum'
      }
    });
  }, [date, yearSelected, addFilter]);
 
  if (!rawData) {
    return null;
  }

  const { chartData, chartConfig, heightCoverage, downloadData } = config.parse(rawData, yearSelected, years);

  if (!chartData || !chartData.length) {
    return null;
  }

  const location = currentLocation.name;

  const dateOptions = sortBy(years.map(year => ({
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
      <strong> {numberFormat(heightCoverage)} m</strong> in <strong>{dateOptions.length > 1 ? dateSelector : yearSelected}</strong>.
    </>
  );
  const widgetData = {
    data: chartData,
    config: chartConfig
  };

  return (
    <ChartWidget
      name={name}
      data={chartData}
      slug={slug}
      filename={slug}
      downloadData={downloadData}
      isCollapsed={isCollapsed}
      sentence={sentence}
      chartData={widgetData}
      {...props}
    />
  );
};

export default MangroveHeight;
