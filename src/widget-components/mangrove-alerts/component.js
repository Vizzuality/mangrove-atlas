import React, { useState } from 'react';
import moment from 'moment';

import { month } from 'utils/nice-date';
import Datepicker from 'components/datepicker';
import ChartWidget from 'components/chart-widget';

function MangroveAlerts({ config: widgetConfig, minDate = '2019-01-01', maxDate = '2020-12-31', data, isCollapsed, slug, name, ...props }) {
  const [mangroveAlertsState, setMangroveAlertsState] = useState({
    startDate: moment(minDate).add(0, 'y'),
    endDate: moment(maxDate).subtract(0, 'y')
  });

  const { startDate, endDate } = mangroveAlertsState;

  const datepickerHandler = payload => setMangroveAlertsState(state => ({
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
          isOutsideRange: d => d.isAfter(moment(maxDate)) || d.isBefore(moment(minDate)),
          hideKeyboardShortcutsPanel: true,
          noBorder: true,
          readOnly: true
        }}
        onDateChange={onChange}
      />
    );
  }

  const startDatepicker = (
    <DatePicker
      date={moment(startDate)}
      onChange={value => datepickerHandler({startDate: value })}
    />
  );

  const endDatepicker = (
    <DatePicker
      date={moment(endDate)}
      onChange={value => datepickerHandler({endDate: value })}
    />
  );

  const startMark = month(startDate) + 2;
  const endMark = month(endDate) - 2;

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
      [seriesName]: -90 + (index * 25)
    }];

    if (start !== end) {
      seriesData.push({
        id: seriesName,
        date: end || 'Happening now.',
        category,
        mark: ( end && moment(end).month()) || month(new Date()),
        [seriesName]: -90 + (index * 25)
      });
    }

    return [seriesName, {
      ...seriesLineDefinition,
      data: seriesData
    }];
  }));

  const { chartData, chartConfig } = widgetConfig.parse(data, { startMark, endMark, series });
  const alerts = chartData.map(alert => ({
    start: alert.attributes.date_first,
    end: alert.attributes.date_last
  })).filter((alert) => {
    const afterStart = moment(startDate).diff(alert.start) <= 0;
    const beforeEnd = !alert.end || moment(endDate).diff(alert.end) >= 0;
    return afterStart && beforeEnd;
  }).length;
  const sentence = (
    <>
      There were <strong>{alerts}</strong> loss alerts <br />between {startDatepicker} and {endDatepicker}
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
