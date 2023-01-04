import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import styles from "./style.module.scss";

// components
import RestorationDataGroup from "../restoration-data-group";

const RestorationInfo = ({ data, isOpen, handleClick }) => {
  const {
    Class,
    Max_Area_20_ha,
    Area_loss_ha,
    Area_loss_pct,
    Rest_Area_Loss,
    Rest_Area_Loss_pct,
    Loss_Driver,
    Rest_Score,
  } = data;

  return (
    <div className={cx(styles.wrapper, { [styles._collapsed]: !isOpen }) }>
      <div className={styles.head} onClick={handleClick}>
        <span className={styles.title}>
          <h3>RESTORATION SCORES</h3>
        </span>
        <span className={styles.icon}>
          {isOpen ? "-" : "+"}
        </span>
      </div>
      <div className={styles.section}>
        <div className={styles.group}>
          <RestorationDataGroup label="Mangrove type" value={Class} />
          <RestorationDataGroup
            label="Max mangrove area 1996 - 2016"
            value={Max_Area_20_ha}
            unit="ha"
          />
        </div>
        <div className={styles.group}>
          <RestorationDataGroup
            label="Area of Loss"
            value={Area_loss_ha}
            pct={Area_loss_pct}
            unit="ha"
          />
          <RestorationDataGroup
            label="Restorable Area"
            value={Rest_Area_Loss}
            pct={Rest_Area_Loss_pct}
            unit="ha"
          />
          <RestorationDataGroup
            label="Primary Loss Driver"
            value={Loss_Driver}
          />
        </div>
      </div>
      <div className={styles.section}>
        <h4>Restoration potential score</h4>
        <div className={styles.group}>
          <div className={styles.lineChartWidget}>
            <div
              className={styles.lineChartFill}
              style={{ width: `${Rest_Score}%` }}
            />
          </div>
          <div className={styles.chartScore}>{Rest_Score}%</div>

        </div>
      </div>
    </div>
  );
};

RestorationInfo.propTypes = {
  data: PropTypes.shape({
    Class: PropTypes.string,
    Max_Area_20_ha: PropTypes.number,
    Area_loss_ha: PropTypes.number,
    Area_loss_pct: PropTypes.number,
    Rest_Area_Loss: PropTypes.number,
    Rest_Area_Loss_pct: PropTypes.number,
    Area_dgrd_ha: PropTypes.number,
    Area_dgrd_pct: PropTypes.number,
    Rest_Score: PropTypes.number,
  }),
  isOpen: PropTypes.bool,
  handleClick: PropTypes.func
};

RestorationInfo.defaultProps = {
  data: {},
  isOpen: false,
  handleClick: () => {}
};

export default RestorationInfo;
