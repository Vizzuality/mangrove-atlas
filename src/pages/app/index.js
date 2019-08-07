import React from 'react';
import Widgets from 'components/widgets';
import Map from 'components/map';
import LocationModal from 'components/location-modal';
import Sidebar from 'components/sidebar';
import MediaQuery from 'react-responsive';
import styles from './style.module.scss';


const AppPage = () => (
  <div className={styles.app}>
    <MediaQuery maxWidth={384}>
      <Sidebar>
        <Widgets />
      </Sidebar>
    </MediaQuery>
    <MediaQuery minWidth={384}>
      <Sidebar>
        <Widgets />
      </Sidebar>
      <div className={styles.vis}>
        <Map />
      </div>

    </MediaQuery>
    {/* Modals */}
    <LocationModal />
  </div>
);

export default AppPage;
