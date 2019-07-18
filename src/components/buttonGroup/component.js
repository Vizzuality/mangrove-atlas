import React from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from '../button';
import styles from './style.module.scss';

export default (props) => {
  const { children } = props;

  return (
    <ButtonGroup className={styles.container} aria-label="Button group">
      {children}
      {/* <Button>Opción 1</Button>
      <Button>Opción 2</Button>
      <Button>Opción 3</Button> */}
    </ButtonGroup>

  );
};
