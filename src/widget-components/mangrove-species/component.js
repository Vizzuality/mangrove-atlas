import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ChartWidget from 'components/chart-widget';
import config from './config';

function MangroveSpecies({
  data: rawData,
  currentLocation,
  isCollapsed = true,
  slug,
  name,
  addFilter,
  ui: yearSelected,
  setUi,
  ...props
}) {
  useEffect(() => {
    addFilter({
      filter: {
        id: 'species',
        year: '2016'
      }
    });
  }, [addFilter]);
  if (!rawData) {
    return null;
  }

  const { chartData, totalValues, chartConfig, downloadData } = config.parse(rawData);

  if (!chartData || chartData.length <= 0) {
    return null;
  }

  const location = (currentLocation.location_type === 'worldwide')
    ? 'the world'
    : <span className="notranslate">{`${currentLocation.name}`}</span>;

  const sentence = (
    <>
      <strong>{location} </strong>has <strong>45</strong> species of mangroves.
      Of them, <strong>1</strong> is<strong> endemic</strong> and <strong>4</strong> are considered
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
      downloadData={downloadData}
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
