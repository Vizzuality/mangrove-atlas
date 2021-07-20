import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Link from 'redux-first-router-link';
import { breakpoints } from 'utils/responsive';

import logo from 'components/layout/logo.svg';

// components
import DesktopLayout from './desktop';
import MobileLayout from './mobile';

import FooterMenu from 'components/bar-menu/footer-menu/component';
import Map from 'components/map-container';
import styles from './style.module.scss';

const Layout = ({ mapView }) => {
  const isMobile = window.innerWidth < breakpoints.lg;
  return (
    <div className={cx([styles.printOnly_wrapper], [styles.sidebar])}>
      <Link to={{ type: 'PAGE/APP' }}>
        <img className={styles.logo} src={logo} alt="mangrove-atlas" />
      </Link>
      {!isMobile && <DesktopLayout />}
      {isMobile && <MobileLayout />}
      {isMobile && <FooterMenu />}
      {mapView && (
        <div className={styles.vis}>
          <Map />
          <p className={styles.printOnly}>Generate your report at https://www.globalmangrovewatch.org</p>
        </div>)}
    </div>
  );
};

MobileLayout.propTypes = {
  mapView: PropTypes.bool.isRequired,
}

export default Layout;
