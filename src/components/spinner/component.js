import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './style.module.scss';

const Spinner = ({ isLoading }) => (

  <div
    className={classnames(styles.loader,
      { [styles.loading]: isLoading },
      { [styles.loaded]: !isLoading })}
  />
);

Spinner.propTypes = {
  isLoading: PropTypes.bool,
};

Spinner.defaultProps = {
  isLoading: 'true',
};


export default Spinner;
