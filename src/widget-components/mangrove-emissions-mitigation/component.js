import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import ChartWidget from 'components/chart-widget';

import { WORLWIDE_LOCATION_ID } from 'modules/widgets/constants';

import config from './config';

function MangroveEmissionsMitigation({
  data,
  currentLocation,
  locationsList,
  isCollapsed = true,
  slug,
  name,
  addFilter,
  ui,
  setUi,
  fetchMangroveEmissionsMitigationData,
  current,
  locationType,
  ...props
}) {
  const { id } = currentLocation;
  const [filteredIndicators, setFilteredIndicators] = useState([]);

  useEffect(() => {
    if (current === 'worldwide' || current === WORLWIDE_LOCATION_ID) {
      fetchMangroveEmissionsMitigationData()
    }
    else {
      fetchMangroveEmissionsMitigationData({ ...(id && id !== WORLWIDE_LOCATION_ID) && { location_id: id } });
    }
  }, [id, current, locationsList, fetchMangroveEmissionsMitigationData]);

  useEffect(() => {
    addFilter({
      filter: {
        id: 'species',
      }
    });
  }, [addFilter]);


  const { chartData, chartConfig } = config.parse(data, filteredIndicators, setFilteredIndicators);
  const locationName = (currentLocation.location_type === 'worldwide')
    ? 'the world'
    : <span className="notranslate">{`${currentLocation?.name}`}</span>;

  const sentence = (
    <>
      Emissions mitigation by area for mangrove and non-mangrove related interventions in <strong>{locationName}</strong>
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

MangroveEmissionsMitigation.propTypes = {
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

MangroveEmissionsMitigation.defaultProps = {
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

export default MangroveEmissionsMitigation;
