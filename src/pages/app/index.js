import React from 'react';
import Widgets from 'components/widgets';
import DesktopLayout from 'components/layout/desktop';
import LocationModal from 'components/location-modal';
import Sidebar from 'components/sidebar';
import ViewSelector from 'components/view-selector';
import MediaQuery from 'react-responsive';
import styles from './style.module.scss';


const AppPage = () => (
  <div className={styles.app}>
    <MediaQuery maxWidth={384}>
      <Sidebar>
        <Widgets />
      </Sidebar>
      <ViewSelector />
    </MediaQuery>
    <MediaQuery minWidth={384}>
      <DesktopLayout />
    </MediaQuery>
    {/* Modals */}
    <LocationModal />
  </div>
);

export default AppPage;
