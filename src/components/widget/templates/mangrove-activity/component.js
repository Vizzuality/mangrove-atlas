import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import flatten from 'lodash/flatten';
import Link from 'redux-first-router-link';

import Spinner from 'components/spinner';
import Chart from 'components/chart';
import Select from 'components/select';

import { scaleLinear } from 'd3-scale';

import styles from 'components/widget/style.module.scss';

const sortRanking = data => orderBy(data, d => Math.abs(d)).map((f, index) => ({ ...f, x: index }));

class MangroveActivity extends React.PureComponent {
  static propTypes = {
    data: PropTypes.shape({}).isRequired,
    fetchRankingData: PropTypes.func.isRequired
  };

  state = {
    unit: 'ha',
    startDate: 1996,
    endDate: 2016,
    filter: 'gain',
    isLoading: false
  }


  getConfig = () => {
    const { data: { chartConfig, chartData } } = this.props;
    const dataRanked = sortRanking(chartData);
    const max = Math.max(...flatten(chartData.map(d => [Math.abs(d.gain), Math.abs(d.loss)])));
    const domainX = [-max + (-max * 0.05), max + (max * 0.05)];

    return {
      ...chartConfig,

      yKeys: {
        lines: {
          net: {
            barSize: 10,
            fill: 'rgba(0,0,0,0.7)',
            radius: 4,
            legend: 'Net result',
          }
        },
        bars: {
          gain: {
            barSize: 10,
            fill: '#077FAC',
            radius: [0, 10, 10, 0],
            legend: 'Gain',
            stackId: 'stacked',
            label: {
              content: (prs) => {
                const w = this.chart.offsetWidth;

                const { index, y } = prs;
                const { name, iso } = dataRanked[index];

                return (
                  <g className={styles.activity_widget}>
                    <Link key={name} to={{ type: 'PAGE/COUNTRY', payload: { iso: iso } }}>
                      <text className={styles.link} x={w / 2} y={y - 15} textAnchor="middle" fill="#000">
                        {name}
                      </text>
                    </Link> 
                  </g>
                );
              }
            }
          },
          loss: {
            barSize: 10,
            fill: '#A6CB10',
            radius: [0, 10, 10, 0],
            stackId: 'stacked',
            legend: 'Loss',
            label: {
              content: (prs) => {
                const w = this.chart.offsetWidth;

                const { index, y } = prs;
                const { net } = dataRanked[index];

                const scale = scaleLinear()
                  .domain(domainX)
                  .range([0, w]);

                const x = scale((net));

                return (
                  <g>
                    <rect x={x} y={y - 5} width={2} height={20} fill="#000" />
                  </g>
                );
              }
            }
          }
        },
      }
    };
  }

  render() {
    const { data: { chartData, metaData }, fetchRankingData } = this.props;
    const { startDate, endDate, filter, isLoading } = this.state;

    const changeYear = (type, value) => {
      const prop = (type === 'start') ? 'startDate' : 'endDate';
      this.setState({ [prop]: value });
      fetchRankingData({
        ...this.state,
        [prop]: value
      });
    };

    const changeFilter = (filter) => {
      this.setState({ filter });
      fetchRankingData({
        ...this.state,
        filter
      });
    };

    // XXX: these options should come from an api ?
    const optionsFilter = [
      { value: 'gain', label: 'gain' },
      { value: 'loss', label: 'loss' },
      { value: 'net', label: 'net' }
    ];

    const optionsYear = metaData.map(year => ({
      label: year,
      value: year
    }));

    // Selectors
    const filterSelector = (
      <Select
        value={filter}
        options={optionsFilter}
        onChange={value => changeFilter(value)}
      />
    );

    const startYearSelector = (
      <Select
        value={startDate}
        options={optionsYear}
        isOptionDisabled={option => parseInt(option.value, 10) > parseInt(endDate, 10)
          || option.value === startDate}
        onChange={value => changeYear('start', value)}
      />
    );

    const endYearSelector = (
      <Select
        value={endDate}
        options={optionsYear}
        isOptionDisabled={option => parseInt(option.value, 10) < parseInt(startDate, 10)
          || option.value === endDate}
        onChange={value => changeYear('end', value)}
      />
    );

    return (
      <Fragment>
        <div className={styles.widget_template}>
          <div className={styles.sentence}>
            {/* eslint-disable-next-line */}
            Worldwide the 5 countries with the largest {filterSelector} in Mangrove habitat extent between {startYearSelector} and {endYearSelector} were:
          </div>
        </div>

        {/* Chart */}
        {isLoading ? <Spinner /> : (
          <Chart
            onReady={(r) => { this.chart = r; }}
            data={sortRanking(chartData)}
            config={this.getConfig()}
          />)}
      </Fragment>
    );
  }
}

export default MangroveActivity;
