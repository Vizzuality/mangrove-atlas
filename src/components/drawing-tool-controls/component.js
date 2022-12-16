import React, { useCallback, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";

import Link from "redux-first-router-link";

import cx from "classnames";

import Icon from "components/icon";
import SearchLocation from "components/search-location";
import Modal from "components/modal";
import Button from "components/button";

import styles from "./style.module.scss";

const DrawingToolControls = ({
  setDrawingMode,
  setDrawingValue,
  setCurrentLocation,
  currentLocation,
  drawingMode,
  drawingValue,
  locationType,
  mobile,
  openModal,
  setCustomGeojsonFeatures,
  customGeojsonFeatures,
  locationsModal,
  closeSearchPanel,
  openSearchPanel,
  setCurrentStatus,
  mapView
}) => {
  const myStorage = window.localStorage;
  const modalStatus = myStorage.getItem("drawingAlert");

  const [isOpenModalAlert, toggleModalAlert] = useState(false);

  const [sidebarActive, setSidebarActive] = useState(null);
  const handleDrawing = useCallback(
    (value, type) => {
      setSidebarActive(type);
      if (
        value &&
        (!!drawingValue?.length || !isEmpty(customGeojsonFeatures)) &&
        modalStatus === null
      ) {
        toggleModalAlert(true);
        setDrawingMode(value);
      }

      if (modalStatus) {
        setDrawingValue(null);
        setCustomGeojsonFeatures(null);
        setDrawingMode(!value);
      }

      if (!modalStatus && (!!drawingValue || !!customGeojsonFeatures)) {
        toggleModalAlert(true);
      }

      if (!value && (!drawingValue?.length || isEmpty(customGeojsonFeatures))) {
        setDrawingMode(true);
      }

      if (value && !drawingValue?.length && isEmpty(customGeojsonFeatures)) {
        setDrawingMode(!value);
      }
      if (type === 'drawingTool') {
        setCurrentStatus("drawingMode")
      }
      setTimeout(() => {
        setSidebarActive(false);
      }, 1000);
    },
    [
      customGeojsonFeatures,
      drawingValue,
      modalStatus,
      setCustomGeojsonFeatures,
      setDrawingMode,
      setDrawingValue,
      setCurrentStatus
    ]
  );

  const handleReset = useCallback(() => {
    setDrawingValue(null);
    setCustomGeojsonFeatures(null);
    toggleModalAlert(!isOpenModalAlert);
    sidebarActive !== "drawingTool" && setDrawingMode(false);
    setCurrentLocation({
      ...currentLocation,
      location_type: "worldwide",
      id: "worldwide",
    });
    sidebarActive === 'search' && openSearchPanel();
    // eslint-disable-next-line
  }, [
    setDrawingValue,
    setCustomGeojsonFeatures,
    isOpenModalAlert,
    setDrawingMode,
    setCurrentLocation,
    openSearchPanel,
    setCurrentStatus
  ]);

  const handleCancel = useCallback(() => {
    toggleModalAlert(false);
    closeSearchPanel();
  }, [toggleModalAlert, closeSearchPanel]);

  const handleChange = useCallback(
    () => myStorage.setItem("drawingAlert", false),
    [myStorage]
  );

  const isDrawingMobileMenu = useMemo(() => drawingMode && !mapView , [drawingMode, mapView]);

  return (
    <div className={cx(styles.menuWrapper, { [styles.mobile]: mobile })}>
      {mobile ? (
        <button
          className={cx(styles.btn, {
            [styles._active]: drawingMode,
          })}
          onClick={handleDrawing}
        >
          <Icon
            alt={isDrawingMobileMenu  ? "worldwide location" : "create custom area"}
            name={isDrawingMobileMenu ? "globe" : "polyline"}
          />
          <span className={styles.menuItemTitle}>
            {isDrawingMobileMenu ? "Place" : "Custom"}
          </span>
        </button>
      ) : (
        <>
          <span className={styles.menuItemTitle}>Place</span>
          <div className={styles.itemsWrapper}>
            {drawingMode || drawingValue?.length || !isEmpty(customGeojsonFeatures) ? (
              <button
                onClick={!drawingMode ? false : () => handleDrawing(drawingMode, 'worldwide')}
                disabled={locationType === "PAGE/APP" && !drawingMode}
                className={cx(styles.sidebarItem, {
                  [styles._active]: locationType === "PAGE/APP" && !drawingMode,
                })}
              >
                <Icon name="globe" size="md" alt="worldwide location" />
              </button>
            ) : (
              <Link
                to={{ type: "PAGE/APP" }}
                disabled={locationType === "PAGE/APP" && !drawingMode}
                onClick={!drawingMode ? false : () => handleDrawing(drawingMode, 'worldwide')}
                className={cx(styles.sidebarItem, {
                  [styles._active]: locationType === "PAGE/APP" && !drawingMode,
                })}
              >
                <Icon name="globe" size="md" alt="worldwide location" />
              </Link>
            )}
            <div className={cx(styles.middle, { [styles._active]: openModal })}>
              <SearchLocation
                className={styles._active}
                handleDrawing={() => handleDrawing((drawingMode, 'search'))}
                isOpenModalAlert={isOpenModalAlert}
              />
            </div>
            <button
              type="button"
              onClick={() => handleDrawing(drawingMode, "drawingTool")}
              className={cx(styles.sidebarItem, {
                [styles._active]: drawingMode && !locationsModal,
              })}
            >
              <Icon
                name="polyline"
                className={styles.icon}
                size="md"
                alt="create custom area"
              />
            </button>
          </div>
        </>
      )}
      <Modal
        isOpen={isOpenModalAlert}
        onRequestClose={handleCancel}
        closeButton
        centered
      >
        <div className={styles.modalContent}>
          <div className={styles.modalDescription}>
            <h3>Reset the page and delete area</h3>
            <p>
              If you reset the page,{" "}
              <span>your custom area will be deleted</span>. Are you sure that
              you want to reset the page?
            </p>
            <div className={styles.modalCheckbox}>
              <label htmlFor="modal">Don’t ask me again.</label>
              <input
                type="checkbox"
                name="modal"
                id="modal"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={styles.modalButtons}>
            <Button type="button" isTransparent onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="button" hasBackground onClick={handleReset}>
              Reset page
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

DrawingToolControls.propTypes = {
  setDrawingMode: PropTypes.func,
  drawingMode: PropTypes.bool,
  locationType: PropTypes.string,
  mobile: PropTypes.bool,
  openModal: PropTypes.bool,
};

DrawingToolControls.defaultProps = {
  setDrawingMode: () => null,
  drawingMode: false,
  locationType: null,
  mobile: false,
  openModal: false,
};

export default DrawingToolControls;
