import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Link from 'redux-first-router-link';
import { breakpoints } from 'utils/responsive';

// components
import DesktopLayout from './desktop';
import MobileLayout from './mobile';

import FooterMenu from 'components/bar-menu/footer-menu/component';
import Map from 'components/map-container';
import styles from './style.module.scss';

const Layout = ({ mapView, location }) => {
  const isMobile = window.innerWidth < breakpoints.lg;

  return (
    <div className={cx([styles.printOnly_wrapper])}>
      <Link to={{ type: 'PAGE/APP' }}>
        <img className={styles.logo} src={'/logo.svg'} alt="mangrove-atlas" />
      </Link>
      {!isMobile && <DesktopLayout />}
      {isMobile && <MobileLayout />}
      {isMobile && <FooterMenu />}
      {(mapView || !isMobile) && (
        <div className={cx(styles.vis, { [styles.mobileView]: mapView && isMobile })}>

          <h1 className={cx(styles.printOnly,
            {
              [styles._short]: location?.name.length < 10,
              [styles._medium]: location?.name.length > 10
            })}>
              {location?.name}
          </h1>

          <p className={styles.printOnly}>Powered by Global Mangrove Watch. https://www.globalmangrovewatch.org</p>
          <Map />
        </div>)}
    </div>
  );
};

MobileLayout.propTypes = {
  mapView: PropTypes.bool.isRequired,
}

export default Layout;
