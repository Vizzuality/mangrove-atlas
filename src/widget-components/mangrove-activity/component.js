import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';

import ChartWidget from 'components/chart-widget';
import Select from 'components/select';

import moreIcon from '../icons/icon-more.svg';
import lessIcon from '../icons/icon-less.svg';

import config from './config';

function MangroveActivity({
  data: rawData,
  metadata,
  fetchRankingData,
  isCollapsed = true,
  slug,
  name,
  ui,
  setUi,
  ...props
}) {
  const { start_year, end_year, limit, filter = "net" } = ui;

  const years = useMemo(() => metadata.years, [metadata.years]);

  const startDate = useMemo(() => start_year || Number(metadata?.start_year), [start_year, metadata.start_year]);
  const endDate = useMemo(() => end_year || Number(metadata?.end_year), [end_year, metadata.end_year]);

  useEffect(() => {
    if (start_year && end_year) {
      fetchRankingData({
        start_year: startDate,
        end_year: endDate,
      });
    }
  }, [fetchRankingData, start_year, end_year, startDate, endDate]);

  useEffect(() => {
    setUi({
      id: 'activity',
      value: {
        ...ui,
        start_year: startDate,
        end_year: endDate
      }
    });
  }, [setUi, start_year, end_year, startDate, endDate]);

  const changeYear = (type, value) => {
    setUi({
      id: 'activity',
      value: {
        ...ui,
        [type]: value
      }
    });
    fetchRankingData({
      ...ui,
      [type]: value
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

  if (!rawData.length || !metadata) {
    return null;
  }
  
  const { chartData, chartConfig } = config.parse(rawData, filter, limit);

  const sortRanking = (data) => orderBy(data, filter, d => Math.abs(d`${filter}`)).map((f, index) => ({ ...f, x: index }));

  // XXX: these options should come from an api ?
  const optionsFilter = [
    { value: 'gain', label: 'gain' },
    { value: 'loss', label: 'loss' },
    { value: 'net_change', label: 'net increase' },
  ];

  const startYearOptions = years.map(year => ({
    label: year,
    value: year
  }));

  const endYearOptions = years.map(year => ({
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
      options={startYearOptions}
      isOptionDisabled={option => parseInt(option.value, 10) > parseInt(endDate, 10)
        || option.value === startDate}
      onChange={value => changeYear('start_year', value)}
    />
  );

  const endYearSelector = (
    <Select
      value={endDate}
      options={endYearOptions}
      isOptionDisabled={option => parseInt(option.value, 10) < parseInt(startDate, 10)
        || option.value === endDate}
      onChange={value => changeYear('end_year', value)}
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
      Worldwide the {limit} countries with the largest net
      {/* {filterSelector} TO - DO put back selector when API returns gain and loss values */} 
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
