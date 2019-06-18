import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Chart from 'components/chart';
import Select from 'components/select';

import styles from 'components/widget/style.module.scss';

class MangroveNetChange extends React.PureComponent {
  static propTypes = {
    chart: PropTypes.arrayOf(PropTypes.object).isRequired,
    chartConfig: PropTypes.shape({}).isRequired,
  };

  state = {
    unit: 'ha'
  }

  changeUnit = (unit) => {
    this.setState({ unit });
  }

  render() {
    const { chart, chartConfig } = this.props;
    const { unit } = this.state;

    // XXX: these options should come from an api ?
    const selectOptions = [
      { value: 'ha', label: 'Ha' },
      { value: 'km', label: 'Km' }
    ];

    return (
      <Fragment>
        <div className={styles.widget_template}>
          <p className={styles.sentence}>
            Over the past 20 years, mangroves in the world have decreased by x
            {' '}
            <Select
              value={unit}
              options={selectOptions}
              onChange={value => this.changeUnit(value)}
            />
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
