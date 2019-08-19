import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Spinner from 'components/spinner';
import Chart from 'components/chart';
import Select from 'components/select';

import styles from 'components/widget/style.module.scss';

class MangroveActivity extends React.PureComponent {
  static propTypes = {
    data: PropTypes.shape({}).isRequired
  };

  state = {
    unit: 'ha',
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
    const { data: { chartData, chartConfig }} = this.props;
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
          <div className={styles.sentence}>
            Regions of interest within location showed relative changes of x
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
          data={chartData}
          config={chartConfig}
        />

      </Fragment>
    );
  }
}

export default MangroveActivity;
