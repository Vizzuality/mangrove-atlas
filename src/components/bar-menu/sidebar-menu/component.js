import React from 'react';

// components
import NavMenu from 'components/nav-menu';
import SearchLocation from 'components/search-location';
import WidgetsMenu from 'components/widgets-menu';

import styles from './style.module.scss';

const SidebarMenu = ({
  isDisabled
}) => {
  return (
    <div className={styles.sidebar_menu}>
      <NavMenu />
      <SearchLocation />
      <WidgetsMenu isDisabled={isDisabled} />
    </div>
  );
};

export default SidebarMenu;
