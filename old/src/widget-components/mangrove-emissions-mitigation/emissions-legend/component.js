import React from "react";
import PropTypes from "prop-types";
import cx from 'classnames';

import styles from "./style.module.scss";

const Legend = ({ groups, onClick, filteredIndicators, setFilteredIndicators }) => (
  <div className={styles.widget_legend}>
    <ul className={styles.widget_legend_list}>
      {groups?.map((g) => (
        <button
        type="button"
          key={g.label}
          onClick={() => onClick(g.label, filteredIndicators, setFilteredIndicators)}
          className={cx(styles.widget_legend_list_item, {
            [styles._disabled]: !filteredIndicators.includes(g.label) && !!filteredIndicators.length
          })}
        >
          <span
            style={{ backgroundColor: g.color }}
            className={styles.item_color}
          />
          <span className={styles.item_value}>{g.label}</span>
        </button>
      ))}
    </ul>
  </div>
);

Legend.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.shape({}).isRequired),
  onClick: PropTypes.func.isRequired,
};

export default Legend;
