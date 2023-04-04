import React from 'react';
import PropTypes from 'prop-types';

import { format } from 'd3-format';

import style from './style.module.scss';

const numberFormat = format(',.0f');

const DataGroup = ({
  label, value, pct, unit,
}) => (
  <div className={style.wrapper}>
    <div className={style.label}>{label}</div>
    <div className={style.value}>
      {typeof value === 'number' ? numberFormat(value) : value}
      {' '}
      {!!value && !!unit && unit}
      {' '}
      {!!pct && `(${pct}%)`}
      {!value && value !== 0 && '-'}
    </div>
  </div>
);

DataGroup.propTypes = {
  label: PropTypes.string,
  value: PropTypes.number || PropTypes.string,
  pct: PropTypes.string,
  unit: PropTypes.string,
};

DataGroup.defaultProps = {
  label: null,
  value: null,
  pct: null,
  unit: null,
};

export default DataGroup;
