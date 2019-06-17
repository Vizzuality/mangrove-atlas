import React from 'react';
import classnames from 'classnames';
import styles from './style.module.scss';

export default (props) => {
  const { children, isEnabled } = props;

  return (
    <button
      type="button"
      className={classnames(styles.button, isEnabled && styles.enabled)}
      {...props}
    >
      {children}
    </button>
  );
};
