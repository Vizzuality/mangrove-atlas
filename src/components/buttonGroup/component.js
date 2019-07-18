import React from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import styles from './style.module.scss';

export default (props) => {
  const { children } = props;
  return (
    <ButtonGroup className={styles.container} aria-label="Button group">
      {children}
    </ButtonGroup>
  );
};
