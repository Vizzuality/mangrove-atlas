import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import sumBy from 'lodash/sumBy';

import ChartWidget from 'components/chart-widget';
import Select from 'components/select';
import config, { numberFormat } from './config';

function MangroveNetChange({
  data: rawData,
  filename,
  currentLocation,
  addFilter,
  isCollapsed,
  slug,
  name,
  ui: {
    startYear,
    endYear,
    unit,
    years,
  },
  setUi,
  ...props
}) {
  useEffect(() => {
    addFilter({
      filter: {
        id: 'net',
        startYear,
        endYear,
        years,
        year: '2016',
      }
    });
  }, [addFilter]);

  if (!rawData) {
    return null;
  }

  const data = config.parse(rawData, unit);
  const { metadata, chartData, chartConfig, downloadData } = data;

  const startYearOptions = metadata.years.map(year => ({
    label: year.toString(),
    value: year.toString()
  }));

  const endYearOptions = metadata.years.map(year => ({
    label: year.toString(),
    value: year.toString()
  }));

  const changeStartYear = (year) => {
    addFilter({
      filter: {
        id: 'net',
        startYear: year,
        endYear,
        range: {
          startYear: year,
          endYear,
        },
        years: metadata.years.filter(i => i >= year && i <= endYear),
        year,
        unit
      }
    });
    setUi({
      id: 'net',
      value: {
        startYear: year,
        endYear,
        range: {
          startYear,
          endYear: year,
        },
        years,
        year,
        unit
      }
    });
  };
  const changeEndYear = (year) => {
    addFilter({
      filter: {
        id: 'net',
        startYear,
        endYear,
        range: {
          startYear,
          endYear: year,
        },
        years: metadata.years.filter(i => i >= year && i <= endYear),
        year,
        unit
      }
    });
    setUi({
      id: 'net',
      value: {
        startYear,
        endYear: year,
        range: {
          startYear,
          endYear: year,
        },
        years,
        year,
        unit
      }
    });
  };
  const widgetData = chartData.filter(
    ({ year: y }) => parseInt(y, 10) >= parseInt(startYear, 10)
      && parseInt(y, 10) <= parseInt(endYear, 10)
  );

  // How this change is calculated?
  // Rows have year's 'gain', 'loss' and 'netChange'.
  // We consider startYear as 0
  // Therefore we substract that from the accumulated change of all following years.
  const change = (widgetData.length > 0) ? sumBy(widgetData, 'netChange') - widgetData[0].netChange : 0;
  const quantity = unit === 'km' ? numberFormat(Math.abs(change / 1000000)) : numberFormat(Math.abs(change / 10000));

  // Normalize startData
  widgetData[0] = {
    ...widgetData[0],
    gain: 0,
    loss: 0,
    netChange: 0
  };

  const location = currentLocation.location_type === 'worldwide' ? 'the world' : <span className="notranslate">{currentLocation.name}</span>;
  const direction = (change > 0) ? 'increased' : 'decreased';
  const changeUnit = (selectedUnit) => {
    addFilter({
      filter: {
        id: 'net',
        startYear,
        endYear,
        range: {
          startYear,
          endYear,
        },
        years,
        unit: selectedUnit
      }
    });
    setUi({
      id: 'net',
      value: {
        startYear,
        endYear,
        range: {
          startYear,
          endYear,
        },
        years,
        unit: selectedUnit
      }
    });
  };

  const startSelector = (
    <Select
      className="notranslate netChange"
      prefix="start-year"
      value={startYear}
      options={startYearOptions.splice(0, metadata.years.length - 1)}
      isOptionDisabled={option => parseInt(option.value, 10) > parseInt(endYear, 10)
        || option.value === startYear}
      onChange={changeStartYear}
    />);
  const endSelector = (
    <Select
      className="notranslate"
      prefix="end-year"
      value={endYear}
      options={endYearOptions.splice(1, metadata.years.length)}
      isOptionDisabled={option => parseInt(option.value, 10) < parseInt(startYear, 10)
        || option.value === endYear}
      onChange={changeEndYear}
    />);

  const unitOptions = [
    { value: 'km', label: 'km²' },
    { value: 'ha', label: 'ha' }
  ];

  const unitSelector = (
    <Select
      value={unit}
      options={unitOptions}
      onChange={changeUnit}
    />
  );

  const sentence = (
    <>
      The extent of mangroves in <strong>{location}</strong>&nbsp;
      has <strong>{direction}</strong> by <strong>{quantity}</strong> {unitSelector}
      &nbsp;between {startSelector} and {endSelector}.
    </>
  );

  const chartRData = {
    data: widgetData,
    config: chartConfig
  };

  return (
    <ChartWidget
      name={name}
      data={data}
      slug={slug}
      filename={slug}
      downloadData={downloadData}
      isCollapsed={isCollapsed}
      sentence={sentence}
      chartData={chartRData}
      {...props}
    />
  );
}

MangroveNetChange.propTypes = {
  name: PropTypes.string,
  data: PropTypes.shape({}),
  slug: PropTypes.string,
  filename: PropTypes.string,
  currentLocation: PropTypes.shape({}),
  addFilter: PropTypes.func
};

MangroveNetChange.defaultProps = {
  name: null,
  data: null,
  slug: null,
  filename: null,
  currentLocation: null,
  addFilter: null
};

export default MangroveNetChange;
