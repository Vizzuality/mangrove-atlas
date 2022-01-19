import React from 'react';
import PropTypes from 'prop-types';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import styles from './style.module.scss';

const ButtonGroupComponent = (props) => {
  const { children } = props;
  return (
    <ButtonGroup className={styles.container} aria-label="Button group">
      {children}
    </ButtonGroup>
  );
};

ButtonGroupComponent.propTypes = {
  children: PropTypes.node
};

ButtonGroupComponent.defaultProps = {
  children: null
};

export default ButtonGroupComponent;
