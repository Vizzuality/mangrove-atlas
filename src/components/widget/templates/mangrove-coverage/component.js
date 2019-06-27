import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import Chart from 'components/chart';
import Select from 'components/select';
import { jsonToCSV } from 'utils/jsonParsers';
import { CSVLink } from 'react-csv';
import styles from 'components/widget/style.module.scss';

const numberFormat = format(',.2r');

class MangroveCoverage extends React.PureComponent {
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
    currentYear: '1996'
  }

  getData() {
    const { data: { widgetData, metadata } } = this.props;
    const { currentYear } = this.state;
    const currentYearData = widgetData.find(d => d.x.toString() === currentYear.toString());
    const nonMangrove = metadata.total - currentYearData.value;
    return [
      {
        ...currentYearData
      },
      {
        x: 0,
        y: nonMangrove,
        color: '#ECECEF',
        percentage: nonMangrove / metadata.total * 100,
        unit: '%',
        value: nonMangrove,
        label: 'Non mangroves'
      }
    ];
  }

  changeYear = (value) => {
    this.setState({ currentYear: value });
  }

  render() {
    const { data: { metadata }, chartConfig, location, slug } = this.props;
    const { currentYear } = this.state;
    const optionsYears = metadata.years.map(year => ({
      label: year,
      value: year
    }));
    const widgetData = this.getData();
    const { percentage, unit } = widgetData[0];
    const csvData = jsonToCSV(widgetData);

    return (
      <Fragment>
        <div className={styles.widget_template}>
          <p className={styles.sentence}>
            Mangrove forest cover <strong>{numberFormat(percentage)} {unit}</strong><br />
            of <strong>{location.type === 'global' ? 'the world’s' : `${location.name}'s`}</strong>
            {' '}
            <strong>{numberFormat(metadata.total / 1000)} km</strong> coastline<br />
            in
            {' '}
            <Select
              prefix="coverage-start-year"
              value={currentYear}
              options={optionsYears}
              onChange={this.changeYear}
            />
            {'.'}
          </p>
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

export default MangroveCoverage;
