import React from "react";
import PropTypes from "prop-types";
import style from "./style.module.scss";

const Detail = ({ label, pct, value, unit }) => (
  <div className={style.wrapper}>
    <div className={style.label}>{label}</div>
    <div className={style.lineChartWidget}>
      <div className={style.lineChartFill} style={{ width: `${pct}%` }} />
      <div className={style.lineChartBackground} />
    </div>
    <div className={style.value}>{value}{!!unit && unit}</div>
  </div>
);

Detail.propTypes = {
  label: PropTypes.string,
  pct: PropTypes.number,
  value: PropTypes.string,
  unit: PropTypes.string,
};

Detail.defaultProps = {
  label: null,
  pct: null,
  value: null,
  unit: null,
};

export default Detail;
