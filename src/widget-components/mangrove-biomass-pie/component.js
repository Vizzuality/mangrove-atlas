import React, { useEffect } from 'react';
import Select from 'components/select';
import PropTypes from 'prop-types';
import ChartWidget from 'components/chart-widget';
import sortBy from 'lodash/sortBy';

import config from './config';


function MangroveBiomassPie({
  data: rawData,
  currentLocation,
  isCollapsed,
  slug,
  name,
  addFilter,
  ui: yearSelected,
  setUi,
  ...props
}) {
  useEffect(() => {
    addFilter({
      filter: {
        id: 'biomass',
        year: '2016'
      }
    });
  }, [addFilter]);


  if (!rawData) {
    return null;
  }
  const { chartData, metadata, chartConfig, coverage } = config.parse(rawData);
  if (!chartData || chartData.length <= 0) {
    return null;
  }

  const dateHandler = (value) => {
    setUi({ id: 'biomass', value });
    addFilter({
      filter: {
        id: 'biomass',
        year: value
      }
    });
  };

  const dateOptions = metadata && sortBy(metadata.years.map(year => ({
    label: year.toString(),
    value: year.toString()
  })), ['value']);

  const location = (currentLocation.location_type === 'worldwide')
    ? 'the world'
    : <span className="notranslate">{`${currentLocation.name}`}</span>;

  const yearSelector = (
    <Select
      value={yearSelected}
      isOptionDisabled={option => option.value === yearSelected}
      options={dateOptions}
      onChange={value => dateHandler(value)}
    />
  );

  const sentence = (
    <>
      Mean mangrove aboveground biomass density in <strong> {location}</strong>
      &nbsp;was <strong>{coverage} mg ha<sup>-1</sup></strong> in <strong>{2016 || yearSelector}</strong>.
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
      isCollapsed={isCollapsed}
      sentence={sentence}
      chartData={widgetData}
      {...props}
    />
  );
}

MangroveBiomassPie.propTypes = {
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

MangroveBiomassPie.defaultProps = {
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

export default MangroveBiomassPie;
