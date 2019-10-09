import React from 'react';
import PropTypes from 'prop-types';

const CustomLabel = ({ value, unit, indexedValue }) => (
  <span>{value} {unit}<sup>{indexedValue}</sup></span>
);

CustomLabel.propTypes = {
  value: PropTypes.oneOfType(PropTypes.number, PropTypes.string),
  unit: PropTypes.string,
  indexedValue: PropTypes.string,
};

CustomLabel.defaultProps = {
  value: null,
  unit: null,
  indexedValue: null,
};

export default CustomLabel;
