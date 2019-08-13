import React, { PureComponent } from 'react';
import classnames from 'classnames';

import styles from './style.module.scss';

class DatepickerInput extends PureComponent {
  state = {
    focus: false
  }

  onFocus = (e) => {
    const { onFocus } = this.props;

    this.setState({ focus: true });
    onFocus(e);
  }

  onBlur = (e) => {
    const { onBlur } = this.props;

    this.setState({ focus: false });
    onBlur(e);
  }

  render () {
    const { value, onClick } = this.props;
    const { focus } = this.state;

    return (
      <button
        className={classnames(styles.DatepickerInput, { _focus: Boolean(focus) })}
        onClick={onClick}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      >
        {value}
      </button>
    )
  }
}

export default DatepickerInput;