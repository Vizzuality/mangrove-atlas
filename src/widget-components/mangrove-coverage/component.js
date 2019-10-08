import React, { useState } from 'react';
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
      color: '#ECECEF',
      percentage: nonMangrove / metadata.total * 100,
      unit: '%',
      coverage: (nonMangrove / 1000).toFixed(2),
      label: 'Non mangroves'
    }
  ];
}

function MangroveCoverage({ data: rawData, currentLocation, addFilter, slug, ...props }) {
  const [coverageState, setCoverageState] = useState({ currentYear: 1996, unit: '%'});
  if (!rawData) {
    return null;
  }

  const data = config.parse(rawData); 
  const { chartConfig, metadata } = data;
  const { currentYear, unit } = coverageState;
  const optionsYears = sortBy(metadata.years.map(year => ({
    label: year.toString(),
    value: year
  })), ['value']);
  let sentence = null;

  const changeYear = (currentYear) => {
    addFilter({
      filter: {
        id: 'coverage-1996-2016',
        year: currentYear
      }
    });
    setCoverageState({ ...coverageState, currentYear });
  };

  const changeUnit = (unit) => {
    setCoverageState({ ...coverageState, unit });
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
    const totalCoverage = metadata.total / 1000;
    const coverage = (percentage * totalCoverage) / 100;
    const quantity = numberFormat((unit === '%') ? percentage : coverage);
    const location = (currentLocation.location_type === 'worldwide')
      ? 'the world’s'
      : <span className="notranslate">{`${currentLocation.name}'s`}</span>;
    const unitSelector = (<Select
      value={unit}
      options={unitOptions}
      onChange={changeUnit}
    />);
    const yearSelector = (<Select
      className="notranslate"
      width="auto"
      value={currentYear}
      options={optionsYears}
      onChange={changeYear}
    />);

    sentence = (
      <>
        <span>Mangrove forests covered </span>
        <strong className="notranslate">{ quantity } {unitSelector}</strong><br />
        <span>of </span> <strong>{ location } </strong>
        <strong className="notranslate">{ numberFormat(totalCoverage)} km</strong> of coastline<br />
        <span>in </span>{yearSelector}.
      </>
      );
  } catch(e) {
    sentence = <span>No data for this widget.</span>;
  }

  return <ChartWidget
    data={data}
    slug={slug}
    filename={slug}
    sentence={sentence}
    chartData={chartData}
    {...props}
  />;
}

MangroveCoverage.propTypes = {
  data: PropTypes.shape({}),
  metadata: PropTypes.shape({}),
  currentLocation: PropTypes.shape({})
}

MangroveCoverage.defaultProps = {
  data: null,
  metadata: null,
  currentLocation: null
}

export default MangroveCoverage;
