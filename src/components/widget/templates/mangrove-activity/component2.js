import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import Spinner from 'components/spinner';
import Chart from 'components/chart';
import Select from 'components/select';

import styles from 'components/widget/style.module.scss';

const MangroveActivity = ({
  data: { chartData, metadata, chartConfig },
}) => {
  const [state, setState] = useState({
    yearStart: '2009',
    yearEnd: '2019',
    filter: 'gain'
  });

  const changeYear = (type, value) => {
    if (type === 'start') {
      setState({ yearStart: value });
    } else {
      setState({ yearEnd: value });
    }
  };

  const changeFilter = (filter) => {
    setState({ filter });
  };

  // const getRanking = () => orderBy(
  //   fakeData[state.filter], d => Math.abs(d[state.filter])
  // ).reverse().map((f, index) => ({ ...f, x: index }));

  // const getConfig = () => {
  //   const { filter } = state;

  //   const dataRanked = getRanking(fakeData, filter);

  //   const max = Math.max(...flatten(fakeData[filter]
  //     .map(d => [Math.abs(d.gain), Math.abs(d.loss)])));
  //   const domainX = [-max + (-max * 0.05), max + (max * 0.05)];

  //   return {
  //     ...chartData,
  //     xAxis: {
  //       type: 'number',
  //       domain: domainX,
  //       interval: 0
  //     },
  //     yKeys: {
  //       lines: {
  //         net: {
  //           barSize: 10,
  //           fill: 'rgba(0,0,0,0.7)',
  //           radius: 4,
  //           legend: 'Net result',
  //         }
  //       },
  //       bars: {
  //         gain: {
  //           barSize: 10,
  //           fill: '#077FAC',
  //           radius: [0, 10, 10, 0],
  //           legend: 'Gain',
  //           stackId: 'stacked',
  //           label: {
  //             content: (prs) => {
  //               const w = Chart.offsetWidth;

  //               const { index, y } = prs;
  //               const { name } = dataRanked[index];

  //               return (
  //                 <g className={styles.activity_widget}>
  //                   <text className={styles.label} x={w / 2} y={y - 15} textAnchor="middle" fill="#000">
  //                     {name}
  //                   </text>
  //                 </g>
  //               );
  //             }
  //           }
  //         },
  //         loss: {
  //           barSize: 10,
  //           fill: '#EB6240',
  //           radius: [0, 10, 10, 0],
  //           stackId: 'stacked',
  //           legend: 'Loss',
  //           label: {
  //             content: (prs) => {
  //               const w = Chart.offsetWidth;

  //               const { index, y } = prs;
  //               const { loss, gain } = dataRanked[index];
  //               const net = loss + gain;

  //               const scale = scaleLinear()
  //                 .domain(domainX)
  //                 .range([0, w]);

  //               const x = scale((net));

  //               return (
  //                 <g>
  //                   <rect x={x} y={y - 5} width={2} height={20} fill="#000" />
  //                 </g>
  //               );
  //             }
  //           }
  //         }
  //       },
  //     }
  //   };
  // };

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

  // Selectors

  const filterSelector = (
    <Select
      value={state.filter}
      options={optionsFilter}
      onChange={value => changeFilter(value)}
    />
  );

  const startYearSelector = (
    <Select
      value={state.yearStart}
      options={optionsYearStart}
      onChange={value => changeYear('start', value)}
    />
  );

  const endYearSelector = (
    <Select
      value={state.yearEnd}
      options={optionsYearEnd}
      onChange={value => changeYear('end', value)}
    />
  );

  return (
    <Fragment>
      <div className={styles.widget_template}>
        <div className={styles.sentence}>
          {/* eslint-disable-next-line */}
          Regions of interest within location showed relative {filterSelector} of <strong>{metadata}ha</strong> between {startYearSelector} to {endYearSelector}.
        </div>
      </div>
      {/* Chart */}
      {!chartData.length && <Spinner />}
      <Chart
      //  onReady={(r) => { Chart = r; }}
        data={chartData}
        config={chartConfig}
      />
    </Fragment>
  );
};


MangroveActivity.propTypes = {
  data: PropTypes.shape({}).isRequired
};

export default MangroveActivity;
