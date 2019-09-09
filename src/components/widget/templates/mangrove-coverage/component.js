import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import sortBy from 'lodash/sortBy';
import Chart from 'components/chart';
import Select from 'components/select';
import styles from 'components/widget/style.module.scss';

const numberFormat = format(',.2f');

function processData(data, currentYear) {
  const { chartData, metadata } = data;
  const currentYearData = chartData.find(d => d.x === currentYear);

  if (!currentYearData) {
    throw new Error('No data error.');
  }

  const nonMangrove = metadata.total - currentYearData.value;

  return [
    {
      ...currentYearData
    },
    {
      x: 0,
      y: nonMangrove,
      color: '#ECECEF',
      percentage: nonMangrove / metadata.total * 100,
      unit: '%',
      coverage: (nonMangrove / 1000).toFixed(2),
      label: 'Non mangroves'
    }
  ];
}

function MangroveCoverage({ data, currentLocation, addFilter }) {
  const { chartConfig, metadata } = data;
  const [coverageState, setCoverageState] = useState({ currentYear: 1996, unit: '%'});
  const { currentYear, unit } = coverageState;
  const optionsYears = sortBy(metadata.years.map(year => ({
    label: year.toString(),
    value: year
  })), ['value']);
  let content = null;

  const changeYear = (currentYear) => {
    addFilter({
      filter: {
        id: 'coverage-1996-2016',
        year: currentYear
      }
    });
    setCoverageState({ ...coverageState, currentYear });
  };

  const changeUnit = (unit) => {
    setCoverageState({ ...coverageState, unit });
  };

  try {
    const widgetData = processData(data, currentYear);
    const { percentage } = widgetData[0];
    const unitOptions = [
      { value: '%', label: '%' },
      { value: 'km', label: 'km' }
    ];
    const totalCoverage = metadata.total / 1000;
    const coverage = (percentage * totalCoverage) / 100;
    const quantity = numberFormat((unit === '%') ? percentage : coverage);
    const location = (currentLocation.location_type === 'worldwide')
      ? 'the world’s'
      : <span className="notranslate">{`${currentLocation.name}'s`}</span>;
    const unitSelector = (<Select
      value={unit}
      options={unitOptions}
      onChange={changeUnit}
    />);
    const yearSelector = (<Select
      className="notranslate"
      width="auto"
      value={currentYear}
      options={optionsYears}
      onChange={changeYear}
    />);

    content = (
      <>
        <div className={styles.sentence}>
          <span>Mangrove forest cover </span>
          <strong className="notranslate">{ quantity } {unitSelector}</strong><br />
          <span>of </span> <strong>{ location } </strong>
          <strong className="notranslate">{ numberFormat(totalCoverage)}km</strong> coastline<br />
          <span>in </span>{yearSelector}.
        </div>
        <Chart
          data={widgetData}
          config={chartConfig}
        />
      </>
      );
  } catch(e) {
    content = (
      <div className={styles.sentence}>
        <span>No data for this widget.</span>
      </div>
      );
  }

  return <div className={styles.widget_template}>{content}</div>;
}

MangroveCoverage.propTypes = {
  data: PropTypes.shape({}),
  metadata: PropTypes.shape({}),
  currentLocation: PropTypes.shape({})
}

MangroveCoverage.defaultProps = {
  data: null,
  metadata: null,
  currentLocation: null
}

export default MangroveCoverage;
