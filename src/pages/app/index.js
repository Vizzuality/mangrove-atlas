import React from 'react';
import LocationSelector from 'components/location-selector';
import Widgets from 'components/widgets';
import Map from 'components/map';
import bg from '../../images/bg-shape.svg';
import styles from './style.module.scss';

const AppPage = () => (
  <div className={styles.app}>
    <img
      className={styles.bg}
      src={bg}
      alt="Background"
    />
    <div className={styles.dashboard}>
      <LocationSelector />
      <Widgets />
    </div>
    <div className={styles.vis}>
      <Map />
    </div>
  </div>
);

export default AppPage;
