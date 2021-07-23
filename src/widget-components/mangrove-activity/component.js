import React from 'react';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';

import ChartWidget from 'components/chart-widget';
import Select from 'components/select';

import moreIcon from './icon-more.svg';
import lessIcon from './icon-less.svg';

import config from './config';

function MangroveActivity({
  data: rawData,
  fetchRankingData,
  isCollapsed = true,
  slug,
  name,
  ui,
  setUi,
  ...props
}) {
  const changeYear = (type, value) => {
    const prop = (type === 'start') ? 'startDate' : 'endDate';
    setUi({
      id: 'activity',
      value: {
        ...ui,
        [prop]: value
      }
    });
    fetchRankingData({
      ...ui,
      [prop]: value
    });
  };

  const changeFilter = (filterState) => {
    setUi({
      id: 'activity',
      value: {
        ...ui,
        filter: filterState,
      }
    });
    fetchRankingData({
      ...ui,
      filter: filterState
    });
  };

  const changeLimit = (limitState) => {
    setUi({
      id: 'activity',
      value: {
        ...ui,
        limit: limitState
      }
    });
    fetchRankingData({
      ...ui,
      limit: limitState
    });
  };

  if (!rawData || !rawData.meta) {
    return null;
  }

  const { startDate, endDate, filter, limit } = ui;
  const { chartData, metaData, chartConfig } = config.parse(rawData, filter, limit);

  const sortRanking = (data) => {
    const dataRanked = orderBy(data, filter, d => Math.abs(d`${filter}`)).map((f, index) => ({ ...f, x: index })).reverse();
    return (filter === 'loss' ? dataRanked.reverse() : dataRanked);
  };

  // XXX: these options should come from an api ?
  const optionsFilter = [
    { value: 'gain', label: 'gain' },
    { value: 'loss', label: 'loss' },
    { value: 'net_change', label: 'net increase' },
  ];

  const startYearOptions = metaData.map(year => ({
    label: year,
    value: year
  }));

  const endYearOptions = metaData.map(year => ({
    label: year,
    value: year
  }));

  // Selectors
  const filterSelector = (
    <Select
      value={filter}
      options={optionsFilter}
      classNamePrefix="react-select"
      onChange={value => changeFilter(value)}
    />
  );

  const startYearSelector = (
    <Select
      value={startDate}
      options={startYearOptions.splice(0, metaData.length - 1)}
      isOptionDisabled={option => parseInt(option.value, 10) > parseInt(endDate, 10)
        || option.value === startDate}
      onChange={value => changeYear('start', value)}
    />
  );

  const endYearSelector = (
    <Select
      value={endDate}
      options={endYearOptions.splice(1, metaData.length)}
      isOptionDisabled={option => parseInt(option.value, 10) < parseInt(startDate, 10)
        || option.value === endDate}
      onChange={value => changeYear('end', value)}
    />
  );

  const customStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    fontSize: '14px',
    color: '#00857F',
    fontWeight: 600
  };


  const sentence = (
    <>
      Worldwide the {limit} countries with the largest {filterSelector}
      &nbsp;in Mangrove habitat extent between {startYearSelector} and {endYearSelector} were:
    </>
  );

  const countriesLimit = (
    <>
      <button
        style={customStyles}
        type="button"
        onClick={value => changeLimit(limit === 5 ? limit + 5 : limit - 5, value)}
      >
        {limit === 5 ? 'Show 10' : 'Show 5'}
        <img alt={limit === 5 ? 'Show more results' : 'Show less results'} src={limit === 5 ? moreIcon : lessIcon} />
      </button>
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
      component={countriesLimit}
      {...props}
    />
  );
}

MangroveActivity.propTypes = {
  data: PropTypes.shape({}).isRequired,
  fetchRankingData: PropTypes.func.isRequired
};

export default MangroveActivity;
