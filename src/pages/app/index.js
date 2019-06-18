import React from 'react';
import LocationSelector from 'components/location-selector';
import WidgetList from 'components/widget-list';
// import Map from 'components/map';

import styles from './style.module.scss';

const AppPage = () => (
  <div className={styles.app}>
    <div className={styles.dashboard}>
      <LocationSelector />
      <WidgetList />
    </div>
    <div className={styles.map}>
      Map
    </div>
  </div>
);

export default AppPage;
