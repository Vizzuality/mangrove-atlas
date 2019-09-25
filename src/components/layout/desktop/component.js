import React from 'react';
import Widgets from 'components/widgets';
import Map from 'components/map-container';
import Sidebar from 'components/sidebar';
import styles from '../style.module.scss';

const DesktopLayout = () => (
  <div>
    <Sidebar>
      {({ isSticky }) => <Widgets isSticky={isSticky} />}
    </Sidebar>
    <div className={styles.vis}>
      <Map />
    </div>
  </div>
);

export default DesktopLayout;
