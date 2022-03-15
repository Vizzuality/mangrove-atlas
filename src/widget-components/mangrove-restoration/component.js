import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import { InView } from 'react-intersection-observer';

import { format } from 'd3-format';

import config from './config';

import Widget from 'components/widget';
import Chart from 'components/chart';
import Select from 'components/select';
import WidgetControls from 'components/widget-info-icons/component';

import { Treemap } from 'recharts';

import styles from 'components/widget/style.module.scss';

const numberFormat = format(',.2f');

function MangroveRestoration({
  data,
  component,
  currentLocation,
  isCollapsed = true,
  slug,
  name,
  addFilter,
  ui: { year, unit },
  setUi,
  ui,
  fetchMangroveRestorationData,
  ...props
}) {

  // TO DO - update when data is ready
  // const { metadata: { units, years }, data: dataTotal } = data;
  const years = useMemo(() => [2010], []);
  const units = useMemo(() => ['ha', 'km²'], []);

  useEffect(() => {
    addFilter({
      filter: {
        id: 'restoration',
        year: years[years.length - 1],
        unit: units[0],
      }
    });
    fetchMangroveRestorationData({ year })
    setUi({ id: 'restoration', value: { year: year || years[years.length - 1], unit: unit || units[0] } });
  }, [addFilter, year, unit]);
  if (!data) {
    return null;
  }
  const parsedData = unit === 'ha' ? data : ({
    ...data,
    total_area: data.total_area / 100,
    protected_area: data.protected_area / 100,
  });

  const {
    chartLineData,
    chartLineConfig,
    chartRingData,
    chartRingConfig,
    chartTreeData,
    chartTreeConfig,
  }
  = config.parse(parsedData, unit);
  
  if (!chartLineData || !chartRingData || !chartTreeData) {
    return null;
  }
  const changeYear = (current) => {
    addFilter({
      filter: {
        ...ui,
        id: 'restoration',
        year: current,
      }
    });
    setUi({ id: 'restoration', value: { year: current } });
  };

  const changeUnit = (current) => {
    addFilter({
      filter: {
        ...ui,
        id: 'restoration',
        unit: current
      }
    });
    setUi({ id: 'restoration', value: { unit: current } });
  };

  const optionsYears = sortBy(years.map(year => ({
    label: year.toString(),
    value: year
  })), ['value']);

  const optionsUnits = sortBy(units.map(unit => ({
    label: unit.toString(),
    value: unit
  })), ['value']);

  const location = (currentLocation.location_type === 'worldwide')
    ? 'the world'
    : <span className="notranslate">{`${currentLocation.name}`}</span>;


  const totalAreaProtected = numberFormat(parsedData.protected_area);
  const totalArea = numberFormat(parsedData.total_area);

  const displayYear = (optionsYears.length > 1 ?
    <Select
      className="notranslate"
      width="auto"
      value={year || years[years.length - 1]}
      options={optionsYears}
      onChange={changeYear}
    />
    : optionsYears[0].label
  );

  const displayUnit = (units.length > 1 ?
    <Select
      className="notranslate"
      width="auto"
      value={unit || units[0]}
      options={optionsUnits}
      onChange={changeUnit}
    />
    : units[0].label
  );

  const restorationPotentialScore = "68%";

  const widgetDataLine = {
    data: chartLineData,
    config: chartLineConfig,
  };

  const widgetDataRing = {
    data: chartRingData,
    config: chartRingConfig,
  };

  const widgetDataTree = {
    data: chartTreeData,
    config: chartTreeConfig
  }

  const lossDriver = "Commodities";

  // charts sentences
  const restorationPotentialLineSentence = (
    <>
      The mean restoration potential score for {location} is {restorationPotentialScore}.
    </>
  );

  const restorationPotentialRingSentence = (
    <>
      Mangroves in protected areas in
      <strong>&nbsp;{location}&nbsp;</strong>
      in
      &nbsp;<strong>{displayYear}</strong> represented <strong>{totalAreaProtected}{' '}{displayUnit}</strong> of <strong>{totalArea}{' '}{displayUnit}</strong>.
    </>
  );

  const restorationPotentialTreeMapSentence = (
    <>
      The main mangrove loss driver in <strong>{location}</strong> is <strong>{lossDriver}</strong> (rice, shrimp, and oil palm cultivation)
    </>
  );

  return (
    <>
      <Widget className={styles.widget} {...props} styles={{ height: 3000 }}>
        <div className={styles.widget_template}>
          <div className={styles.restorationPotentialSentence} key={Date.now()}>
            {restorationPotentialLineSentence}
          </div>
          <Chart
            {...props}
            name={name}
            slug={slug}
            filename={slug}
            isCollapsed={isCollapsed}
            sentence={restorationPotentialLineSentence}
            data={chartLineData}
            config={chartLineConfig}
            chartData={widgetDataLine}
          />
          <div className={styles.sentence} key={Date.now()}>
            {restorationPotentialRingSentence}
          </div>

          <Chart
            {...props}
            name={name}
            slug={slug}
            filename={slug}
            isCollapsed={isCollapsed}
            sentence={restorationPotentialRingSentence}
            data={chartRingData}
            config={chartRingConfig}
            chartData={widgetDataRing}
          />
          <div className={styles.sentence} key={Date.now()}>
            {restorationPotentialTreeMapSentence}
          </div>
          <Chart
            {...props}
            name={name}
            slug={slug}
            filename={slug}
            isCollapsed={isCollapsed}
            sentence={restorationPotentialTreeMapSentence}
            data={chartTreeData}
            config={chartTreeConfig}
            chartData={widgetDataTree}
          />
          {component}
        </div>
      </Widget>
    </>

  );
}

MangroveRestoration.propTypes = {
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

MangroveRestoration.defaultProps = {
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

export default MangroveRestoration;
