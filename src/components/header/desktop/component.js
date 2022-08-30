import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// components
import Button from "components/button";

import background from "./bg-shapes.svg";
import styles from "./style.module.scss";

const Header = ({
  location,
  openSearchPanel,
  isCollapsed,
  collapseAll,
  expandAll,
  widgetsLength,
  drawingMode,
  drawingValue,
}) => {
  const onClickCollapseAll = () => {
    collapseAll();
  };

  const onClickExpandAll = () => {
    expandAll();
  };

  const clickHandler = () => {
    openSearchPanel();
  };

  return (
    <div className={styles.header}>
      <img className={styles.bg} src={background} alt="Background" />
      {location && (
        <div className={styles.searchBar}>
          <button
            type="button"
            className={styles.titleBtn}
            onClick={clickHandler}
            disabled={drawingMode}
          >
            <h1
              className={cx(styles.title, "notranslate", {
                [styles._medium]:
                  location.name.length > 10 && location.name.length < 30,
                [styles._long]: location.name.length >= 30,
                [styles._short]: location.name.length <= 10 || drawingMode,
              })}
            >
              {drawingMode ? "Custom area" : location.name}
            </h1>
          </button>
          <p className={styles.printOnly}>
            Powered by Global Mangrove Watch.
            https://www.globalmangrovewatch.org
          </p>
          {!!widgetsLength && (!drawingMode && !drawingValue) && (
            <div className={styles.noPrint}>
              {isCollapsed ? (
                <Button
                  hasBackground
                  hasContrast
                  onClick={onClickExpandAll}
                  isDisabled={widgetsLength === 1}
                >
                  Expand all widgets
                </Button>
              ) : (
                <Button
                  isTransparent
                  isGrey
                  onClick={onClickCollapseAll}
                  isDisabled={widgetsLength === 1}
                >
                  Collapse all widgets
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

Header.propTypes = {
  location: PropTypes.shape({
    name: PropTypes.string,
  }),
  openSearchPanel: PropTypes.func,
  isCollapsed: PropTypes.bool,
  collapseAll: PropTypes.func.isRequired,
  expandAll: PropTypes.func.isRequired,
  widgetsLength: PropTypes.number,
  drawingMode: PropTypes.bool,
};

Header.defaultProps = {
  location: null,
  openSearchPanel: null,
  isCollapsed: true,
  widgetsLength: null,
  drawingMode: false,
};

export default Header;
