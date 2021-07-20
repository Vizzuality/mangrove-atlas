import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Link from 'redux-first-router-link';

import logo from 'components/layout/logo.svg';


// components
import Button from 'components/button';

import styles from './style.module.scss';

const Header = ({
  location,
  openSearchPanel,
  isCollapsed,
  collapseAll,
  expandAll
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

  const onClickDownload = () => window.print();


  let stylesOverride = { fontSize: 60, lineheight: 0.85 };
  if ((location && location.name.length > 10)) {
    stylesOverride = { fontSize: 45, lineheight: 1 };
  }
  if ((location && location.name.length > 30)) {
    stylesOverride = { fontSize: 30, lineheight: 1 };
  }

  return (
    <div className={styles.header}>
      {location && (<div className={styles.searchBar}
      >
        <button type="button" className={styles.titleBtn} onClick={clickHandler}>
          <h1 className={classnames(styles.title, 'notranslate')}>
            {location.name}
          </h1>
        </button>
        <div className={styles.headerBtns}>
          {isCollapsed
            ? (
              <Button
                hasBackground
                hasContrast
                onClick={onClickExpandAll}
              >
                Expand all widgets
              </Button>
            )
            : (
              <Button
                isTransparent
                isGrey
                onClick={onClickCollapseAll}
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
      </div>
      )}
      <p className={styles.printOnly}>Powered by Global Mangrove Watch. https://www.globalmangrovewatch.org</p>
    </div>
  );
};

export default Header;
