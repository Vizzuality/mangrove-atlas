import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ChartWidget from 'components/chart-widget';
import config from './config';

function MangroveSpecies({
  data,
  currentLocation,
  isCollapsed = true,
  slug,
  name,
  addFilter,
  ui,
  setUi,
  fetchMangroveSpeciesData,
  ...props
}) {
  useEffect(() => {
    addFilter({
      filter: {
        id: 'species',
      }
    });
    const { location_id } = currentLocation;
    fetchMangroveSpeciesData({ location_id })
  }, [addFilter, currentLocation]);
  if (!data) {
    return null;
  }

  const { list: { endemic, threatened, total } } = data;

  const { chartData, chartConfig } = config.parse(data);

  if (!chartData || chartData.length <= 0) {
    return null;
  }

  const location = (currentLocation.location_type === 'worldwide')
    ? 'the world'
    : <span className="notranslate">{`${currentLocation.name}`}</span>;

  const article = total > 1 ? 'are' : 'is';
  const articleThreatened = threatened > 1 ? 'are' : 'is';

  const sentence = (
    <>
      <strong>{location} </strong>has <strong>{total}</strong> species of mangroves.
      Of them, <strong>{endemic}</strong> {article}<strong> endemic</strong> and <strong>{threatened}</strong> {articleThreatened} considered
      <strong> threatened</strong> by the IUCN Red List.
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

MangroveSpecies.propTypes = {
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

MangroveSpecies.defaultProps = {
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

export default MangroveSpecies;
