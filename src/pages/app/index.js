import React from 'react';
import Widgets from 'components/widgets';
import Map from 'components/map';
import LocationModal from 'components/location-modal';
import Sidebar from 'components/sidebar';
import styles from './style.module.scss';

const AppPage = () => (
  <div className={styles.app}>
    <Sidebar>
      <Widgets />
    </Sidebar>
    
    <div className={styles.vis}>
      <Map />
    </div>

    {/* Modals */}
    <LocationModal />
  </div>
);

export default AppPage;
