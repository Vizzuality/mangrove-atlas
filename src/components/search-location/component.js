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
  isOpenLocationModal,
  drawingValue,
  customGeojsonFeatures,
}) => {
  useEffect(() => {
    if (isOpenLocationModal) {
      openSearchPanel();
    }
  }, [isOpenLocationModal, openSearchPanel]);

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
      className={cx(styles.sidebarItem, { [styles.mobile]: mobile })}
      type="button"
      onClick={handleModal}
    >
      <Icon name="glass" alt="Search" />
    </button>
  );
};

SearchLocation.propTypes = {
  mobile: PropTypes.bool,
  openSearchPanel: PropTypes.func,
  handleDrawing: PropTypes.func,
  drawingMode: PropTypes.bool,
  isOpenLocationModal: PropTypes.bool,
};

SearchLocation.defaultProps = {
  mobile: false,
  openSearchPanel: null,
  handleDrawing: null,
  drawingMode: false,
  isOpenLocationModal: false,
};

export default SearchLocation;
