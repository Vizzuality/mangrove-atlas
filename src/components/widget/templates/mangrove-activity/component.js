import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';

import Spinner from 'components/spinner';
import Chart from 'components/chart';
import Select from 'components/select';

import styles from 'components/widget/style.module.scss';

class MangroveActivity extends React.PureComponent {
  static propTypes = {
    data: PropTypes.shape({}).isRequired
  };

  state = {
    unit: '100',
    yearStart: '2009',
    yearEnd: '2019',
    filter: 'gain'
  }

  changeYear = (type, value) => {
    if (type === 'start') {
      this.setState({ yearStart: value });
    } else {
      this.setState({ yearEnd: value });
    }
  }

  changeUnit = (unit) => {
    this.setState({ unit });
  }

  changeFilter = (filter) => {
    this.setState({ filter });
  }

  getRanking = (fakeData, filter) => orderBy(fakeData[filter], d => Math.abs(d[filter])).reverse().map((f, index) => ({ ...f, x: index }));

  render() {
    const { data: { chartData, chartConfig, metadata, fakeData } } = this.props;
    const { yearStart, yearEnd, unit, filter } = this.state;

    // XXX: these options should come from an api ?
    const optionsFilter = [
      { value: 'gain', label: 'Gain' },
      { value: 'loss', label: 'Loss' },
      { value: 'net', label: 'Net' }
    ];

    const optionsYearStart = [
      { value: '2009', label: '2009' },
      { value: '2010', label: '2010' }
    ];

    const optionsYearEnd = [
      { value: '2018', label: '2018' },
      { value: '2019', label: '2019' }
    ];

    const optionsUnit = [
      { value: '100', label: 'Ha' },
      { value: '1', label: 'Km' }
    ];

    return (
      <Fragment>
        <div className={styles.widget_template}>
          <div className={styles.sentence}>
            Regions of interest within location showed relative
            {' '}
            <Select
              value={filter}
              options={optionsFilter}
              onChange={value => this.changeFilter(value)}
            />
            {' '}
            of {metadata * unit}
            {' '}
            <Select
              value={unit}
              options={optionsUnit}
              onChange={value => this.changeUnit(value)}
            />
            {' '}
            between
            {' '}
            <Select
              value={yearStart}
              options={optionsYearStart}
              onChange={value => this.changeYear('start', value)}
            />
            {' '}
            to
            {' '}
            <Select
              value={yearEnd}
              options={optionsYearEnd}
              onChange={value => this.changeYear('end', value)}
            />
            .
          </div>
        </div>

        {/* Chart */}
        {!chartData.length && <Spinner />}
        <Chart
          data={this.getRanking(fakeData, filter)}
          config={chartConfig}
        />
      </Fragment>
    );
  }
}

export default MangroveActivity;
