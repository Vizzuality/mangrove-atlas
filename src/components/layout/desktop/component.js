import React from 'react';
import Widgets from 'components/widgets';
import Map from 'components/map-container';
import Sidebar from 'components/sidebar';
import logo from 'components/layout/mangrove-logo.svg';
import styles from '../style.module.scss';

const DesktopLayout = () => (
  <div>
    <div className={styles.header}>
      <img className={styles.logo} src={logo} alt="mangrove-atlas-logo" />
    </div>
    <div className={styles.printOnly_wrapper}>
      <Sidebar>
        {({ isSticky }) => (
          <>
            <Widgets isSticky={isSticky} />
          </>
        )}
      </Sidebar>
      <div className={styles.vis}>
        <Map />
        <p className={styles.printOnly}>Generate your report in https://mangrove-atlas.org</p>
      </div>
    </div>
  </div>
);

export default DesktopLayout;
