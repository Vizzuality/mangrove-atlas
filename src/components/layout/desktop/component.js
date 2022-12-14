import React from "react";
import PropTypes from 'prop-types';

// components
import HeaderDesktop from "components/header/desktop";
import Widgets from "components/widgets";
import MangroveDrawingTool from "widget-components/mangrove-drawing-tool";

import SidebarMenu from "components/bar-menu/sidebar-menu";

import styles from "./style.module.scss";

const DesktopLayout = ({ drawingMode }) => (
  <div className={styles.printOnly_wrapper}>
    <div className={styles.dashboards}>
      <HeaderDesktop />
      {drawingMode ? (
        <div className={styles.widgetWrapper}>
          <MangroveDrawingTool />
        </div>
      ) : (
        <Widgets />
      )}
      <p className={styles.printOnly}>
        Generate your report at https://www.globalmangrovewatch.org
      </p>
    </div>
    <SidebarMenu />
  </div>
);

DesktopLayout.propTypes = {
  drawingMode: PropTypes.bool,
};

DesktopLayout.defaultProps = {
  drawingMode: false,
};

export default DesktopLayout;
