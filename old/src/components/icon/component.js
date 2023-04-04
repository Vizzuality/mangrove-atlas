import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './styles.scss';

const SIZE = {
  xsm: '_xsmall',
  sm: '_small',
  md: '_medium',
  lg: '_large',
  xlg: '_xlarge'
}

const Icon = ({ name, className, size = null, style }) => {
  const classNames = classnames({ [className]: className });
  return (
    <svg className={`c-icon ${classNames} ${SIZE[size]}`} style={style}>
      <use xlinkHref={`#icon-${name}`} />
    </svg>
  );
};

Icon.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object
};

Icon.defaultProps = {
  name: '',
  className: '',
  style: {}
};

export default Icon;
