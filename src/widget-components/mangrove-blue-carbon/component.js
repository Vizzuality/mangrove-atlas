import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import sortBy from 'lodash/sortBy';

import ChartWidget from 'components/chart-widget';
import Select from 'components/select';

import config from './config';

const numberFormat = format(',.2f');

function processData(data, currentYear) {
  const { chartData, metadata } = data;
  const currentYearData = chartData.find(d => d.x === currentYear);

  if (!currentYearData) {
    return null;
  }

  const nonMangrove = metadata.total - currentYearData.value;

  return [
    {
      ...currentYearData
    },
    {
      x: 0,
      y: nonMangrove,
      color: '#FDC067',
      percentage: nonMangrove / metadata.total * 100,
      unit: '%',
      coverage: (nonMangrove / 1000).toFixed(2),
      label: 'Soil'
    }
  ];
}

function MangroveBlueCarbon({
  data: rawData,
  currentLocation,
  addFilter,
  slug,
  ui: {
    currentYear,
    unit
  },
  setUi,
  ...props
}) {
  if (!rawData) {
    return null;
  }

  const data = config.parse(rawData);
  const { chartConfig, metadata } = data;
  const optionsYears = sortBy(metadata.years.map(year => ({
    label: year.toString(),
    value: year
  })), ['value']);
  let sentence = null;
  const changeYear = (current) => {
    addFilter({
      filter: {
        id: 'coverage-1996-2016',
        year: current
      }
    });
    setUi({ id: 'coverage', value: { unit, currentYear: current } });
  };

  const changeUnit = (selectedUnit) => {
    setUi({ id: 'coverage', value: { currentYear, unit: selectedUnit } });
  };

  const widgetData = processData(data, currentYear);

  if (widgetData === null) {
    return null;
  }

  const chartData = {
    data: widgetData,
    config: chartConfig
  };

  try {
    const { percentage } = widgetData[0];
    const unitOptions = [
      { value: '%', label: '%' },
      { value: 'km', label: 'km' }
    ];
    const location = (currentLocation.location_type === 'worldwide')
      ? 'the world’s'
      : <span className="notranslate">{`${currentLocation.name}'s`}</span>;

    const yearSelector = (
      <Select
        className="notranslate"
        width="auto"
        value={currentYear}
        options={optionsYears}
        onChange={changeYear}
      />
    );

    sentence = (
      <>
        <strong>TOTAL_CARBON</strong> kg C m-2 was estimated to be stored in mangrove habitat In
        <strong> {location} </strong>during {yearSelector}; with
        <strong> IN_BIOMASS</strong> in tree biomass, and
        <strong> IN_SOIL</strong> in the upper 1m of soil.
      </>
    );
  } catch (e) {
    sentence = <span>No data for this widget.</span>;
  }

  return (
    <ChartWidget
      data={data}
      slug={slug}
      filename={slug}
      sentence={sentence}
      chartData={chartData}
      {...props}
    />
  );
}

MangroveBlueCarbon.propTypes = {
  data: PropTypes.shape({}),
  metadata: PropTypes.shape({}),
  currentLocation: PropTypes.shape({})
};

MangroveBlueCarbon.defaultProps = {
  data: null,
  metadata: null,
  currentLocation: null
};

export default MangroveBlueCarbon;
