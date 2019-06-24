import React from 'react';
import Header from 'components/header';
import Widgets from 'components/widgets';
import Map from 'components/map';
import LocationSelector from 'components/location-selector';
import background from './bg-shape.svg';
import styles from './style.module.scss';

const AppPage = () => (
  <div className={styles.app}>
    <img
      className={styles.bg}
      src={background}
      alt="Background"
    />
    <div className={styles.dashboard}>
      <Header />
      <Widgets />
    </div>
    <div className={styles.vis}>
      <Map />
    </div>
    <div className={styles.overlay}>
      <LocationSelector />
    </div>
  </div>
);

export default AppPage;
