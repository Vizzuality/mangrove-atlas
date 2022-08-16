import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import sumBy from 'lodash/sumBy';

import ChartWidget from 'components/chart-widget';
import Select from 'components/select';

import { WORLWIDE_LOCATION_ID } from 'modules/widgets/constants';

import config, { numberFormat } from './config';

const unitOptions = [
  { value: 'ha', label: 'ha' },
  { value: 'km', label: 'km²' }
];

function MangroveNetChange({
  data: rawData,
  filename,
  current,
  locations,
  locationType,
  addFilter,
  isCollapsed = true,
  slug,
  name,
  ui,
  setUi,
  fetchMangroveNetChangeData,
  currentLocation,
  ...props
}) {
  const { startYear, endYear, unit } = ui;
  const years = useMemo(() => rawData?.list
    .map(({ year }) => year).sort(), [rawData]);

  const id = current?.iso || current?.id;

  useEffect(() => {
    fetchMangroveNetChangeData({
      ...currentLocation?.id !== WORLWIDE_LOCATION_ID && {
        location_id: currentLocation.id,
      },
    });
  }, [fetchMangroveNetChangeData, currentLocation])

  useEffect(() => {
    addFilter({
      filter: {
        id: 'net',
        startYear: startYear || years[0],
        endYear: (endYear || years[years.length - 1]),
        years,
        unit: unit || unitOptions[0].value,
      }
    });
    setUi({
      id: 'net',
      value: { endYear: (endYear || years[years.length - 1]), startYear: startYear || years[0], unit: unit || unitOptions[0].value, } });
  }, [years, startYear, endYear, unit, addFilter, setUi]);


  if (!rawData) {
    return null;
  }

  const data = config.parse(rawData, unit);
  const { chartData, chartConfig } = data;

  const startYearOptions = years.map(year => ({
    label: year.toString(),
    value: year
  }));

  const endYearOptions = years.map(year => ({
    label: year.toString(),
    value: year
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
        years: years.filter(i => i >= year && i <= endYear),
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
        years: years.filter(i => i >= year && i <= endYear),
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
  const quantity = unit === 'km' ? numberFormat(change) : numberFormat(change * 100);

  // Normalize startData
  widgetData[0] = {
    ...widgetData[0],
    netChange: 0
  };

  const location = currentLocation?.location_type === 'worldwide' ? 'the world' : <span className="notranslate">{currentLocation.name}</span>;
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
      options={startYearOptions.splice(0, years.length - 1)}
      isOptionDisabled={option => parseInt(option.value, 10) > parseInt(endYear, 10)
        || option.value === startYear}
      onChange={changeStartYear}
    />);
  const endSelector = (
    <Select
      className="notranslate"
      prefix="end-year"
      value={endYear}
      options={endYearOptions.splice(1, years.length)}
      isOptionDisabled={option => parseInt(option.value, 10) < parseInt(startYear, 10)
        || option.value === endYear}
      onChange={changeEndYear}
    />);

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
