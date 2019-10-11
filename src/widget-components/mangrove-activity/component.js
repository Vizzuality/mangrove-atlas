import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';

import ChartWidget from 'components/chart-widget';
import Select from 'components/select';

import config from './config';


function MangroveActivity({ data: rawData, fetchRankingData, isCollapsed, slug, name, ...props }) {
  const [mangroveActivityState, setMangroveActivityState] = useState({
    startDate: 1996,
    endDate: 2016,
    filter: 'gain',
    isLoading: false
  });

  useEffect(() => {
    fetchRankingData({
      ...mangroveActivityState,
    });
  }, []);

  if (!rawData || !rawData.meta) {
    return null;
  }

  const { startDate, endDate, filter } = mangroveActivityState;
  const { chartData, metaData, chartConfig } = config.parse(rawData, filter);

  const changeYear = (type, value) => {
    const prop = (type === 'start') ? 'startDate' : 'endDate';
    setMangroveActivityState({
      ...mangroveActivityState,
      [prop]: value
    });
    fetchRankingData({
      ...mangroveActivityState,
      [prop]: value
    });
  };

  const changeFilter = (filterState) => {
    setMangroveActivityState({
      ...mangroveActivityState,
      filter: filterState
    });
    fetchRankingData({
      ...mangroveActivityState,
      filter: filterState
    });
  };

  const sortRanking = (data) => {
    const rankingType = mangroveActivityState.filter;
    const dataRanked = orderBy(data, rankingType, d => Math.abs(d`${rankingType}`)).map((f, index) => ({ ...f, x: index })).reverse();
    return (rankingType === 'gain' ? dataRanked : dataRanked.reverse());
  };

  // XXX: these options should come from an api ?
  const optionsFilter = [
    { value: 'gain', label: 'gain' },
    { value: 'loss', label: 'loss' }
  ];

  const optionsYear = metaData.map(year => ({
    label: year,
    value: year
  }));

  // Selectors
  const filterSelector = (
    <Select
      value={filter}
      options={optionsFilter}
      onChange={value => changeFilter(value)}
    />
  );

  const startYearSelector = (
    <Select
      value={startDate}
      options={optionsYear}
      isOptionDisabled={option => parseInt(option.value, 10) > parseInt(endDate, 10)
        || option.value === startDate}
      onChange={value => changeYear('start', value)}
    />
  );

  const endYearSelector = (
    <Select
      value={endDate}
      options={optionsYear}
      isOptionDisabled={option => parseInt(option.value, 10) < parseInt(startDate, 10)
        || option.value === endDate}
      onChange={value => changeYear('end', value)}
    />
  );

  const sentence = (
    <>
      Worldwide the 5 countries with the largest {filterSelector}
       in Mangrove habitat extent between {startYearSelector} and {endYearSelector} were:
    </>
  );

  const sortedData = sortRanking(chartData);

  const chartRData = {
    data: sortedData,
    config: chartConfig
  };

  return (
    <ChartWidget
      name={name}
      data={sortedData}
      slug={slug}
      filename={slug}
      isCollapsed={isCollapsed}
      sentence={sentence}
      chartData={chartRData}
      {...props}
    />
  );
}

MangroveActivity.propTypes = {
  data: PropTypes.shape({}).isRequired,
  fetchRankingData: PropTypes.func.isRequired
};

export default MangroveActivity;
