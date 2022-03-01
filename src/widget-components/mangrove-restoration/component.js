import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';

import { format } from 'd3-format';

import config from './config';

import ChartWidget from 'components/chart-widget';
import Select from 'components/select';

const numberFormat = format(',.2f')

function MangroveProtection({
  data,
  currentLocation,
  isCollapsed = true,
  slug,
  name,
  addFilter,
  ui: { year, unit },
  setUi,
  ui,
  fetchMangroveProtectionData,
  ...props
}) {

  // TO DO - update when data is ready
  // const { metadata: { units, years }, data: dataTotal } = data;
  const years = useMemo(() => [2010], []);
  const units = useMemo(() => ['ha', 'km²'], []);

  useEffect(() => {
    addFilter({
      filter: {
        id: 'protection',
        year: years[years.length - 1],
        unit: units[0],
      }
    });
    fetchMangroveProtectionData({ year })
    setUi({ id: 'protection', value: { year: year || years[years.length - 1], unit: unit || units[0] }});
  }, [addFilter, year, unit]);
  if (!data) {
    return null;
  }
  const parsedData = unit === 'ha' ? data : ({
    ...data,
    total_area: data.total_area / 100,
    protected_area: data.protected_area / 100,
  });

  const { chartData, chartConfig } = config.parse(parsedData, unit);

  if (!chartData) {
    return null;
  }

  const changeYear = (current) => {
    addFilter({
      filter: {
        ...ui,
        id: 'protection',
        year: current, 
      }
    });
    setUi({ id: 'protection', value: { year: current } });
  };

  const changeUnit = (current) => {
    addFilter({
      filter: {
        ...ui,
        id: 'protection',
        unit: current
      }
    });
    setUi({ id: 'protection', value: { unit: current } });
  };

  const optionsYears = sortBy(years.map(year => ({
    label: year.toString(),
    value: year
  })), ['value']);

  const optionsUnits = sortBy(units.map(unit => ({
    label: unit.toString(),
    value: unit
  })), ['value']);

  const location = (currentLocation.location_type === 'worldwide')
    ? 'the world'
    : <span className="notranslate">{`${currentLocation.name}`}</span>;


  const totalAreaProtected = numberFormat(parsedData.protected_area);
  const totalArea = numberFormat(parsedData.total_area);
  
  const displayYear = (optionsYears.length > 1 ?
    <Select
      className="notranslate"
      width="auto"
      value={year || years[years.length - 1]}
      options={optionsYears}
      onChange={changeYear}
    />
    : optionsYears[0].label
  );

  const displayUnit = (units.length > 1 ?
    <Select
      className="notranslate"
      width="auto"
      value={unit || units[0]}
      options={optionsUnits}
      onChange={changeUnit}
    />
    : units[0].label
  );

  const sentence = (
    <>
      Mangroves in protected areas in
      <strong>&nbsp;{location}&nbsp;</strong>
      in
      &nbsp;<strong>{displayYear}</strong> represented <strong>{totalAreaProtected}{' '}{displayUnit}</strong> of <strong>{totalArea}{' '}{displayUnit}</strong>.
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
