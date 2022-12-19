import React, { useState, useRef, useCallback } from "react";

import PropTypes from "prop-types";
import cx from "classnames";

import Icon from "components/icon";
import Modal from "components/modal";
import Content from "./menu-content";

import styles from "./style.module.scss";

const WidgetsMenu = ({
  currentDashboard,
  dashboards,
  setCurrent,
  mobile,
  disabled,
}) => {
  const [isOpen, toggleModal] = useState(false);
  const [position, setPosition] = useState({
    top: null,
    left: null,
    x: null,
  });

  const menuRef = useRef();

  const handleModal = (slug) => {
    setCurrent(slug);
  };

  const handleHover = useCallback(() => {
    if (menuRef.current) {
      const { top, left, x } = menuRef.current.getBoundingClientRect();
      setPosition({ top, left, x });
    }

    toggleModal(!isOpen);
  }, [menuRef, isOpen]);

  return (
    <div
      className={cx(styles.widgets_menu, { [styles.mobile]: mobile })}
      ref={menuRef}
    >
      {mobile ? (
        <button
          className={cx(styles.btn, {
            [styles._active]: isOpen,
          })}
          onClick={() => toggleModal(!isOpen)}
        >
          <Icon
            name="ecosystem_services"
            className={cx([styles.icon], [styles.ecosystem_services])}
          />
          <span className={styles.menuItemTitle}>Category</span>
        </button>
      ) : (
        <Content
          className={styles.categoriesMenuBtn}
          currentDashboard={currentDashboard}
          dashboards={dashboards}
          disabled={disabled}
          handleModal={handleModal}
          handleHover={handleHover}
        />
      )}
      <Modal
        isOpen={isOpen}
        onRequestClose={() => handleModal(currentDashboard)}
        widgetsMenu
        closeButton={false}
        onMouseLeave={() => toggleModal(false)}
      >
        <Content
          className={cx(styles.modalContent, { [styles.mobile]: mobile })}
          toggleModal={toggleModal}
          style={{
            top: mobile ? "50%" : position.top,
            left: mobile ? "50%" : position.left - position.x,
          }}
          currentDashboard={currentDashboard}
          dashboards={dashboards}
          disabled={disabled}
          handleModal={handleModal}
          handleHover={handleHover}
          text
        />
      </Modal>
    </div>
  );
};

WidgetsMenu.propTypes = {
  currentDashboard: PropTypes.string.isRequired,
  dashboards: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string,
      name: PropTypes.string,
    })
  ),
  setCurrent: PropTypes.func,
  mobile: PropTypes.bool,
  disabled: PropTypes.bool,
};

WidgetsMenu.defaultPros = {
  currentDashboard: "distribution_and_change",
  dashboards: null,
  setCurrent: () => null,
  mobile: false,
  disabled: false,
};

export default WidgetsMenu;
