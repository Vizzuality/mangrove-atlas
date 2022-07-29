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
  ui,
  setUi,
  ...props
}) => {
  const { year } = ui;
  const years = useMemo(() => sortBy(rawData, ['date', 'desc'])
    .filter(({ hmax_hist_m }) => hmax_hist_m)
    .map(({ date }) => date?.split('-')[0]).reverse(),
  [rawData]);

  useEffect(() => {
    const yearSelected = years[0];
    addFilter({
      filter: {
        id: 'height',
        year: year || yearSelected,
        area: 'maximum'
      }
    });
    setUi({ id: 'height', value: { year: year || yearSelected } })
  }, [year, addFilter]);
 
  if (!rawData || !year) {
    return null;
  }

  const { chartData, chartConfig, heightCoverage, downloadData } = config.parse(rawData, year, years);

  const location = currentLocation?.name;
  
  const dateOptions = () => years.map(year => ({
    label: year.toString(),
    value: year.toString()
  }));
  
  const dateHandler = (value) => {
    setUi({ id: 'height', value: { year: value } });
    addFilter({
      filter: {
        id: 'height',
        year: value
      }
    });
  };
  
  const dateSelector = (
    <Select
    value={year}
    options={dateOptions}
    onChange={value => dateHandler(value)}
    />
    );
    
    const sentence = (
      <>
      Mean mangrove <strong>maximum</strong> canopy height in <strong>{location}</strong> was
      <strong> {numberFormat(heightCoverage)} m</strong> in <strong>{dateOptions.length > 1 ? dateSelector : year}</strong>.
    </>
  );
  const widgetData = {
    data: chartData,
    config: chartConfig
  };
  
  if (!chartData || !chartData.length) {
    return null;
  }
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