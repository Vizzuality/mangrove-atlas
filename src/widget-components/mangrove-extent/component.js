import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import sortBy from 'lodash/sortBy';

import ChartWidget from 'components/chart-widget';
import Select from 'components/select';

import config from './config';

const numberFormat = format(',.2f');

function processData(data, currentYear, unit) {
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
      unit,
      coverage: (nonMangrove / 1000).toFixed(2),
      label: 'Non mangroves'
    }
  ];
}

function MangroveExtent({
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
  useEffect(() => {
    addFilter({
      filter: {
        id: 'extent',
        year: '2016'
      }
    });
  }, [addFilter, unit]);

  if (!rawData) {
    return null;
  }
  const data = config.parse(rawData, unit);
  const { chartConfig, metadata, downloadData } = data;
  const optionsYears = sortBy(metadata.years.map(year => ({
    label: year.toString(),
    value: year
  })), ['value']);
  let sentence = null;

  const changeYear = (current) => {
    addFilter({
      filter: {
        id: 'extent',
        year: current
      }
    });
    setUi({ id: 'coverage', value: { unit, currentYear: current } });
  };

  const changeUnit = (selectedUnit) => {
    setUi({ id: 'coverage', value: { currentYear, unit: selectedUnit } });
  };

  const widgetData = processData(data, currentYear, unit);

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
      { value: 'km', label: 'km²' },
      { value: 'ha', label: 'ha' }
    ];
    const totalCoverage = metadata.total / 1000;
    const area = unit === 'ha'
      ? numberFormat(chartData.data[0].area / 10000)
      : numberFormat(chartData.data[0].area / 1000000);

    const coveragePercentage = numberFormat(percentage);


    const location = (currentLocation.location_type === 'worldwide')
      ? 'the world'
      : <span className="notranslate">{`${currentLocation.name}`}</span>;
    const unitSelector = (
      <Select
        value={unit}
        options={unitOptions}
        onChange={changeUnit}
      />
    );
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
        <span>The area of mangrove habitat in </span><strong>{location} </strong>
        <span>was </span>
        <strong className="notranslate">{area} </strong>{unitSelector}<span> in </span>{yearSelector},<span> this represents a linear coverage of <strong>{coveragePercentage}%</strong> </span> of the
        <strong className="notranslate"> {numberFormat(totalCoverage)} km</strong><span> of the coastline.<br /></span>
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
      downloadData={downloadData}
      sentence={sentence}
      chartData={chartData}
      {...props}
    />
  );
}

MangroveExtent.propTypes = {
  data: PropTypes.shape({}),
  metadata: PropTypes.shape({}),
  currentLocation: PropTypes.shape({})
};

MangroveExtent.defaultProps = {
  data: null,
  metadata: null,
  currentLocation: null
};

export default MangroveExtent;
