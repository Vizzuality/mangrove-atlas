import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';

import Chart from 'components/chart';
import Select from 'components/select';

import styles from 'components/widget/style.module.scss';

class MangroveNetChange extends PureComponent {
  static propTypes = {
    chart: PropTypes.arrayOf(PropTypes.object).isRequired,
    chartConfig: PropTypes.shape({}).isRequired,
    location: PropTypes.shape({})
  }

  static defaultProps = {
    location: null
  }

  state = {
    startYear: '1996',
    endYear: '2016'
  }

  changeStartYear = (year) => {
    this.setState({ startYear: year });
  }

  changeEndYear = (year) => {
    this.setState({ endYear: year });
  }

  render() {
    const { chart, chartConfig, location } = this.props;
    const { startYear, endYear } = this.state;

    const optionsYears = chart.map(d => ({
      label: d.year.toString(),
      value: d.year.toString()
    }));

    return (
      <Fragment>
        <div className={styles.widget_template}>
          <p className={styles.sentence}>
            Mangroves in <strong>{location.type === 'global' ? 'the world' : location.name}</strong>
            {' '}have <strong>decreased</strong> by <strong>X</strong>{' '}<br />
            between
            {' '}
            <Select
              prefix="start-year"
              value={startYear}
              options={optionsYears}
              onChange={this.changeStartYear}
            />
            {' and '}
            <Select
              prefix="end-year"
              value={endYear}
              options={optionsYears}
              onChange={this.changeEndYear}
            />
            {'.'}
          </p>
        </div>

        {/* Chart */}
        {!!chart.length && (
          <Chart
            data={chart}
            config={chartConfig}
          />
        )}
      </Fragment>
    );
  }
}

export default MangroveNetChange;
