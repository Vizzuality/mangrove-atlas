import React from 'react';

// components
import NavMenu from 'components/nav-menu';
import SearchLocation from 'components/search-location';
import WidgetsMenu from 'components/widgets-menu';

import styles from './style.module.scss';

const SidebarMenu = () => {
  return (
    <div className={styles.sidebar_menu}>
      <NavMenu />
      <SearchLocation />
      <WidgetsMenu />
    </div>
  );
};

export default SidebarMenu;
