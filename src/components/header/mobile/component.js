import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// components
import Button from 'components/button';

import styles from './style.module.scss';

const Header = ({
  location,
  openSearchPanel,
  isCollapsed,
  collapseAll,
  expandAll,
  setMobileView,
  widgets,
  drawingMode,
}) => {

  const onClickCollapseAll = () => {
    collapseAll();
  }

  const onClickExpandAll = () => {
    expandAll();
  }

  const clickHandler = () => {
    openSearchPanel();
  }

  const onClickDownload = () => {
    setMobileView(true);
    window.print();
  }

  return (
    <div className={styles.header}>
      {location && (<div className={styles.searchBar}
      >
        <button type="button" className={styles.titleBtn} onClick={clickHandler}>
          <h1 className={classnames(styles.title, 'notranslate', {
            [styles._short]: location.name.length <= 10,
            [styles._medium]: location.name.length > 10 && location.name.length < 30,
            [styles._long]: location.name.length >= 30,
          }
          )}>
              {drawingMode ? "Custom area" : location.name}
          </h1>
        </button>
        <p className={styles.printOnly}>Powered by Global Mangrove Watch. https://www.globalmangrovewatch.org</p>
        {!drawingMode && (
          <div className={styles.headerBtns}>
            {isCollapsed && (
                <Button
                  hasBackground
                  hasContrast
                  onClick={onClickExpandAll}
                  isDisabled={widgets.length === 1}
                >
                  Expand all widgets
                </Button>
              )}
              {!isCollapsed && (
                <Button
                  isTransparent
                  isGrey
                  onClick={onClickCollapseAll}
                  isDisabled={widgets.length === 1}
                >
                  Collapse all widgets
                </Button>
              )}
            <Button
              className={styles.printBtn}
              isTransparent
              isGrey
              onClick={onClickDownload}
            >
              Download as PDF
            </Button>
          </div>
        )}
      </div>
      )}
    </div>
  );
};

Header.propTypes = {
  location: PropTypes.string,
  openSearchPanel: PropTypes.func,
  isCollapsed: PropTypes.bool,
  collapseAll: PropTypes.func.isRequired,
  expandAll: PropTypes.func.isRequired,
}

Header.defaultProps = {
  location: null,
  openSearchPanel: null,
  isCollapsed: true
}

export default Header;
