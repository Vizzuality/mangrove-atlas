import React, { useMemo } from 'react';

// components
import HeaderDesktop from 'components/header/desktop';
import Widgets from 'components/widgets';
import SidebarMenu from 'components/bar-menu/sidebar-menu';

import styles from './style.module.scss';

const DesktopLayout = ({
  widgets,
  category,
  dataByWidget,
}) => {

  const widgetsCategory = useMemo(() =>
    widgets.filter(
      ({ categoryIds, slug }) =>
        categoryIds.includes(category) && dataByWidget.includes(slug),
      [category, widgets, dataByWidget]
    )
  );

  return (
  <div className={styles.printOnly_wrapper}>
    <div className={styles.dashboards}>
      <HeaderDesktop />
      <Widgets />
      <p className={styles.printOnly}>Generate your report at https://www.globalmangrovewatch.org</p>
    </div>
      <SidebarMenu isDisabled={!widgetsCategory.length} />
  </div>
);
  };


export default DesktopLayout;
