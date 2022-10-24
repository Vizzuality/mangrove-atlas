import React from 'react';

// components
import Header from 'components/header/mobile';
import Widgets from 'components/widgets';

import MangroveDrawingTool from "widget-components/mangrove-drawing-tool";


import styles from './style.module.scss';

const MobileLayout = ({ drawingMode }) => (
  <div className={styles.printOnly_wrapper}>
    <div className={styles.dashboards}>
      <Header />
      {drawingMode ? (
        <div className={styles.widgetWrapper}>
          <MangroveDrawingTool mobile />
        </div>
      ) : (
      <Widgets mobile />
      )}
      <p className={styles.printOnly}>Generate your report at https://www.globalmangrovewatch.org</p>
    </div>
  </div>
);

export default MobileLayout;
