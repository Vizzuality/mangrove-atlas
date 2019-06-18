import React from 'react';
import LocationSelector from 'components/location-selector';
import Widgets from 'components/widgets';
// import Map from 'components/map';

import styles from './style.module.scss';

const AppPage = () => (
  <div className={styles.app}>
    <div className={styles.dashboard}>
      <LocationSelector />
      <Widgets />
    </div>
    <div className={styles.map}>
      Map
    </div>
  </div>
);

export default AppPage;
