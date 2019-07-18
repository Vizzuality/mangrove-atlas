import React from 'react';
import classnames from 'classnames';
import styles from './style.module.scss';

export default (props) => {
  const { children,
    isActive,
    isDisabled,
    hasBackground,
    isTransparent,
    isGrey,
    hasContrast,
    ...domProps } = props;

  return (
    <button
      type="button"
      className={classnames(styles.button,
        { [styles.background]: hasBackground },
        { [styles.transparent]: isTransparent },
        { [styles.grey]: isGrey },
        { [styles.contrast]: hasContrast },
        { [styles.disabled]: isDisabled })
      }
      {...domProps}
    >
      {children}
    </button>
  );
};
