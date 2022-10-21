import React from 'react';

// components
import DrawingToolControls from 'components/drawing-tool-controls';
import NavMenu from 'components/nav-menu';
import SearchLocation from 'components/search-location';
import WidgetsMenu from 'components/widgets-menu';
import ViewSelector from 'components/view-selector';

import styles from './style.module.scss';

const FooterMenu = () => (
  <div className={styles.footerMenu}>
    <div className={styles.menu}>
      <NavMenu mobile />
      <SearchLocation mobile={true} />
      <DrawingToolControls mobile />
      <WidgetsMenu mobile />
      <ViewSelector />
    </div>
  </div>
);

export default FooterMenu;
