import React from 'react';
import Header from 'components/header';
import Widgets from 'components/widgets';
import Map from 'components/map';
import LocationModal from 'components/location-modal';
import Dashboard from 'components/dashboard';
import styles from './style.module.scss';

const AppPage = () => (
  <div className={styles.app}>
    <div className={styles.sidebar}>
      <Dashboard>
        <Header />
        <div className={styles.dashboard}>
          <Widgets />
        </div>
      </Dashboard>
    </div>
    <div className={styles.vis}>
      <Map />
    </div>

    {/* Modals */}
    <LocationModal />
  </div>
);

export default AppPage;
