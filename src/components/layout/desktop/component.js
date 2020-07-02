import React from 'react';
import Widgets from 'components/widgets';
import Map from 'components/map-container';
import Sidebar from 'components/sidebar';
import NavMenu from 'components/nav-menu';
import logo from 'components/layout/logo-bg.svg';
import styles from '../style.module.scss';

const DesktopLayout = ({ location }) => {
  let stylesOverride = { fontSize: 60, lineHeight: 0.85 };
  if ((location && location.name.length > 10)) {
    stylesOverride = { fontSize: 45, lineHeight: 1 };
  }
  if ((location && location.name.length > 30)) {
    stylesOverride = { fontSize: 30, lineHeight: 1 };
  }

  return (
    <div>
      <div className={styles.header}>
        <NavMenu />
        <img className={styles.logo} src={logo} alt="mangrove-atlas-logo" />
        {location && (
          <h1
            className={styles.title}
            style={stylesOverride}
          >
            {location.name}
          </h1>

        )}
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
};

export default DesktopLayout;
