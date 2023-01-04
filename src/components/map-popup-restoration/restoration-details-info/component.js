import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// components
import Detail from "./detail";

import styles from "./style.module.scss";

const RestorationDetailsInfo = ({ data, isOpen, handleClick }) => {
  const {
    Tidal_range,
    Tidal_range1,
    Ant_SLR,
    Ant_SLR1,
    Future_SLR,
    Future_SLR1,
    Med_Patch,
    Med_Patch1,
    Sediment,
    Sediment1,
    Time_Loss,
    Time_Loss1,
    Prop_loss,
    Prop_loss1,
  } = data;

  return (
    <div className={cx(styles.wrapper, { [styles._collapsed]: !isOpen })}>
      <div className={styles.head} onClick={handleClick}>
        <span className={styles.title}>
          <h3>DETAILS</h3>
        </span>
        <span className={styles.icon}>{isOpen ? "-" : "+"}</span>
      </div>

      <div className={styles.section}>
        <Detail label="Tidal range" pct={Tidal_range1} value={Tidal_range} />
        <Detail label="Antecedent SLR" pct={Ant_SLR1} value={Ant_SLR} />
        <Detail label="Future SLR" pct={Future_SLR1} value={Future_SLR} />
        <Detail label="Timing of loss" pct={Time_Loss1} value={Time_Loss} />
        <Detail label="Sus. sediment trend" pct={Sediment1} value={Sediment} />
        <Detail label="Patch size and number" pct={Med_Patch1} value={Med_Patch} />
        <Detail
          label="Percent contiguous"
          pct={Prop_loss1}
          value={Prop_loss}
          unit="%"
        />
      </div>
    </div>
  );
};

RestorationDetailsInfo.propTypes = {
  data: PropTypes.shape({
    Tidal_range: PropTypes.string,
    Tidal_range1: PropTypes.number,
    Ant_SLR: PropTypes.string,
    Ant_SLR1: PropTypes.number,
    Future_SLR: PropTypes.string,
    Future_SLR1: PropTypes.number,
    Med_Patch: PropTypes.string,
    Med_Patch1: PropTypes.number,
    Sediment: PropTypes.string,
    Sediment1: PropTypes.number,
    Time_Loss: PropTypes.string,
    Time_Loss1: PropTypes.number,
    Prop_loss: PropTypes.string,
    Prop_loss1: PropTypes.number,
  }),
  isOpen: PropTypes.bool,
  handleClick: PropTypes.func,
};

RestorationDetailsInfo.defaultProps = {
  data: {},
  isOpen: false,
  handleClick: () => {},
};

export default RestorationDetailsInfo;
