import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import sortBy from 'lodash/sortBy';
import Chart from 'components/chart';
import Select from 'components/select';
import styles from 'components/widget/style.module.scss';

const numberFormat = format(',.2f');

class MangroveCoverage extends React.PureComponent {
  static propTypes = {
    data: PropTypes.shape({}),
    metadata: PropTypes.shape({}),
    currentLocation: PropTypes.shape({})
  }

  static defaultProps = {
    data: null,
    metadata: null,
    currentLocation: null
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

    if (!currentYearData) {
      throw new Error('No data error.');
    }

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
        coverage: (nonMangrove / 1000).toFixed(2),
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
    const { data: { chartConfig, metadata }, currentLocation } = this.props;
    const { currentYear, unit } = this.state;
    const optionsYears = sortBy(metadata.years.map(year => ({
      label: year.toString(),
      value: year
    })), ['value']);
    let content = null;

    try {
      const widgetData = this.getData();
      const { percentage } = widgetData[0];
      const unitOptions = [
        { value: '%', label: '%' },
        { value: 'km', label: 'Km' }
      ];
      const totalCoverage = metadata.total / 1000;
      const coverage = (percentage * totalCoverage) / 100;
      const quantity = numberFormat((unit === '%') ? percentage : coverage);
      const location = (currentLocation.location_type === 'worldwide')
        ? 'the world’s'
        : <span className="notranslate">{`${currentLocation.name}'s`}</span>;
      const unitSelector = (<Select
        value={unit}
        options={unitOptions}
        onChange={value => this.changeUnit(value)}
      />);
      const yearSelector = (<Select
        className="notranslate"
        width="auto"
        value={currentYear}
        options={optionsYears}
        onChange={this.changeYear}
      />);

      content = (
        <>
          <div className={styles.sentence}>
            <span>Mangrove forest cover </span>
            <strong className="notranslate">{ quantity } {unitSelector}</strong><br />
            <span>of </span> <strong>{ location } </strong>
            <strong className="notranslate">{ numberFormat(totalCoverage) } km</strong> coastline<br />
            <span>in </span>{yearSelector}.
          </div>
          <Chart
            data={widgetData}
            config={chartConfig}
          />
        </>
        );
    } catch(e) {
      content = (
        <div className={styles.sentence}>
          <span>No data for this widget.</span>
        </div>
        );
    }

    return <div className={styles.widget_template}>{content}</div>;
  }
}

export default MangroveCoverage;
