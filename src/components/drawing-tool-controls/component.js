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
}) => {
  const myStorage = window.localStorage;
  const modalStatus = myStorage.getItem("drawingAlert");

  const [isOpenModalAlert, toggleModalAlert] = useState(false);

  const handleDrawing = useCallback(
    (value) => {
      if (!!drawingValue && modalStatus === null) {
        toggleModalAlert(true);
      }
      setDrawingMode(value);
      if (modalStatus) {
        setDrawingValue(null);
      }
    },
    [setDrawingMode, drawingValue, modalStatus, setDrawingValue]
  );

  const handleReset = useCallback(() => {
    toggleModalAlert(isOpenModalAlert);
    setDrawingValue(null);
  }, [setDrawingValue, isOpenModalAlert]);

  const handleCancel = useCallback(
    () => toggleModalAlert(false),
    [toggleModalAlert]
  );

  const handleChange = useCallback(
    () => myStorage.setItem("drawingAlert", false),
    [myStorage]
  );

  return (
    <div className={cx(styles.menuWrapper, { [styles.mobile]: mobile })}>
      {mobile ? (
        <button className={styles.btn}>
          <Icon name="ecosystem_services" className={styles.icon} />
          <span className={styles.menuItemTitle}>Place</span>
        </button>
      ) : (
        <>
          <span className={styles.menuItemTitle}>Place</span>
          <div className={styles.itemsWrapper}>
            <Link
              to={{ type: "PAGE/APP" }}
              onClick={() => handleDrawing(false)}
              className={cx(styles.sidebarItem, {
                [styles._active]: locationType === "PAGE/APP" && !drawingMode,
              })}
            >
              <Icon
                name="globe"
                className={styles.icon}
                size="md"
                alt="worldwide location"
              />
            </Link>
            <div className={cx(styles.middle, { [styles._active]: openModal })}>
              <SearchLocation className={styles._active} />
            </div>
            <button
              type="button"
              onClick={() => handleDrawing(!drawingMode)}
              className={cx(styles.sidebarItem, {
                [styles._active]: drawingMode,
              })}
            >
              <Icon
                name="upload"
                className={styles.icon}
                size="md"
                alt="create custom area"
              />
            </button>
          </div>
        </>
      )}
      <Modal isOpen={isOpenModalAlert} onRequestClose={handleCancel} closeButton centered>
        <div className={styles.modalContent}>
          <div className={styles.modalDescription}>
            <h3>Reset the page and delete area</h3>
            <p>
              If you reset the page,{" "}
              <span>your custom area will be deleted</span>. Are you sure that
              you want to reset the page?
            </p>
            <div className={styles.modalCheckbox}>
              <label for="modal">Don’t ask me again.</label>
              <input
                type="checkbox"
                name="modal"
                id="modal"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={styles.modalButtons}>
            <Button
              type="button"
              isTransparent
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="button"
              hasBackground
              onClick={handleReset}
            >
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