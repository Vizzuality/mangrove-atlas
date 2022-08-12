import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { getCurrentLocation } from 'modules/pages/sagas';
import { WORLWIDE_LOCATION_ID } from 'modules/widgets/constants';

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
  locationType,
  ...props
}) {
  const { id } = currentLocation;
  const location = getCurrentLocation(locationsList, current, locationType);

  useEffect(() => {
    if (current === 'worldwide' || current === WORLWIDE_LOCATION_ID) {
      fetchMangroveSpeciesData()
    }
    else {
      fetchMangroveSpeciesData({ ...(id && id !== WORLWIDE_LOCATION_ID) && { location_id: id } });
    }
  }, [id, current, locationsList, fetchMangroveSpeciesData]);

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
    : <span className="notranslate">{`${location?.name}`}</span>;

  const article = threatened === 1 ? 'is' : 'are';

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
