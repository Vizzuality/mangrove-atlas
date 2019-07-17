import React from 'react';
import classnames from 'classnames';
import styles from './style.module.scss';

export default (props) => {
  const { children, isActive, isDisabled, isPrimary, isSecondary, ...domProps } = props;

  return (
    <button
      type="button"
      className={classnames(styles.button,
        { [styles.primary]: isPrimary },
        { [styles.secondary]: isSecondary })}
      {...domProps}
    >
      {children}
    </button>
  );
};
