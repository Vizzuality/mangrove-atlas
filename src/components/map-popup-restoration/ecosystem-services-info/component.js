import React from "react";
import PropTypes from "prop-types";

import cx from 'classnames';

import styles from "./style.module.scss";

// components
import RestorationDataGroup from "../restoration-data-group";

const EcosystemServicesInfo = ({ data, isOpen, handleClick }) => {
  const { SOC, AGB, People, Fish_Score_Inv, Fish_Score } = data;
 return (
    <div className={cx(styles.wrapper, { [styles._collapsed]: !isOpen }) }>
      <div className={styles.head} onClick={handleClick}>
        <span className={styles.title}>
          <h3>ECOSYSTEM SERVICES</h3>
          <p>for restores mangroves</p>
        </span>
        <span className={styles.icon}>{isOpen ? "-" : "+"}</span>
      </div>
      <div className={styles.section}>
        <div className={styles.group}>
          <RestorationDataGroup label="Soil organic carbon" value={SOC} />
          <RestorationDataGroup label="Aboveground carbon" value={AGB} />
          <RestorationDataGroup label="People protected" value={People} />
        </div>
        <div className={styles.group}>
          <RestorationDataGroup
            label="Commercial invert catch
            enhancement value"
            value={Fish_Score_Inv}
          />
          <RestorationDataGroup
            label="Commercial fish catch
            enhancement value"
            value={Fish_Score}
          />
        </div>
      </div>
    </div>
  );
};

EcosystemServicesInfo.propTypes = {
  data: PropTypes.shape({
    SOC: PropTypes.number,
    AGB: PropTypes.number,
    People: PropTypes.number,
    Fish_Score_Inv: PropTypes.number,
    Fish_Score: PropTypes.number,
  }),
  isOpen: PropTypes.bool,
  handleClick: PropTypes.func
};

EcosystemServicesInfo.defaultProps = {
  data: {},
  isOpen: false,
  handleClick: () => {}
};

export default EcosystemServicesInfo;
