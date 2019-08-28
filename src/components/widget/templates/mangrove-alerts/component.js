import React, { Fragment, useState } from 'react';
import moment from 'moment';

import { month } from 'utils/nice-date';
// import Spinner from 'components/spinner';
import Chart from 'components/chart';
import Datepicker from 'components/datepicker';

import styles from 'components/widget/style.module.scss';

function MangroveAlerts({ widgetConfig, minDate = '1996-01-01', maxDate = '2016-12-31', data}) {
  const [state, setState] = useState({
    startDate: moment(minDate).add(4, 'y'),
    endDate: moment(maxDate).subtract(4, 'y')
  });

  const datepickerHandler = payload => setState(state => ({
    ...state,
    ...payload
  }));

  function DatePicker({date, onChange}) {
    return (
      <Datepicker
        inline
        date={date}
        settings={{
          numberOfMonths: 1,
          minDate,
          maxDate,
          isOutsideRange: d =>
            d.isAfter(moment(maxDate)) || d.isBefore(moment(minDate)),
          hideKeyboardShortcutsPanel: true,
          noBorder: true,
          readOnly: true
        }}
        onDateChange={onChange}
      />
    );
  }

  const startDatepicker = (<DatePicker
    date={moment(state.startDate)}
    onChange={value => datepickerHandler({startDate: value})}
  />);

  const endDatepicker = (<DatePicker
    date={moment(state.endDate)}
    onChange={value => datepickerHandler({endDate: value})}
  />);

  const startMark = month(state.startDate) + 2;
  const endMark = month(state.endDate) - 2;

  const seriesLineDefinition = {
    stroke: '#EB6240',
    strokeWidth: 1,
    isAnimationActive: false,
    dot: {
      fill: '#EB6240',
      stroke: '#EB6240',
      strokeWidth: 2
    },
    title: 'Alerts'
  };

  // This is broken...
  // We are using chartData from a previous parse to inject series and parse again...
  const series = Object.fromEntries(data.chartData.map(({
    attributes: {
      date_first: start,
      date_last: end,
      loss: category
    }
  }, index) => {
    const seriesName = `series_${index}`;
    const data = [{
      id: seriesName,
      date: start,
      category,
      mark: moment(start).month(),
      [seriesName]: -90 + index * 8
    }];

    if (start !== end) {
      data.push({
        id: seriesName,
        date: end || 'Happening now.',
        category,
          mark: ( end && moment(end).month()) || month(new Date()),
        [seriesName]: -90 + index * 8
      });
    }

    return [seriesName, {
      ...seriesLineDefinition,
      data
    }];
  }));

  const { chartData, chartConfig } = widgetConfig.parse({ startMark, endMark, series });
  const alerts = chartData.map(it => it.year).filter(y => y >= startMark && y <= endMark ).length;

  return (
    <Fragment>
      <div className={styles.widget_template}>
        <div className={styles.sentence}>
          There were <span className={styles.bold}>{alerts}</span> loss alerts <br/>between {startDatepicker} and {endDatepicker}
        </div>
      </div>

      {/* Chart */}
      <Chart
        data={chartData}
        config={chartConfig}
      />

    </Fragment>
  );
}

export default MangroveAlerts;
