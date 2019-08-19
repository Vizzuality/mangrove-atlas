import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import ReactDatePicker, { CalendarContainer } from 'react-datepicker';
import classnames from 'classnames';

import DatepickerInteractiveHeader from 'components/datepicker-interactive-header';
import DatepickerInput from 'components/datepicker-input';

import styles from './style.module.scss';

function OurCalendarContainer({ children }) {
  return createPortal(
    <CalendarContainer>
      {children}
    </CalendarContainer>
  , document.body);
}

function Datepicker({ className, onDateChange, settings: { minDate, maxDate }, theme, date, inline }) {
  const classes = [styles.Datepicker, theme, className].join(' ');
  const popperConfig = {
    flip: {
      enabled: false
    },
    offset: {
      enabled: true,
      offset: '0px, -15px'
    },
    preventOverflow: {
      enabled: true,
      escapeWithReference: false, // force popper to stay in viewport (even when input is scrolled out of view)
      boundariesElement: 'viewport'
    }
  };

  const WrappedHeader = (customHeaderProps) => (
    <DatepickerInteractiveHeader 
      minDate={minDate}
      maxDate={maxDate}
      {...customHeaderProps}
    />
  ); 

  return (
    <div className={classnames(classes, { [styles._inline]: inline})}>
      <ReactDatePicker
        selected={date.toDate()}
        minDate={new Date(minDate)}
        maxDate={new Date(maxDate)}
        dateFormat="dd-MM-yyyy"
        // Custom components
        customInput={<DatepickerInput />}
        renderCustomHeader={WrappedHeader}
        // Popper
        popperContainer={OurCalendarContainer}
        popperPlacement="bottom-start"
        popperClassName={styles.DatepickerPopper}
        popperModifiers={popperConfig}
        // Func
        onSelect={onDateChange}
      />
    </div>
  );
}

Datepicker.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.string,
  date: PropTypes.object,
  onDateChange: PropTypes.func.isRequired,
  settings: PropTypes.object
};

export default Datepicker;