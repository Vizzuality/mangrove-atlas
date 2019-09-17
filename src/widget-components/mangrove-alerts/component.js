import React, { useState } from 'react';
import moment from 'moment';

import { month } from 'utils/nice-date';
import Datepicker from 'components/datepicker';
import ChartWidget from 'components/chart-widget';

import styles from 'components/widget/style.module.scss';

function MangroveAlerts({ config: widgetConfig, minDate = '1996-01-01', maxDate = '2016-12-31', data, isCollapsed, slug, name, ...props}) {
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

  const series = Object.fromEntries(data.map(({
    attributes: {
      date_first: start,
      date_last: end,
      loss: category
    }
  }, index) => {
    const seriesName = `series_${index}`;
    const seriesData = [{
      id: seriesName,
      date: start,
      category,
      mark: moment(start).month(),
      [seriesName]: -90 + index * 8
    }];

    if (start !== end) {
      seriesData.push({
        id: seriesName,
        date: end || 'Happening now.',
        category,
          mark: ( end && moment(end).month()) || month(new Date()),
        [seriesName]: -90 + index * 8
      });
    }

    return [seriesName, {
      ...seriesLineDefinition,
      data: seriesData
    }];
  }));

  const { chartData, chartConfig } = widgetConfig.parse(data, { startMark, endMark, series });
  const alerts = chartData.map(it => it.year).filter(y => y >= startMark && y <= endMark ).length;
  const sentence = (
    <>
      There were <span className={styles.bold}>{alerts}</span> loss alerts <br/>between {startDatepicker} and {endDatepicker}
    </>
  );

  const chartRData = {
    data: chartData,
    config: chartConfig
  };

  return (
    <ChartWidget
      name={name}
      data={chartData}
      slug={slug}
      filename={slug}
      isCollapsed={isCollapsed}
      sentence={sentence}
      chartData={chartRData}
      {...props}
    />
  );
}

export default MangroveAlerts;
