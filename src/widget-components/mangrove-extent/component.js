import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import sortBy from 'lodash/sortBy';

import ChartWidget from 'components/chart-widget';
import Select from 'components/select';

import config from './config';

const numberFormat = format(',.2f');

function MangroveExtent({
  data,
  metadata,
  currentLocation,
  addFilter,
  isCollapsed = true,
  slug,
  ui: {
    currentYear,
    unit
  },
  setUi,
  fetchMangroveHabitatExtentData,
  ...props
}) {

  useEffect(() => {
      fetchMangroveHabitatExtentData({
        ...currentLocation?.iso !== "WORLDWIDE" && {
          location_id: currentLocation.id,
        },
      });
  }, [fetchMangroveHabitatExtentData, currentLocation])

  useEffect(() => {
    addFilter({
      filter: {
        id: 'extent',
        year: '2016'
      }
    });
  }, [addFilter, unit]);

  if (!data || !data.length) {
    return null;
  }

  const { total_area, total_lenght } = metadata;
  const { totalMangroveArea, chartConfig, chartData, downloadData } = config.parse(data, metadata, currentYear, unit);
  const optionsYears = sortBy((metadata?.year || []).map(year => ({
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

  const widgetData = {
    data: chartData,
    config: chartConfig
  };

  try {
    const unitOptions = [
      { value: 'km', label: 'km²' },
      { value: 'ha', label: 'ha' }
    ];
    const totalCoverage = unit === 'ha' ? numberFormat(total_lenght * 100) : numberFormat(total_lenght);
    const area = unit === 'ha'
      ? numberFormat(totalMangroveArea * 100)
      : numberFormat(totalMangroveArea);

    const coveragePercentage = unit === 'ha'
    ? numberFormat(total_area * 100)
    : numberFormat(total_area);

    const location = (currentLocation.location_type === 'worldwide')
      ? 'the world'
      : <span className="notranslate">{`${currentLocation?.name}`}</span>;
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
        <strong className="notranslate"> {totalCoverage} km</strong><span> of the coastline.<br /></span>
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
      isCollapsed={isCollapsed}
      downloadData={downloadData}
      sentence={sentence}
      chartData={widgetData}
      {...props}
    />
  );
}

MangroveExtent.propTypes = {
  data: PropTypes.shape({}),
  metadata: PropTypes.shape({}),
  currentLocation: PropTypes.shape({}),
  addFilter: PropTypes.func,
  isCollapsed: PropTypes.bool,
  slug: PropTypes.string,
  ui: PropTypes.shape({
    currentYear: PropTypes.number,
    unit: PropTypes.string
  }),
  setUi: PropTypes.func,
  fetchMangroveHabitatExtentData: PropTypes.func,
};

MangroveExtent.defaultProps = {
  data: null,
  metadata: null,
  currentLocation: null,
  addFilter: () => {},
  isCollapsed: true,
  slug: null,
  ui: null,
  setUi: () => {},
  fetchMangroveHabitatExtentData: () => {},
};

export default MangroveExtent;
