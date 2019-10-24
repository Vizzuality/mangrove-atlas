import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'components/select';
import ChartWidget from 'components/chart-widget';
import sortBy from 'lodash/sortBy';

import config from './config';

const MangroveBiomass = ({
  data: rawData,
  currentLocation,
  isCollapsed,
  slug,
  name,
  addFilter,
  ui: yearSelected,
  setUi,
  ...props
}) => {
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

  const { chartData, metadata, chartConfig, coverage } = config.parse(rawData, yearSelected);

  if (chartData.length <= 0) {
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

  const dateOptions = sortBy(metadata.map(year => ({
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
      Mean mangrove above-ground biomass density in <strong> {location}</strong>
      &nbsp;was <strong>{coverage} mg ha<sup>-1</sup></strong> in {yearSelector}.
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
};

MangroveBiomass.propTypes = {
  currentLocation: PropTypes.shape({})
};

MangroveBiomass.defaultProps = {
  currentLocation: null
};

export default MangroveBiomass;
