import React from 'react';
import styles from './style.module.scss';

export default (props) => {
  const { children } = props;

  return (
    <div className={styles.toggle}>
      <button type="button">
        {children}
      </button>
      <button
        type="button"
      >
        {children}
      </button>

    </div>

  );
};
