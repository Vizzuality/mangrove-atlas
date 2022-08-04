import React from "react";
import PropTypes from "prop-types";

import { format } from 'd3-format';

import style from "./style.module.scss";

const numberFormat = format(',.2');

const DataGroup = ({ label, value, pct }) => (
  <div className={style.wrapper}>
    <div className={style.label}>{label}</div>
    <div className={style.value}>{typeof(value) === Number ? numberFormat(value) : value}{' '}{!!pct && `(${pct}%)`}</div>
  </div>
);

DataGroup.propTypes = {
  label: PropTypes.string,
  value: PropTypes.number || PropTypes.string,
  pct: PropTypes.string,
};

DataGroup.defaultProps = {
  label: null,
  value: null,
  pct: null,
};

export default DataGroup;
