import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import sumBy from 'lodash/sumBy';

import ChartWidget from 'components/chart-widget';
import Select from 'components/select';
import config from './config';

const numberFormat = format(',.2f');

function MangroveNetChange({ data: rawData, currentLocation, addFilter, isCollapsed, slug, name, ...props }) {
  const [netChangeState, setNetChangeState] = useState({
    startYear: '1996',
    endYear: '2016'
  });

  if (!rawData) {
    return null;
  }

  const data = config.parse(rawData); 
  const { metadata, chartData, chartConfig } = data;
  const { startYear, endYear } = netChangeState;
  const optionsYears = metadata.years.map(year => ({
    label: year.toString(),
    value: year.toString()
  }));

  // TODO: This must be done in the API
  const editedChartData = [
    {
      x: '1996',
      netChange: 0,
      gain: 0,
      loss: 0,
      name: '1996',
      year: 1996
    },
    ...chartData
  ];

  const changeStartYear = (year) => {
    addFilter({
      filter: {
        id: 'net-change-1996-2016',
        startYear: year,
        endYear: netChangeState.endYear
      }
    });
    setNetChangeState({ ...netChangeState, startYear: year });
  };
  const changeEndYear = (year) => {
    addFilter({
      filter: {
        id: 'net-change-1996-2016',
        startYear: netChangeState.startYear,
        endYear: year
      }
    });
    setNetChangeState({ ...netChangeState, endYear: year });
  };

  const widgetData = editedChartData.filter(
    ({ year: y }) => parseInt(y, 10) >= parseInt(startYear, 10)
    && parseInt(y, 10) <= parseInt(endYear, 10)
  );

  // How this change is calculated?
  // Rows have year's 'gain', 'loss' and 'netChange'.
  // We consider startYear as 0
  // Therefore we substract that from the accumulated change of all following years.
  const change = (widgetData.length > 0) ? sumBy(widgetData, 'netChange') - widgetData[0].netChange : 0;

  // Normalize startData
  widgetData[0] = {
    ...widgetData[0],
    gain: 0,
    loss: 0,
    netChange: 0
  };

  const location = currentLocation.location_type === 'worldwide' ? 'the world' : <span className="notranslate">{currentLocation.name}</span>;
  const direction = (change > 0) ? 'increased' : 'decreased';
  const quantity = numberFormat(Math.abs(change / 1000000));
  const startSelector = (
    <Select
      className="notranslate netChange"
      prefix="start-year"
      value={startYear}
      options={optionsYears}
      isOptionDisabled={option => parseInt(option.value, 10) > parseInt(endYear, 10) ||
        option.value === startYear}
      onChange={changeStartYear}
    />);
  const endSelector = (
    <Select
      className="notranslate"
      prefix="end-year"
      value={endYear}
      options={optionsYears}
      isOptionDisabled={option => parseInt(option.value, 10) < parseInt(startYear, 10) ||
        option.value === endYear}
      onChange={changeEndYear}
    />);

  const sentence = (
    <>
      Mangroves in <strong>{location}</strong> have <strong>{direction}</strong> by <strong className="notranslate">{quantity}km<sup>2</sup></strong>
      &nbsp;between {startSelector} and {endSelector}.
    </>
  );

  const chartRData = {
    data: widgetData,
    config: chartConfig
  };

  return (
    <ChartWidget
      name={name}
      data={data}
      slug={slug}
      filename={slug}
      isCollapsed={isCollapsed}
      sentence={sentence}
      chartData={chartRData}
      {...props}
    />
  );
}

MangroveNetChange.propTypes = {
  name: PropTypes.string, 
  data: PropTypes.shape({}),
  slug: PropTypes.string, 
  filename: PropTypes.string, 
  currentLocation: PropTypes.shape({}),
  addFilter: PropTypes.func
};

MangroveNetChange.defaultProps = {
  name: null,
  data: null,
  slug: null,
  filename: null,
  currentLocation: null,
  addFilter: null
};

export default MangroveNetChange;
