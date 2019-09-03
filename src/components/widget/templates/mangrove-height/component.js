import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import Chart from 'components/chart';
import Select from 'components/select';
import sumBy from 'lodash/sumBy';
import styles from 'components/widget/style.module.scss';

const numberFormat = format(',.2f');


class MangroveHeight extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({}),
    currentLocation: PropTypes.shape({}),
    slug: PropTypes.string
  }

  static defaultProps = {
    data: null,
    currentLocation: null,
    slug: null
  }

  state = {
    startYear: '1996',
    endYear: '2016'
  }

  changeStartYear = startYear => this.setState({ startYear })
  changeEndYear = endYear => this.setState({ endYear })

  render() {
    const { data: { metadata, chartData, chartConfig }, currentLocation, slug } = this.props;
    const { startYear, endYear } = this.state;
    const optionsYears = metadata.years.map(year => ({
      label: year.toString(),
      value: year.toString()
    }));

    const unit = '%';
    const yearStart = '1996';
    const yearEnd = '2019';


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

    // TODO: This must be done in the API
    const editedChartData = [
      {
        x: '1996',
        netChange: 0,
        gain: 0,
        loss: 0,
        name: '1996',
        year: 1996
      },
      ...chartData
    ];

    const widgetData = editedChartData.filter(
      ({ year: y }) => parseInt(y) >= parseInt(startYear) && parseInt(y) <= parseInt(endYear)
    );


    const startSelector = (
      <Select
        className="notranslate netChange"
        prefix="start-year"
        value={startYear}
        options={optionsYears}
        isOptionDisabled={option => parseInt(option.value, 10) > parseInt(endYear, 10) || option.value === startYear}
        onChange={this.changeStartYear}
      />);
    const endSelector = (
      <Select
        className="notranslate"
        prefix="end-year"
        value={endYear}
        options={optionsYears}
        isOptionDisabled={option => parseInt(option.value, 10) < parseInt(startYear, 10) || option.value === endYear}
        onChange={this.changeEndYear}
      />);

    return (
      <Fragment>
        <div className={styles.widget_template}>
          <div className={styles.sentence}>
            Over the past 20 years, mangroves in the world have decreased by x ha
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
          </div>
        </div>

        {/* Chart */}
        {/* <Chart
          data={chartData}
          config={chartConfig}
        /> */}

      </Fragment>
    );
  }
}

export default MangroveHeight;
