import React, { useCallback } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import ChartWidget from "components/chart-widget";
import Widgets from "components/widgets";
import Icon from "components/icon";

import styles from "./style.module.scss";
import { useEffect } from "react";

const sentence = (
  <>
    Draw in the map the area you want to analyze through on-the-fly
    calculations.
  </>
);
export const MangroveDrawingTool = ({
  current,
  setCurrent,
  setDrawingValue,
  drawingValue,
  drawingMode,
  expandAll,
}) => {

  useEffect(() => {
    if (drawingMode && drawingValue) {
      expandAll()
    };
  }, [drawingMode, drawingValue, expandAll]);
  

  const handleClick = () => {
    console.log('handle click')
  }
  const handleDrawingMode = useCallback(() => {
    setDrawingValue(null);
    setCurrent("drawPolygon");
  }, [setDrawingValue, setCurrent]);

  return drawingValue ? (
    <Widgets />
  ) : (
    <ChartWidget
      name="Draw or upload an area"
      slug="alert"
      filename={null}
      sentence={sentence}
      chart={false}
      isCollapsed={false}
    >
      <div className={styles.containers}>
        <button
          type="button"
          className={cx(styles.drawingCard, {
            [styles._active]: current === "drawPolygon",
          })}
          onClick={handleDrawingMode}
        >
          <Icon name="polyline" size="md" /> {/* primary color */}
          <span className={styles.title}>Draw area</span>
        </button>
        or
        <button
          type="button"
          className={cx(styles.drawingCard, { [styles._dashed]: true })}
        >
          <Icon name="upload" size="md" />
          <div className={styles.text}>
            <span className={styles.title}>Browse shapefile</span>
            <span className={styles.description}>(Clic or drag-and-drop file)</span>
          </div>
        </button>
      </div>
      <p>
        Learn more about
        <button onClick={handleClick} className={styles.highlighted}>
          supported file formats
        </button>
        <br />
        By uploading data you agree to the{" "}
        <a href="" className={styles.highlighted}>
          Terms of Service
        </a>
      </p>
    </ChartWidget>
  );
};

MangroveDrawingTool.propTypes = {
  current: PropTypes.string,
  setCurrent: PropTypes.func,
  setDrawingValue: PropTypes.func,
};

MangroveDrawingTool.defaultProps = {
  current: null,
  setCurrent: () => null,
  setDrawingValue: () => null,
};

export default MangroveDrawingTool;
