import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ChartWidget from 'components/chart-widget';
import { format } from 'd3-format';
import config from './config';


const numberFormat = format(',.2f');

function processData(data, currentYear) {
  const { chartData } = data;
  if (!chartData[0]) return null;
  const currentYearData = chartData.filter(d => d.x === currentYear);
  if (!currentYearData) {
    return null;
  }
  return currentYearData;
}

function ConservationHotspots({
  data: rawData,
  currentLocation,
  addFilter,
  isCollapsed,
  slug,
  name,
  ...props
}) {
  const [scopeState] = useState('short');
  if (!rawData) {
    return null;
  }

  const data = config.parse(rawData, {
    scope: scopeState
  });
  const { metadata, chartConfig } = data;
  const currentYear = 1996;
  const { years } = metadata;

  const endYear = Math.max(...years);
  const startYear = Math.min(...years);

  const widgetData = processData(data, currentYear);
  let sentence = null;

  if (widgetData === null) {
    return null;
  }

  const chartData = {
    data: widgetData,
    config: chartConfig
  };

  try {
    const location = (currentLocation.location_type === 'worldwide')
      ? 'the world'
      : <span className="notranslate">{`${currentLocation.name}`}</span>;

    const highestValue = Math.max(
      ...chartData.data.map(o => (o.percentage ? numberFormat(o.percentage) : null))
    );

    const highestCategory = (chartData.data).find(
      findData => Number(numberFormat(findData.percentage)) === highestValue
    ).label;

    sentence = (
      <>
        <span>Mangrove habitat in <strong>{location}</strong> was <strong className="notranslate">{highestValue} %</strong> classified as <strong>{highestCategory}</strong> for the period <strong className="notranslate"> {startYear}–{endYear}</strong>.</span>
      </>
    );
  } catch (e) {
    sentence = <span>No data for this widget.</span>;
  }
  if (!widgetData) return null;

  return (
    <ChartWidget
      name={name}
      data={data}
      slug={slug}
      filename={slug}
      isCollapsed={isCollapsed}
      sentence={sentence}
      chartData={chartData}
      {...props}
    />
  );
}

ConservationHotspots.propTypes = {
  data: PropTypes.shape({}),
  currentLocation: PropTypes.shape({}),
  addFilter: PropTypes.func,
  isCollapsed: PropTypes.bool,
  slug: PropTypes.string,
  name: PropTypes.string,
  metadata: PropTypes.shape({}),
};

ConservationHotspots.defaultProps = {
  data: null,
  currentLocation: null,
  addFilter: () => {},
  isCollapsed: false,
  slug: null,
  name: null,
  metadata: null,
};

export default ConservationHotspots;
