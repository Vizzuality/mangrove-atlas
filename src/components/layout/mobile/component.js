import React from 'react';

// components
import Header from 'components/header/mobile';
import Widgets from 'components/widgets';

import styles from './style.module.scss';

const MobileLayout = () => (
  <div className={styles.printOnly_wrapper}>
    <div className={styles.dashboards}>
      <Header />
      <Widgets />
      <p className={styles.printOnly}>Generate your report at https://www.globalmangrovewatch.org</p>
    </div>
  </div>
);

export default MobileLayout;
