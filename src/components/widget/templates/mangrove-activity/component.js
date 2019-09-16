import React, { useState } from 'react';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';

import Spinner from 'components/spinner';
import Chart from 'components/chart';
import Select from 'components/select';

import styles from 'components/widget/style.module.scss';

const sortRanking = data => orderBy(data, d => Math.abs(d)).map((f, index) => ({ ...f, x: index }));

function MangroveActivity({ data: { chartData, metaData, chartConfig }, fetchRankingData }) {
  const [mangroveActivityState, setMangroveActivityState] = useState({
    unit: 'ha',
    startDate: 1996,
    endDate: 2016,
    filter: 'gain',
    isLoading: false
  });

  const { startDate, endDate, filter, isLoading } = mangroveActivityState;

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

  const changeFilter = (filter) => {
    setMangroveActivityState({
      ...mangroveActivityState,
      filter
    });
    fetchRankingData({
      ...mangroveActivityState,
      filter
    });
  };

  // XXX: these options should come from an api ?
  const optionsFilter = [
    { value: 'gain', label: 'gain' },
    { value: 'loss', label: 'loss' },
    { value: 'net_change', label: 'net' }
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

  return (
    <>
      <div className={styles.widget_template}>
        <div className={styles.sentence}>
          {/* eslint-disable-next-line */}
          Worldwide the 5 countries with the largest {filterSelector} in Mangrove habitat extent between {startYearSelector} and {endYearSelector} were:
        </div>
      </div>

      {/* Chart */}
      {isLoading ? <Spinner /> : (
        <Chart
          data={sortRanking(chartData)}
          config={chartConfig}
        />)}
    </>
  );
}

MangroveActivity.propTypes = {
  data: PropTypes.shape({}).isRequired,
  fetchRankingData: PropTypes.func.isRequired
};

export default MangroveActivity;
