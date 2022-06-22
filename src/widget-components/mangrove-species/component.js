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

  useEffect(() => {
    addFilter({
      filter: {
        id: 'species',
      }
    });
  }, [addFilter]);

  const { list } = data;

  const threatened = list?.threatened;
  const total = list?.total;
  
  const { chartData, chartConfig } = config.parse(data);

  const location = (currentLocation.location_type === 'worldwide')
    ? 'The world'
    : <span className="notranslate">{`${currentLocation.name}`}</span>;

  const article = threatened > 1 ? 'are' : 'is';

  const sentence = (
    <>
      <strong>{location} </strong>has <strong>{total}</strong> species of mangroves.
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
