import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ChartWidget from 'components/chart-widget';
import config from './config';

function MangroveBlueCarbon({
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
        id: 'carbon',
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

  const { avobeGround, soils, totalBiomass } = totalValues;

  const location = (currentLocation.location_type === 'worldwide')
    ? 'the world'
    : <span className="notranslate">{`${currentLocation.name}`}</span>;

  const sentence = (
    <>
      Total organic carbon stored in
      <strong>&nbsp;{location}{"'"}s&nbsp;</strong>
      mangroves is estimated at
      &nbsp;<strong>{totalBiomass}</strong> Mt CO₂e
      with <strong>{avobeGround}</strong> Mt CO₂e stored in above-ground biomass and
      &nbsp;<strong>{soils}</strong> Mt CO₂e stored in the upper 1m of soil.
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

MangroveBlueCarbon.propTypes = {
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

MangroveBlueCarbon.defaultProps = {
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

export default MangroveBlueCarbon;
