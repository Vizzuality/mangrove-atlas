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

  changeStartYear = startYear => this.setState({ startYear })

  changeEndYear = endYear => this.setState({ endYear })

  render() {
    const { data: { metadata, chartData, chartConfig }, currentLocation, slug } = this.props;
    const { startYear, endYear } = this.state;
    const optionsYears = metadata.years.map(year => ({
      label: year.toString(),
      value: year.toString()
    }));

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
      ({year: y}) => parseInt(y) >= parseInt(startYear) && parseInt(y) <= parseInt(endYear)
    );

    // How this change is calculated?
    // Rows have year's 'gain', 'loss' and 'netChange'.
    // We consider startYear as 0
    // Therefore we substract that from the accumulated change of all following years.
    const change = (widgetData.length > 0) ? sumBy(widgetData, 'netChange') - widgetData[0].netChange : 0;

    // Normalize startData
    widgetData[0] = {
      ...widgetData[0],
      gain: 0,
      loss: 0,
      netChange: 0
    };

    const location = currentLocation.location_type === 'worldwide' ? 'the world' : <span className="notranslate">{currentLocation.name}</span>; 
    const direction = (change > 0) ? 'increased' : 'decreased';
    const quantity = numberFormat(change / 1000000);
    const startSelector = (<Select
      className="notranslate netChange"
      prefix="start-year"
      value={startYear}
      options={optionsYears}
      isOptionDisabled={option => parseInt(option.value, 10) > parseInt(endYear, 10) || option.value === startYear}
      onChange={this.changeStartYear}
    />);
    const endSelector = (<Select
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
            Mangroves in <strong>{location}</strong> have <strong>{direction}</strong> by <strong className="notranslate">{quantity} km<sup>2</sup></strong><br />
            between {startSelector} and {endSelector}.
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
