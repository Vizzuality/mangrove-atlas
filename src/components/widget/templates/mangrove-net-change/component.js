import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import Chart from 'components/chart';
import Select from 'components/select';
import sumBy from 'lodash/sumBy';
import { jsonToCSV } from 'utils/jsonParsers';
import { CSVLink } from 'react-csv';

import styles from 'components/widget/style.module.scss';

const numberFormat = format(',.3r');

class MangroveNetChange extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({}),
    chartConfig: PropTypes.shape({}).isRequired,
    location: PropTypes.shape({}),
    slug: PropTypes.string
  }

  static defaultProps = {
    data: null,
    location: null,
    slug: null
  }

  state = {
    startYear: '1996',
    endYear: '2016'
  }

  getData() {
    const { data: { widgetData } } = this.props;
    const { startYear, endYear } = this.state;
    const y0 = parseInt(startYear, 0);
    const y1 = parseInt(endYear, 0);
    const result = widgetData.filter((d) => {
      const y = parseInt(d.year, 0);
      return y >= y0 && y <= y1;
    });
    return result;
  }

  changeStartYear = startYear => this.setState({ startYear })

  changeEndYear = endYear => this.setState({ endYear })

  render() {
    const { data: { metadata }, chartConfig, location, slug } = this.props;
    const { startYear, endYear } = this.state;
    const optionsYears = metadata.years.map(year => ({
      label: year,
      value: year
    }));
    const widgetData = this.getData();
    const totalLoss = widgetData && widgetData.length
      ? Math.abs(sumBy(widgetData, 'Loss'))
      : 0;
    const csvData = jsonToCSV(widgetData);

    return (
      <Fragment>
        <div className={styles.widget_template}>
          <div className={styles.sentence}>
            <span>Mangroves in</span> <strong>{location.type === 'global' ? 'the world' : <span className="notranslate">{location.name}</span>}</strong>
            {' '}<span>have</span> <strong>decreased</strong> by <strong className="notranslate">{numberFormat(totalLoss / 100000)} km<sup>2</sup></strong>{' '}<br />
            <span>between</span>
            {' '}
            <Select
              className="notranslate"
              prefix="start-year"
              value={startYear}
              options={optionsYears}
              onChange={this.changeStartYear}
            />
            {' '}<span>and</span>{' '}
            <Select
              className="notranslate"
              prefix="end-year"
              value={endYear}
              options={optionsYears}
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

        <CSVLink
          className={styles.downloadButton}
          data={csvData}
          filename={`${slug}-${Date.now()}}.csv`}
        >
          Download raw data
        </CSVLink>
      </Fragment>
    );
  }
}

export default MangroveNetChange;
