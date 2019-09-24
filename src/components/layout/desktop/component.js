import React from 'react';
import Widgets from 'components/widgets';
import Map from 'components/map-container';
import Sidebar from 'components/sidebar';
import styles from '../style.module.scss';

const DesktopLayout = () => (
  <div>
    <Sidebar>
      <Widgets />
      <p className={styles.printOnly}>Generate your report in https://mangrove-atlas.org</p>
    </Sidebar>
    <div className={styles.vis}>
      <Map />
    </div>
  </div>
);

export default DesktopLayout;
