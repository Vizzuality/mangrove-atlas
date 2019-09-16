import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';

import Spinner from 'components/spinner';
import Chart from 'components/chart';
import Select from 'components/select';

import styles from 'components/widget/style.module.scss';

const sortRanking = data => orderBy(data, d => Math.abs(d)).map((f, index) => ({ ...f, x: index }));

class MangroveActivity extends React.PureComponent {
  static propTypes = {
    data: PropTypes.shape({}).isRequired,
    fetchRankingData: PropTypes.func.isRequired
  };

  state = {
    unit: 'ha',
    startDate: 1996,
    endDate: 2016,
    filter: 'gain',
    isLoading: false
  }

  render() {
    const { data: { chartData, metaData, chartConfig }, fetchRankingData } = this.props;
    const { startDate, endDate, filter, isLoading } = this.state;

    const changeYear = (type, value) => {
      const prop = (type === 'start') ? 'startDate' : 'endDate';
      this.setState({ [prop]: value });
      fetchRankingData({
        ...this.state,
        [prop]: value
      });
    };

    const changeFilter = (filter) => {
      this.setState({ filter });
      fetchRankingData({
        ...this.state,
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
      <Fragment>
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
      </Fragment>
    );
  }
}

export default MangroveActivity;
