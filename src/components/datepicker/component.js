import React, { PureComponent } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import ReactDatePicker, { CalendarContainer } from 'react-datepicker';
import classnames from 'classnames';

import DatepickerInput from './input';

import styles from './style.module.scss';

class Datepicker extends PureComponent {
  renderCalendarContainer = ({ children }) => {
    return createPortal(
      <CalendarContainer>
        {children}
      </CalendarContainer>
    , document.body);
  };

  render() {
    const { className, onDateChange, settings, theme, date, inline } = this.props;
    const { minDate, maxDate } = settings;

    return (
      <div
        ref={ref => { this.ref = ref; }}
        className={classnames(styles.Datepicker, theme, className, { [styles._inline]: inline})}
      >
        <ReactDatePicker
          selected={date.toDate()}
          minDate={new Date(minDate)}
          maxDate={new Date(maxDate)}
          dateFormat="dd-MM-yyyy"
          // Custom components
          customInput={<DatepickerInput />}
          // Popper
          popperContainer={this.renderCalendarContainer}
          popperPlacement="bottom-start"
          popperClassName={styles.DatepickerPopper}
          popperModifiers={{
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
          }}
          // Func
          onSelect={onDateChange}
          // renderCustomHeader={this.renderCalendarHeader}
        />
      </div>
    );
  }
}

Datepicker.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.string,
  date: PropTypes.object,
  onDateChange: PropTypes.func.isRequired,
  settings: PropTypes.object
};

export default Datepicker;