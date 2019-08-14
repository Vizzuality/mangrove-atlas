import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import Chart from 'components/chart';
import Select from 'components/select';
import DownloadLink from 'components/link';
import sumBy from 'lodash/sumBy';
import styles from 'components/widget/style.module.scss';

const numberFormat = format(',.2f');

class MangroveNetChange extends PureComponent {
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

  getData() {
    const { data: { chartData } } = this.props;
    const { startYear, endYear } = this.state;
    const y0 = parseInt(startYear, 0);
    const y1 = parseInt(endYear, 0);
    const result = chartData.filter((d) => {
      const y = parseInt(d.year, 0);
      return y >= y0 && y <= y1;
    });
    return result;
  }

  changeStartYear = startYear => this.setState({ startYear })

  changeEndYear = endYear => this.setState({ endYear })

  render() {
    const { data: { metadata, chartConfig }, currentLocation, slug } = this.props;
    const { startYear, endYear } = this.state;
    const optionsYears = metadata.years.map(year => ({
      label: year.toString(),
      value: year.toString()
    }));
    const widgetData = this.getData();
    const totalLoss = widgetData && widgetData.length
      ? Math.abs(sumBy(widgetData, 'Loss'))
      : 0;
    return (
      <Fragment>
        <div className={styles.widget_template}>
          <div className={styles.sentence}>
            <span>Mangroves in</span> <strong>{currentLocation.type === 'worldwide' ? 'the world' : <span className="notranslate">{currentLocation.name}</span>}</strong>
            {' '}<span>have</span> <strong>decreased</strong> by <strong className="notranslate">{numberFormat(totalLoss / 100000)} km<sup>2</sup></strong>{' '}<br />
            <span>between</span>
            {' '}
            <Select
              className="notranslate netChange"
              prefix="start-year"
              value={startYear}
              options={optionsYears}
              isOptionDisabled={option => parseInt(option.value, 10) > parseInt(endYear, 10) || option.value === startYear}
              onChange={this.changeStartYear}
            />
            {' '}<span>and</span>{' '}
            <Select
              className="notranslate"
              prefix="end-year"
              value={endYear}
              options={optionsYears}
              isOptionDisabled={option => parseInt(option.value, 10) < parseInt(startYear, 10) || option.value === endYear}
              onChange={this.changeEndYear}
            />
            {'.'}
          </div>
        </div>

        {/* Chart */}
        {!!widgetData.length && (
          <Chart
            data={widgetData}
            config={chartConfig}
          />
        )}

        <DownloadLink
          data={widgetData}
          filename={slug}
        />
      </Fragment>
    );
  }
}

export default MangroveNetChange;
