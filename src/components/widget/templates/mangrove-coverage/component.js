import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import Chart from 'components/chart';
import Select from 'components/select';
import WidgetInfo from 'components/widget-info';
import styles from 'components/widget/style.module.scss';

const numberFormat = format(',.2f');

class MangroveCoverage extends React.PureComponent {
  static propTypes = {
    data: PropTypes.shape({}),
    metadata: PropTypes.shape({}),
    currentLocation: PropTypes.shape({}),
    slug: PropTypes.string
  }

  static defaultProps = {
    data: null,
    metadata: null,
    currentLocation: null,
    slug: null
  }

  state = {
    currentYear: 1996,
    unit: '%'
  }

  getData() {
    const { data } = this.props;
    const { chartData, metadata } = data;
    const { currentYear } = this.state;
    const currentYearData = chartData.find(d => d.x === currentYear);
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

  changeUnit = (unit) => {
    this.setState({ unit });
  }

  render() {
    const { data, currentLocation, slug } = this.props;
    const { chartConfig, metadata } = data;
    const { currentYear, unit } = this.state;
    const optionsYears = metadata.years.map(year => ({
      label: year.toString(),
      value: year
    }));
    const widgetData = this.getData();
    const { percentage } = widgetData[0];
    const unitOptions = [
      { value: '%', label: '%' },
      { value: 'km', label: 'Km' }
    ];
    const totalCoverage = metadata.total / 1000;
    const coverage = (percentage * totalCoverage) / 100;

    return (
      <Fragment>
        <div className={styles.widget_template}>
          <div className={styles.sentence}>
            <span>Mangrove forest cover </span>
            <strong className="notranslate">{unit === '%' ? numberFormat(percentage) : numberFormat(coverage)}
              <Select
                value={unit}
                options={unitOptions}
                onChange={value => this.changeUnit(value)}
              />
            </strong><br />
            <span>of</span> <strong>{currentLocation.type === 'worldwide' ? 'the world’s' : <span className="notranslate">{`${currentLocation.name}'s`}</span>}</strong>
            {' '}
            <strong className="notranslate">{numberFormat(totalCoverage)} km</strong> coastline<br />
            <span>in</span>
            {' '}
            <Select
              className="notranslate"
              width="auto"
              value={currentYear}
              options={optionsYears}
              onChange={this.changeYear}
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
        <WidgetInfo
          data={widgetData}
          filename={slug}
        />
      </Fragment>
    );
  }
}

export default MangroveCoverage;
