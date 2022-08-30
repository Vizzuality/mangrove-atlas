import React from 'react';

// components
import NavMenu from 'components/nav-menu';
import DrawingToolControls from 'components/drawing-tool-controls';
import WidgetsMenu from 'components/widgets-menu';

import styles from './style.module.scss';

const SidebarMenu = () => {
  return (
    <div className={styles.sidebar_menu}>
      <NavMenu />
      <DrawingToolControls />
      <WidgetsMenu />
    </div>
  );
};

export default SidebarMenu;
