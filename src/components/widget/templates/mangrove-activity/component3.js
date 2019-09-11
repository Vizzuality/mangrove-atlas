import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import flatten from 'lodash/flatten';

import Spinner from 'components/spinner';
import Chart from 'components/chart';
import Select from 'components/select';

import { scaleLinear } from 'd3-scale';

import styles from 'components/widget/style.module.scss';

class MangroveActivity extends React.PureComponent {
  static propTypes = {
    data: PropTypes.shape({}).isRequired
  };

  state = {
    unit: 'ha',
    yearStart: '2009',
    yearEnd: '2019',
    filter: 'gain'
  }

  changeYear = (type, value) => {
    if (type === 'start') {
      this.setState({ yearStart: value });
    } else {
      this.setState({ yearEnd: value });
    }
  }

  changeUnit = (unit) => {
    this.setState({ unit });
  }

  changeFilter = (filter) => {
    this.setState({ filter });
  }

  getRanking = (chartData, filter) => orderBy(
    chartData[filter], d => Math.abs(d[filter])
  ).reverse().map((f, index) => ({ ...f, x: index }));

  getConfig = () => {
    const { data: { chartConfig, chartData } } = this.props;
    const { filter } = this.state;

    const dataRanked = this.getRanking(chartData, filter);

    const max = Math.max(...flatten(chartData[filter]
      .map(d => [Math.abs(d.gain), Math.abs(d.loss)])));
    const domainX = [-max + (-max * 0.05), max + (max * 0.05)];

    return {
      ...chartConfig,
      xAxis: {
        type: 'number',
        domain: domainX,
        interval: 0
      },
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
                const { name } = dataRanked[index];

                return (
                  <g className={styles.activity_widget}>
                    <text className={styles.label} x={w / 2} y={y - 15} textAnchor="middle" fill="#000">
                      {name}
                    </text>
                  </g>
                );
              }
            }
          },
          loss: {
            barSize: 10,
            fill: '#EB6240',
            radius: [0, 10, 10, 0],
            stackId: 'stacked',
            legend: 'Loss',
            label: {
              content: (prs) => {
                const w = this.chart.offsetWidth;

                const { index, y } = prs;
                const { loss, gain } = dataRanked[index];
                const net = loss + gain;

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
    const { data: { chartData } } = this.props;
    const { yearStart, yearEnd, unit, filter } = this.state;

    // XXX: these options should come from an api ?
    const optionsFilter = [
      { value: 'gain', label: 'Gain' },
      { value: 'loss', label: 'Loss' },
      { value: 'net', label: 'Net' }
    ];

    const optionsYearStart = [
      { value: '2009', label: '2009' },
      { value: '2010', label: '2010' }
    ];

    const optionsYearEnd = [
      { value: '2018', label: '2018' },
      { value: '2019', label: '2019' }
    ];

    const change = 5;

    // Selectors
    const filterSelector = (
      <Select
        value={filter}
        options={optionsFilter}
        onChange={value => this.changeFilter(value)}
      />
    );

    const startYearSelector = (
      <Select
        value={yearStart}
        options={optionsYearStart}
        onChange={value => this.changeYear('start', value)}
      />
    );

    const endYearSelector = (
      <Select
        value={yearEnd}
        options={optionsYearEnd}
        onChange={value => this.changeYear('end', value)}
      />
    );

    return (
      <Fragment>
        <div className={styles.widget_template}>
          <div className={styles.sentence}>
            {/* eslint-disable-next-line */}
            Regions of interest within location showed relative {filterSelector} of <strong>{change}{unit}</strong> between {startYearSelector} to {endYearSelector}.
          </div>
        </div>

        {/* Chart */}
        {!chartData && <Spinner />}
        <Chart
          onReady={(r) => { this.chart = r; }}
          data={this.getRanking(chartData, filter)}
          config={this.getConfig()}
        />
      </Fragment>
    );
  }
}

export default MangroveActivity;
