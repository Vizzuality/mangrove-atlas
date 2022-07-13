import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
<<<<<<< HEAD
import ChartWidget from 'components/chart-widget';
=======

import { getCurrentLocation } from 'modules/pages/sagas';

import ChartWidget from 'components/chart-widget';


>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363
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
<<<<<<< HEAD
  ...props
}) {

  useEffect(() => {
    if (currentLocation && (currentLocation.id || currentLocation.location_id || currentLocation.iso)) {
      if (currentLocation.id === 'worldwide') {
        fetchMangroveSpeciesData();
      } else {
        let location = locationsList.find(l => (l.iso === currentLocation.iso && l.location_type === 'country'));

        // Find by location_id
        if (!location) {
          location = locationsList.find(l => (l.location_id === currentLocation?.location_id || l.location_id === currentLocation.id));
        }
        // eslint-disable-next-line camelcase
        const { id } = location;

        fetchMangroveSpeciesData({ location_id: id });
      }
    }
  }, [currentLocation, locationsList, fetchMangroveSpeciesData]);
=======
  current,
  locationType,
  ...props
}) {
  const { id } = currentLocation;
  const location = getCurrentLocation(locationsList, current, locationType);

  useEffect(() => {
    if (current === 'worldwide' || current === 1561) {
      fetchMangroveSpeciesData()
    }
    else {
      fetchMangroveSpeciesData({ ...(id && id !== 1561) && { location_id: id } });
    }
  }, [currentLocation, current, locationsList, fetchMangroveSpeciesData]);
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363

  useEffect(() => {
    addFilter({
      filter: {
        id: 'species',
      }
    });
  }, [addFilter]);

<<<<<<< HEAD
  const { list } = data;

  const threatened = list?.threatened;
  const total = list?.total;
  
  const { chartData, chartConfig } = config.parse(data);

  const location = (currentLocation.location_type === 'worldwide')
    ? 'The world'
    : <span className="notranslate">{`${currentLocation.name}`}</span>;
=======
  const { threatened, total } = data;
  
  const { chartData, chartConfig } = config.parse(data);

  const locationName = (currentLocation.location_type === 'worldwide')
    ? 'The world'
    : <span className="notranslate">{`${location.name}`}</span>;
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363

  const article = threatened > 1 ? 'are' : 'is';

  const sentence = (
    <>
<<<<<<< HEAD
      <strong>{location} </strong>has <strong>{total}</strong> species of mangroves.
=======
      <strong>{locationName} </strong>has <strong>{total}</strong> species of mangroves.
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363
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
