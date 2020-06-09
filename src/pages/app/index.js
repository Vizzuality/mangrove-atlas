import React from 'react';
import DesktopLayout from 'components/layout/desktop';
import MobileLayout from 'components/layout/mobile';
import LocationModal from 'components/location-modal';
import InfoModal from 'components/info-modal';
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';
import styles from './style.module.scss';


const AppPage = () => (
  <div className={styles.app}>
    <MediaQuery maxWidth={breakpoints.lg}>
      <MobileLayout />
    </MediaQuery>
    <MediaQuery minWidth={breakpoints.lg + 1}>
      <DesktopLayout />
    </MediaQuery>
    <LocationModal />
    <InfoModal />
  </div>
);

export default AppPage;
