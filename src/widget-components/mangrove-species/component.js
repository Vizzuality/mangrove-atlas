import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ChartWidget from 'components/chart-widget';
import config from './config';

function MangroveSpecies({
  data,
  currentLocation,
  locationsList,
  isCollapsed = true,
  slug,
  name,
  addFilter,
  ui,
  setUi,
  fetchMangroveSpeciesData,
  current,
  ...props
}) {
  const { id } = currentLocation;
  const location = locationsList.find(location => location.id === id);

  useEffect(() => {
    if (current === 'worldwide' || current === 1561) {
      fetchMangroveSpeciesData()
    }
    else {
      fetchMangroveSpeciesData({ ...(id && id !== 1561) && { location_id: id } });
    }
  }, [currentLocation, current, locationsList, fetchMangroveSpeciesData]);

  useEffect(() => {
    addFilter({
      filter: {
        id: 'species',
      }
    });
  }, [addFilter]);

  const { threatened, total } = data;
  
  const { chartData, chartConfig } = config.parse(data);

  const locationName = (currentLocation.location_type === 'worldwide')
    ? 'The world'
    : <span className="notranslate">{`${location.name}`}</span>;

  const article = threatened > 1 ? 'are' : 'is';

  const sentence = (
    <>
      <strong>{locationName} </strong>has <strong>{total}</strong> species of mangroves.
      Of them, <strong>{threatened}</strong> {article} considered
      <strong> threatened</strong> by the IUCN Red List.
    </>
  );

  const widgetData = {
    data: chartData,
    config: chartConfig
  };

  if (!chartData || !chartData.length || !data) {
    return null;
  }

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
