import React, { useEffect, useMemo } from 'react';
import Select from 'components/select';
import PropTypes from 'prop-types';
import ChartWidget from 'components/chart-widget';
import sortBy from 'lodash/sortBy';

import config from './config';


function MangroveBiomass({
  data: rawData,
  currentLocation,
  isCollapsed = true,
  slug,
  name,
  addFilter,
  ui,
  setUi,
  ...props
}) {
  const { year } = ui;

  const years = useMemo(() => sortBy(rawData?.filter(({ agb_hist_mgha_1, agb_mgha_1 }) => agb_hist_mgha_1 && agb_mgha_1), ['date', 'desc'])
    .map(({ date }) => date),
  [rawData]);

  const yearSelected = years[0]?.split('-')[0];

  useEffect(() => {
    addFilter({
      filter: {
        id: 'biomass',
        year: (year || yearSelected),
      }
    });
    setUi({ 
      id: 'biomass',
      value: {
        ...ui,
        year: (year || yearSelected),
      }
    });
  }, [addFilter, year, yearSelected]);

  if (!rawData || !year) {
    return null;
  };

  const { chartData, metadata, chartConfig, coverage, downloadData } = config.parse(rawData, year);
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

  const dateOptions = years && sortBy(years.map(year => ({
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
      &nbsp;was <strong>{coverage} t / ha</strong> in <strong>{dateOptions.length > 1 ? yearSelector : year}</strong>.
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
      downloadData={downloadData}
      isCollapsed={isCollapsed}
      sentence={sentence}
      chartData={widgetData}
      {...props}
    />
  );
}

MangroveBiomass.propTypes = {
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

MangroveBiomass.defaultProps = {
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

export default MangroveBiomass;
