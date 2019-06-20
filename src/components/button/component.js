import React from 'react';
import classnames from 'classnames';
import styles from './style.module.scss';

export default (props) => {
  const { children, isActive, ...domProps } = props;

  return (
    <button
      type="button"
      className={classnames(styles.button, { [styles.active]: isActive })}
      {...domProps}
    >
      {children}
    </button>
  );
};
