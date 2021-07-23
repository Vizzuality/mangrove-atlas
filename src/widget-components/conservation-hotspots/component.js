import React from 'react';
import Select from 'components/select';
import PropTypes from 'prop-types';
import ChartWidget from 'components/chart-widget';
import { format } from 'd3-format';
import config from './config';

import styles from './style.module.scss';

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
  isCollapsed = true,
  slug,
  name,
  ui: scope,
  setUi,
  ...props
}) {
  if (!rawData) {
    return null;
  }


  const data = config.parse(rawData, { scope });
  const { chartConfig } = data;
  const currentYear = 1996;
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

    const highestValue = numberFormat(Math.max(
      ...chartData.data.map(o => (o.percentage ? o.percentage : null))
    ));

    const highestCategory = (chartData.data).find(
      findData => numberFormat(Number(findData.percentage)) === highestValue
    ).label;

    const scopeOptions = [
      { label: 'short–term', value: 'short' },
      { label: 'medium–term', value: 'medium' },
      { label: 'long–term', value: 'long' }
    ];

    const changeScopeHandler = (value) => {
      setUi({ id: 'conservation_hotspots', value });
      addFilter({
        filter: {
          id: 'cons-hotspots',
          scope: value
        }
      });
    };

    const scopeSelector = (
      <Select
        className={styles.hotspotSelect}
        value={scope}
        options={scopeOptions}
        isOptionDisabled={option => option.value === scope}
        onChange={changeScopeHandler}
      />
    );

    sentence = (
      <>
        In the <span className="notranslate">{scopeSelector}</span> <strong className="notranslate">{highestValue} %</strong> of the mangrove habitat in <strong>{location}</strong> was classed as <strong>{highestCategory}</strong>.
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
  ui: PropTypes.string,
  setUi: PropTypes.func
};

ConservationHotspots.defaultProps = {
  data: null,
  currentLocation: null,
  addFilter: () => {},
  isCollapsed: false,
  slug: null,
  name: null,
  metadata: null,
  ui: null,
  setUi: () => {}
};

export default ConservationHotspots;
