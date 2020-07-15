import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import ChartWidget from 'components/chart-widget';
import config from './config';

const numberFormat = format(',.2f');

function MangroveBlueCarbon({
  data: rawData,
  currentLocation,
  isCollapsed,
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
  const { chartData, totalValues, chartConfig } = config.parse(rawData);
  if (!chartData || chartData.length <= 0) {
    return null;
  }

  const { bgb_co2e, agb_co2e, soc_co2e } = totalValues;

  const totalSoil = numberFormat(soc_co2e / 1000000);
  const totalBiomass = numberFormat((bgb_co2e + totalSoil) / 1000000);
  const aboveGroundBiomass = numberFormat(agb_co2e / 1000000);

  const location = (currentLocation.location_type === 'worldwide')
    ? 'the world'
    : <span className="notranslate">{`${currentLocation.name}`}</span>;

  const sentence = (
    <>
      Total organic carbon stored in <strong>{location}'s</strong> mangroves is estimated at
      &nbsp;<strong>{totalBiomass}</strong> Mt CO2e  with <strong>{aboveGroundBiomass}</strong> Mt CO2e stored in above-ground biomass and
      &nbsp;<strong>{totalSoil}</strong> Mt CO2e stored in the upper 1m of soil.
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
