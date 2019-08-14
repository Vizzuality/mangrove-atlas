import React from 'react';
import moment from 'moment';
import range from 'lodash/range';
import Button from 'components/button';
import Select from 'components/select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

function DatepickerInteractiveHeader({minDate, maxDate, ...customHeaderProps}) {
  // customHeaderProps are injected by 'react-datepicker'
  // we are using the renderCustomHeader hook
  const {
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled
  } = customHeaderProps;

  const dateMoment = moment(date);
  const minMoment = moment(minDate);
  const maxMoment = moment(maxDate);
  const minYear = Number(minMoment.year());
  const maxYear = Number(maxMoment.year());

  const monthOptions = moment.months().filter((_, i) => {
    if (dateMoment.year() === minMoment.year()) {
      return i >= minMoment.month();
    } else if (dateMoment.year() === maxMoment.year()) {
      return i <= maxMoment.month();
    }

    return true;
  }).map((m, i) => ({ value: i, label: m }));

  const yearOptions = range(minYear, maxYear + 1).map(i => ({ value: i, label: i }));

  return (
    <div className="c-datepicker-header">
      <Button
        theme="theme-button-small square"
        className="menu-link prev-month"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
      >
        <FontAwesomeIcon icon={faChevronDown} />
      </Button>
      <Select
        className="c-date-dropdown"
        theme="theme-dropdown-native theme-dropdown-native-button"
        options={monthOptions}
        onChange={changeMonth}
        value={date.getMonth()}
        width="auto"
      />
      <Select
        className="c-date-dropdown"
        theme="theme-dropdown-native theme-dropdown-native-button"
        options={yearOptions}
        onChange={changeYear}
        value={date.getFullYear()}
        width="auto"
      />
      <Button
        theme="theme-button-small square"
        className="menu-link next-month"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
      >
        <FontAwesomeIcon icon={faChevronUp} />
      </Button>
    </div>
  );
};

export default DatepickerInteractiveHeader;
