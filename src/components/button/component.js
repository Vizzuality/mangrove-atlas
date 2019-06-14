import React from 'react';
import styles from './style.module.css';

export default (props) => {
  const { children, isEnabled } = props;

  return (
    <button
      type="button"
      className={isEnabled ? styles.button_is_enabled : styles.button}
      {...props}
    >
      {children}
    </button>
  );
};
