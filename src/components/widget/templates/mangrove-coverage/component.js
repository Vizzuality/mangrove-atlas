import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Chart from 'components/chart';
import Select from 'components/select';
import styles from 'components/widget/style.module.scss';

class MangroveCoverage extends React.PureComponent {
  static propTypes = {
    data: PropTypes.shape({}),
    chart: PropTypes.arrayOf(PropTypes.object).isRequired,
    chartConfig: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    data: null
  }

  state = {
    yearStart: '2009'
  }

  getData() {
    const { data: { widgetData, metadata } } = this.props;
    const { yearStart } = this.state;
    const currentYearData = widgetData.find(d => d.x.toString() === yearStart.toString());
    const nonMangrove = metadata.total - currentYearData.x;

    const result = [
      {
        ...currentYearData
      },
      {
        x: 'Non mangroves',
        y: nonMangrove,
        color: '#ECECEF',
        percentage: nonMangrove / metadata.total * 100,
        unit: '%',
        value: nonMangrove,
        label: 'Non mangroves'
      }
    ];

    return result;
  }

  changeYear = (type, value) => {
    if (type === 'start') {
      this.setState({ yearStart: value });
    } else {
      this.setState({ yearEnd: value });
    }
  }

  render() {
    const { data: { metadata }, chart, chartConfig } = this.props;
    const { yearStart } = this.state;
    const optionsYears = metadata.years.map(year => ({
      label: year,
      value: year
    }));
    const widgetData = this.getData();

    return (
      <Fragment>
        <div className={styles.widget_template}>
          <p className={styles.sentence}>
            Mangrove forest cover <span style={{ fontWeight: 'bold' }}>{widgetData[0].percentage} {widgetData[0].unit}</span><br />
            of
            {' '}
            <span style={{ fontWeight: 'bold' }}>the world’s {metadata.total / 1000} km</span>
            {' '}
            coastline in
            {' '}
            <Select
              value={yearStart}
              options={optionsYears}
              onChange={value => this.changeYear('start', value)}
            />
            {'.'}
          </p>
        </div>

        {/* Chart */}
        {!!chart.length && (
          <Chart
            data={widgetData}
            config={chartConfig}
          />
        )}
      </Fragment>
    );
  }
}

export default MangroveCoverage;
