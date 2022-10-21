import React, { useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// components
import Icon from "components/icon";

import styles from "./style.module.scss";

const SearchLocation = ({
  mobile,
  openSearchPanel,
  handleDrawing,
  drawingMode,
  locationsModal,
  drawingValue,
  customGeojsonFeatures,
}) => {
  useEffect(() => {
    if (locationsModal) {
      openSearchPanel();
    }
  }, [locationsModal, openSearchPanel]);

  const handleModal = useCallback(() => {
    if (handleDrawing) {
      handleDrawing(drawingMode);
    }
    if (!drawingValue?.length || !customGeojsonFeatures?.length) {
      openSearchPanel();
    }
  }, [
    handleDrawing,
    drawingMode,
    drawingValue,
    customGeojsonFeatures,
    openSearchPanel,
  ]);

  return (
    <button
      className={cx(styles.sidebarItem, {
        [styles.mobile]: mobile,
        [styles._active]: locationsModal && mobile,
      })}
      type="button"
      onClick={handleModal}
    >
      <Icon name="glass" alt="Search" />
      {mobile && <p className={styles.menuItemTitle}>Search</p>}
    </button>
  );
};

SearchLocation.propTypes = {
  mobile: PropTypes.bool,
  openSearchPanel: PropTypes.func,
  handleDrawing: PropTypes.func,
  drawingMode: PropTypes.bool,
  locationsModal: PropTypes.bool,
};

SearchLocation.defaultProps = {
  mobile: false,
  openSearchPanel: null,
  handleDrawing: null,
  drawingMode: false,
  locationsModal: false,
};

export default SearchLocation;
