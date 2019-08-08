import React from 'react';
import DesktopLayout from 'components/layout/desktop';
import MobileLayout from 'components/layout/mobile';
import LocationModal from 'components/location-modal';
import MediaQuery from 'react-responsive';
import styles from './style.module.scss';


const AppPage = () => (
  <div className={styles.app}>
    <MediaQuery maxWidth={384}>
      <MobileLayout />
    </MediaQuery>
    <MediaQuery minWidth={384}>
      <DesktopLayout />
    </MediaQuery>
    {/* Modals */}
    <LocationModal />
  </div>
);

export default AppPage;
