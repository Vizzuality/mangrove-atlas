import React from 'react';
import Layout from 'components/layout';
import LocationModal from 'components/location-modal';
import InfoModal from 'components/info-modal';

import styles from './style.module.scss';

const AppPage = () => {
  return (
    <div className={styles.app}>
      <Layout />
      <LocationModal />
      <InfoModal />
    </div>
  );
};

export default AppPage;
