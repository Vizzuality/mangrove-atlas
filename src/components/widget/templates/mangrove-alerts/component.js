import React, { Fragment, useState } from 'react';
import moment from 'moment';

import { year } from 'utils/nice-date';
// import Spinner from 'components/spinner';
import Chart from 'components/chart';
import Datepicker from 'components/datepicker';

import styles from 'components/widget/style.module.scss';
window.m = moment;
function MangroveAlerts({ widgetConfig, minDate = '1996-01-01', maxDate = '2016-12-31'}) {
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

  const startYear = year(state.startDate);
  const endYear = year(state.endDate);

  const { chartData, chartConfig } = widgetConfig.parse({ startYear, endYear });
  const alerts = chartData.map(it => it.year).filter(y => y >= startYear && y <= endYear ).length;

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
