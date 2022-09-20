import React from "react";
import PropTypes from "prop-types";

import styles from "./style.module.scss";

export const TooltipContent = ({ children }) => {
  return (
    <div className={styles.content}>
      <p>{children}</p>
    </div>
  );
};

TooltipContent.propTypes = {
  data: PropTypes.shape({}),
  currentLocation: PropTypes.shape({}),
};

TooltipContent.defaultProps = {
  data: null,
  currentLocation: null,
};

export default TooltipContent;
