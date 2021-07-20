import React from 'react';
import PropTypes from 'prop-types';

// components
import Button from 'components/button';

import background from './bg-shapes.svg';
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


  let stylesOverride = { fontSize: 60, lineheight: 0.85 };
  if ((location && location.name.length > 10)) {
    stylesOverride = { fontSize: 45, lineheight: 1 };
  }
  if ((location && location.name.length > 30)) {
    stylesOverride = { fontSize: 30, lineheight: 1 };
  }

  return (
    <div className={styles.header}>
      <img
        className={styles.bg}
        src={background}
        alt="Background"
      />
      <div>
        {location && (<div className={styles.searchBar}
        >
          <button type="button" className={styles.titleBtn} onClick={clickHandler}>
              <h1
                className={styles.title, 'notranslate'}
                style={stylesOverride}
              >
                {location.name}
              </h1>
          </button>
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
        </div>
        )}
        <p className={styles.printOnly}>Powered by Global Mangrove Watch. https://www.globalmangrovewatch.org</p>
      </div>
    </div>
  );
};

export default Header;
