import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";
import styles from "./style.module.scss";

const LegendItem = ({
  id,
  name,
  toggleActive,
  toggleWidgetActive,
  setDrawingValue,
  setDrawingStatus,
  isCollapsed,
  mapView,
  setCustomGeojsonFeatures,
  setCurrent
}) => {
  const isCustomLayer = id === 'custom-layer';

  const onClickHandler = useCallback(() => {
    if (isCustomLayer) {
      setDrawingStatus(null);
      setDrawingValue(null);
      setCustomGeojsonFeatures(null);
      setCurrent({ id: 'worldwide' });
    } else {
      toggleActive({ id, isActive: false });
      toggleWidgetActive({ layerId: id, isActive: false });
    }
  }, [id, toggleActive, toggleWidgetActive, isCustomLayer]); // eslint-disable-line

  return (
    <div
      className={classnames(styles.legendItem, {
        [styles.collapse]: isCollapsed && mapView,
        [styles._negative]: isCustomLayer
      })}
    >
      <h3>{name}</h3>
      <button
        className={styles.removeButton}
        type="button"
        onClick={onClickHandler}
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

LegendItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  toggleActive: PropTypes.func,
  toggleWidgetActive: PropTypes.func,
  setDrawingValue: PropTypes.func,
  isCollapsed: PropTypes.bool.isRequired,
  mapView: PropTypes.bool.isRequired,
};

LegendItem.defaultProps = {
  toggleActive: () => null,
  toggleWidgetActive: () => null,
  setDrawingValue: () => null,
};

export default LegendItem;
