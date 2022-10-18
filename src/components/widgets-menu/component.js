import React, { useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import Icon from "components/icon";
import Modal from "components/modal";

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
        <button className={styles.btn} onClick={() => toggleModal(!isOpen)}>
          <Icon name="ecosystem_services" className={cx([styles.icon])} />
          <span className={styles.menuItemTitle}>Category</span>
        </button>
      ) : (
        <div
          className={cx(styles.categoriesMenuBtn, {
            [styles._disabled]: disabled,
          })}
        >
          <span className={styles.menuItemTitle}>Category</span>
          <ul>
            {dashboards?.map(({ slug, name }) => (
              <button
                key={slug}
                type="button"
                className={styles.menuItemBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleModal(slug);
                }}
                onMouseOver={disabled ? null :handleHover}
                disabled={true}
              >
                <li
                  className={cx({
                    [styles._active]: currentDashboard === slug,
                  })}
                >
                  <Icon name={slug} className={cx([styles.icon])} alt={name} />
                </li>
              </button>
            ))}
          </ul>
        </div>
      )}
      <Modal
        isOpen={isOpen}
        onRequestClose={() => handleModal(currentDashboard)}
        widgetsMenu
        closeButton={false}
        onMouseLeave={() => toggleModal(false)}
      >
        <div
          onMouseLeave={() => toggleModal(false)}
          className={cx(styles.modalContent, { [styles.mobile]: mobile })}
          style={{
            top: mobile ? "50%" : position.top,
            left: mobile ? "50%" : position.left - position.x,
          }}
        >
          <span className={styles.menuItemTitle}>Category</span>
          <ul>
            {dashboards?.map(({ slug, name }) => (
              <li
                key={slug}
                onClick={(e) => {
                  e.stopPropagation();
                  handleModal(slug);
                }}
                className={cx({ [styles._active]: currentDashboard === slug })}
              >
                <Icon name={slug} className={cx([styles.icon])} alt={name} />
                <span>{name}</span>
              </li>
            ))}
          </ul>
        </div>
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
  currentDashboard: 'distribution_and_change',
  dashboards: null,
  setCurrent: () => null,
  mobile: false,
  disabled: false,
};

export default WidgetsMenu;
