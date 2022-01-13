import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';

import config from './config';

import ChartWidget from 'components/chart-widget';
import Select from 'components/select';

function MangroveProtection({
  data: rawData,
  currentLocation,
  isCollapsed = true,
  slug,
  name,
  addFilter,
  ui: { currentYear },
  setUi,
  ...props
}) {
  useEffect(() => {
    addFilter({
      filter: {
        id: 'protection',
        year: '2016'
      }
    });
  }, [addFilter]);
  if (!rawData) {
    return null;
  }
  const { chartData, chartConfig } = config.parse(rawData);


  const { metadata: { unit, years }, data: { total, percentage } } = rawData;

  const totalProtected = ((total * percentage) / 100).toFixed(2);

  if (!chartData) {
    return null;
  }

  const changeYear = (current) => {
    addFilter({
      filter: {
        id: 'protection',
        year: current
      }
    });
    setUi({ id: 'protection', value: { currentYear: current } });
  };

  const optionsYears = sortBy(years.map(year => ({
    label: year.toString(),
    value: year
  })), ['value']);

  const location = (currentLocation.location_type === 'worldwide')
    ? 'the world'
    : <span className="notranslate">{`${currentLocation.name}`}</span>;

  const yearSelector = (
    <Select
      className="notranslate"
      width="auto"
      value={currentYear}
      options={optionsYears}
      onChange={changeYear}
    />
  );

  const sentence = (
    <>
      Protected mangroves in
      <strong>&nbsp;{location}&nbsp;</strong>
      in
      &nbsp;<strong>{yearSelector}</strong> represented <strong>{totalProtected} {unit}</strong>
    </>
  );

  const widgetData = {
    data: chartData,
    config: chartConfig
  };

  const data = chartData;

  return (
    <ChartWidget
      name={name}
      data={data}
      slug={slug}
      filename={slug}
      isCollapsed={isCollapsed}
      sentence={sentence}
      chartData={widgetData}
      {...props}
    />
  );
}

MangroveProtection.propTypes = {
  data: PropTypes.shape({}),
  currentLocation: PropTypes.shape({}),
  addFilter: PropTypes.func,
  isCollapsed: PropTypes.bool,
  slug: PropTypes.string,
  name: PropTypes.string,
  metadata: PropTypes.shape({}),
  ui: PropTypes.string,
  setUi: PropTypes.func
};

MangroveProtection.defaultProps = {
  data: null,
  currentLocation: null,
  addFilter: () => { },
  isCollapsed: false,
  slug: null,
  name: null,
  metadata: null,
  ui: null,
  setUi: () => { }
};

export default MangroveProtection;
