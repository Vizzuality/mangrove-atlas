import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './styles.scss';

const Icon = ({ name, className, style }) => {
  const classNames = classnames({ [className]: className });
  return (
    <svg className={`c-icon ${classNames}`} style={style}>
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
