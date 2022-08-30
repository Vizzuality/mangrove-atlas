import React, { useState, useEffect, useRef } from "react";
import cx from "classnames";

import styles from "./style.module.scss";

const LocationMenu = ({ location, drawingMode }) => {
  let stylesOverride = { fontSize: 60, lineheight: 0.85 };
  if (location?.name.length > 10) {
    stylesOverride = { fontSize: 45, lineheight: 1 };
  }
  if (location?.name.length > 30) {
    stylesOverride = { fontSize: 30, lineheight: 1 };
  }

  const [width, setWidth] = useState(null);
  const titleRef = useRef();

  useEffect(() => {
    const { width } = titleRef?.current.getBoundingClientRect();
    setWidth(width);
  }, [titleRef]);

  return (
    <div className={styles.locationMenu}>
      <h1
        className={
          (cx(styles.title),
          {
            [styles._medium]: width > 10,
            [styles._long]: width > 10,
          })
        }
        style={stylesOverride}
      >
        <span ref={titleRef}>{drawingMode ? 'Custom area' : location?.name}</span>
      </h1>
    </div>
  );
};

export default LocationMenu;
