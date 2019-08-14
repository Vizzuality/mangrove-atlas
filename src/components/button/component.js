import React from 'react';
import classnames from 'classnames';
import styles from './style.module.scss';

export default (props) => {
  const { children,
    isDisabled,
    hasBackground,
    isTransparent,
    isGrey,
    hasContrast,
    isActive,
    className,
    ...domProps } = props;

  return (
    <button
      type="button"
      className={classnames({
        [styles.button]: true,
        [styles.background]: hasBackground,
        [styles.transparent]: isTransparent,
        [styles.grey]: isGrey,
        [styles.contrast]: hasContrast,
        [styles.disabled]: isDisabled,
        [className]: className
      })}
      {...domProps}
    >
      {children}
    </button>
  );
};
