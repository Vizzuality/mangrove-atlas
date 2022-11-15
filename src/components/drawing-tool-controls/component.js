import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
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
  drawingMode,
  drawingValue,
  locationType,
  mobile,
  openModal,
  setCustomGeojsonFeatures,
  customGeojsonFeatures,
  locationsModal,
  closeSearchPanel,
}) => {
  const myStorage = window.localStorage;
  const modalStatus = myStorage.getItem("drawingAlert");

  const [isOpenModalAlert, toggleModalAlert] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(null)
  const handleDrawing = useCallback((value, type) => {
    setSidebarActive(type)
    if (
      value &&
      (!!drawingValue?.length || !!customGeojsonFeatures?.length) &&
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

    if (!value && (!drawingValue?.length || !customGeojsonFeatures?.length)) {
      setDrawingMode(true);
    }

    if (value && !drawingValue?.length && !customGeojsonFeatures?.length) {
      setDrawingMode(!value);
    }
    setTimeout(() => {
      setSidebarActive(false);
    }, 1000);
  }, [customGeojsonFeatures, drawingValue, modalStatus, setCustomGeojsonFeatures, setDrawingMode,setDrawingValue]);

  const handleReset = useCallback(
    () => {
      setDrawingValue(null);
      setCustomGeojsonFeatures(null);
      toggleModalAlert(!isOpenModalAlert);
      sidebarActive !== "drawingTool" && setDrawingMode(false);
    },
    // eslint-disable-next-line
    [setDrawingValue, setCustomGeojsonFeatures, isOpenModalAlert, setDrawingMode]
  );

  const handleCancel = useCallback(() => {
    toggleModalAlert(false);
    closeSearchPanel();
  }, [toggleModalAlert, closeSearchPanel]);

  const handleChange = useCallback(
    () => myStorage.setItem("drawingAlert", false),
    [myStorage]
  );

  return (
    <div className={cx(styles.menuWrapper, { [styles.mobile]: mobile })}>
      {mobile ? (
        <button
          className={cx(styles.btn, {
            [styles._active]: drawingMode,
          })}
          onClick={() => {
            handleDrawing(drawingMode, null);
            drawingMode && toggleModalAlert(true);
          }}
        >
          <Icon
            alt={drawingMode ? "worldwide location" : "create custom area"}
            name={drawingMode ? "globe" : "polyline"}
          />
          <span className={styles.menuItemTitle}>
            {drawingMode ? "Place" : "Custom"}
          </span>
        </button>
      ) : (
        <>
          <span className={styles.menuItemTitle}>Place</span>
          <div className={styles.itemsWrapper}>
            <Link
              to={{ type: "PAGE/APP" }}
              onClick={handleDrawing}
              className={cx(styles.sidebarItem, {
                [styles._active]: locationType === "PAGE/APP" && !drawingMode,
              })}
            >
              <Icon name="globe" size="md" alt="worldwide location" />
            </Link>
            <div className={cx(styles.middle, { [styles._active]: openModal })}>
              <SearchLocation
                className={styles._active}
                handleDrawing={handleDrawing}
                isOpenModalAlert={isOpenModalAlert}
              />
            </div>
            <button
              type="button"
              onClick={() => handleDrawing(drawingMode, 'drawingTool')}
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
