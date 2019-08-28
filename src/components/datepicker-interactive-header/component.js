import React from 'react';
import moment from 'moment';
import range from 'lodash/range';
import Button from 'components/button';
import Select from 'components/select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

import styles from './style.module.scss';
import { hidden } from 'ansi-colors';

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
  menuList: provided => ({
    //...provided,
    overflowX: hidden

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
  indicatorSeparator: provided => ({
    width: 0
  })
};

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
    <div className={styles.DatepickerInteractiveHeader}>
      <Button
        className={styles.prevButton}
        onClick={decreaseMonth}
        isDisabled={prevMonthButtonDisabled}
        isTransparent
      >
        <FontAwesomeIcon icon={faChevronDown} />
      </Button>
      <Select
        theme="theme-dropdown-native theme-dropdown-native-button"
        options={monthOptions}
        styles={ReactSelectStyles}
        onChange={changeMonth}
        value={date.getMonth()}
      />
      <Select
        theme="theme-dropdown-native theme-dropdown-native-button"
        options={yearOptions}
        styles={ReactSelectStyles}
        onChange={changeYear}
        value={date.getFullYear()}
      />
      <Button
        className={styles.nextButton}
        onClick={increaseMonth}
        isDisabled={nextMonthButtonDisabled}
        isTransparent
      >
        <FontAwesomeIcon icon={faChevronUp} />
      </Button>
    </div>
  );
};

export default DatepickerInteractiveHeader;
