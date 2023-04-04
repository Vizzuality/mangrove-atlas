import React from "react";

import PropTypes from "prop-types";
import cx from "classnames";

import Icon from "components/icon";

import styles from "../style.module.scss";

const WidgetsMenuContent = ({
  className,
  currentDashboard,
  dashboards,
  disabled,
  handleModal,
  handleHover,
  toggleModal,
  style,
}) => (
  <div
    className={cx([className], {
      [styles._disabled]: disabled,
    })}
    onMouseLeave={toggleModal ? () => toggleModal(false) : null}
    style={style}
  >
    <span className={styles.menuItemTitle}>Category</span>
    <ul>
      {dashboards?.map(({ slug, name }) => (
        <li
          key={slug}
          className={cx({
            [styles._active]: currentDashboard === slug,
          })}
        >
          {toggleModal ? (
            <button
              type="button"
              className={styles.menuItemBtn}
              onClick={(e) => {
                e.stopPropagation();
                handleModal(slug);
              }}
            >
              <Icon
                name={slug}
                className={cx([styles.icon], [styles[slug]])}
                alt={name}
              />
              <span>{name}</span>
            </button>
          ) : (
            <button
              type="button"
              className={styles.menuItemBtn}
              onClick={(e) => {
                e.stopPropagation();
                handleModal(slug);
              }}
              onMouseOver={disabled ? null : handleHover}
              disabled={disabled}
            >
              <Icon
                name={slug}
                className={cx([styles.icon], [styles[slug]])}
                alt={name}
              />
            </button>
          )}
        </li>
      ))}
    </ul>
  </div>
);

WidgetsMenuContent.propTypes = {
  className: PropTypes.string,
  handleModal: PropTypes.func,
  handleHover:PropTypes.func,
  toggleModal: PropTypes.func,
  currentDashboard: PropTypes.string.isRequired,
  dashboards: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string,
      name: PropTypes.string,
    })
  ),
  disabled: PropTypes.bool,
  style: PropTypes.shape({
    [PropTypes.string]: PropTypes.string,
  }),
};

WidgetsMenuContent.defaultPros = {
  className: null,
  handleModal: () => null,
  handleHover:() => null,
  toggleModal: () => null,
  currentDashboard: "distribution_and_change",
  dashboards: null,
  disabled: false,
  style: null,
};

export default WidgetsMenuContent;
