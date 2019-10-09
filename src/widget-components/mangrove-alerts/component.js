import React, { useState } from 'react';
import moment from 'moment';

import { month } from 'utils/nice-date';
import Select from 'components/select';
import ChartWidget from 'components/chart-widget';

import config from './config';

const ReactSelectStyles = {
  container: provided => ({
    ...provided,
    display: 'inline-block',
    border: 0,
    fontWeight: 'bold',
    position: 'relative',
    paddingTop: 4
  }),
  control: provided => ({
    ...provided,
    backgroundColor: 'transparent',
    borderBottom: '1px solid #000',
    borderRadius: 0,
    width: 'auto',
    borderWidth: 0,
    outline: 0,
    boxShadow: 'none',
    minHeight: 12
  }),
  dummyInput: () => ({
    width: 0
  }),
  input: provided => ({
    ...provided,
    position: 'absolute'
  }),
  menu: provided => ({
    ...provided,
    backgroundColor: 'white',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
    boxShadow: '1px 4px 12px 0 rgba(0, 0, 0, 0.08)',
    boxSizing: 'content-box',
    marginTop: 20,
    width: 70,
    padding: 8,
    transform: 'translateX(-50%)',
    left: '50%',
    '&:after': {
      content: '" "',
      display: 'block',
      position: 'absolute',
      width: 0,
      height: 0,
      left: '50%',
      borderStyle: 'solid',
      bottom: '99%',
      borderColor: 'transparent transparent white transparent',
      borderWidth: '13px',
      transform: 'translateX(-13px)'
    },
    '&:before': {
      content: '" "',
      display: 'block',
      position: 'absolute',
      left: '50%',
      width: 0,
      height: 0,
      borderStyle: 'solid',
      bottom: '100%',
      borderColor: 'transparent transparent rgba(0, 0, 0, 0.1) transparent',
      borderWidth: '12px',
      transform: 'translateX(-12px)'
    },
  }),
  menuList: () => ({
    overflowX: 'hidden'

  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: 9,
    textAlign: 'center',
    opacity: state.isDisabled && !state.isSelected ? 0.4 : 1,
    color: state.isSelected ? '#00857F' : provided.color,
    backgroundColor: 'none',
    '&:hover': {
      color: '#00857F',
      cursor: 'pointer'
    }
  }),
  singleValue: provided => ({
    ...provided,
    color: '#000',
    position: 'relative',
    transform: 'none',
    maxWidth: '100%',
    margin: 0,
    cursor: 'pointer'
  }),
  valueContainer: provided => ({
    ...provided,
    padding: 0
  }),
  dropdownIndicator: provided => ({
    ...provided,
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: '6px solid #000',
    position: 'absolute',
    bottom: '-7px',
    left: '50%',
    transform: 'translate(-50%, 50%)',
    cursor: 'pointer',
    padding: 0
  }),
  indicatorSeparator: () => ({
    width: 0
  })
};

function MangroveAlerts({ minDate = '2019-01-01', maxDate = '2019-12-31', data, isCollapsed, slug, name, addFilter, ...props }) {
  const [mangroveAlertsState, setMangroveAlertsState] = useState({
    startDate: moment(minDate).add(2, 'M').toISOString(),
    endDate: moment(maxDate).subtract(2, 'M').toISOString()
  });

  const { startDate, endDate } = mangroveAlertsState;

  const datepickerHandler = ({ isStart, value }) => {
    const monthStart = `2019-${String(value + 1).padStart(2, 0)}-01`;
    const complement = isStart ? 'endDate' : 'startDate';
    const newState = isStart
      ? { startDate: monthStart }
      : { endDate: moment(monthStart).endOf('month').format('YYYY-MM-DD') };

    addFilter({
      filter: {
        id: 'alerts-style',
        ...newState,
        [complement]: mangroveAlertsState[complement]
      }
    });
    setMangroveAlertsState(state => ({
      ...state,
      ...newState
    }));
  };

  const monthOptions = moment.months().map((m, i) => ({ value: i, label: m }));

  const startDatepicker = (
    <Select
      theme="theme-dropdown-native theme-dropdown-native-button"
      options={monthOptions}
      isOptionDisabled={option => parseInt(option.value, 10) > moment(endDate).month()}
      styles={ReactSelectStyles}
      onChange={value => datepickerHandler({ isStart: true, value })}
      value={moment(startDate).month()}
    />
  );

  const endDatepicker = (
    <Select
      theme="theme-dropdown-native theme-dropdown-native-button"
      options={monthOptions}
      isOptionDisabled={option => parseInt(option.value, 10) < moment(startDate).month()}
      styles={ReactSelectStyles}
      onChange={value => datepickerHandler({ isStart: false, value })}
      value={moment(endDate).month()}
    />
  );

  const startMark = month(startDate);
  const endMark = month(endDate);

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
        mark: (end && moment(end).month()) || month(new Date()),
        [seriesName]: -90 + (index * 25)
      });
    }

    return [seriesName, {
      ...seriesLineDefinition,
      data: seriesData
    }];
  }));

  const { chartData, chartConfig } = config.parse(data, { startMark, endMark, series });
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
      There were <strong>{alerts}</strong> mangrove disturbance alerts <br />
      between {startDatepicker} and {endDatepicker}.
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
