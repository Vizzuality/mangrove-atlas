import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styles from 'components/widget/style.module.scss';

import Chart from 'components/chart';
import Select from 'components/select';

class MangroveCoverage extends React.PureComponent {
  static propTypes = {
    chart: PropTypes.arrayOf(PropTypes.object).isRequired,
    chartConfig: PropTypes.shape({}).isRequired,
  };

  state = {
    unit: 'km',
    yearStart: '2009',
    yearEnd: '2019'
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

  render() {
    const { chart, chartConfig } = this.props;
    const { yearStart, yearEnd, unit } = this.state;

    // XXX: these options should come from an api ?
    const optionsYearStart = [
      { value: '2009', label: '2009' },
      { value: '2010', label: '2010' }
    ];

    const optionsYearEnd = [
      { value: '2018', label: '2018' },
      { value: '2019', label: '2019' }
    ];

    const optionsUnit = [
      { value: 'ha', label: 'Ha' },
      { value: 'km', label: 'Km' }
    ];


    return (
      <Fragment>
        <div className={styles.widget_template}>
          <p className={styles.sentence}>
            Mangrove forest cover 55 % <br />
            of the world’s 230
            {' '}
            <Select
              value={unit}
              options={optionsUnit}
              onChange={value => this.changeUnit(value)}
            />
            {' '}
            in
            {' '}
            <Select
              value={yearStart}
              options={optionsYearStart}
              onChange={value => this.changeYear('start', value)}
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

export default MangroveCoverage;
