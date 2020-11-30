import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import Widgets from 'components/widgets';
import Sidebar from 'components/sidebar';
import NavMenu from 'components/nav-menu';
import Map from 'components/map-container';
import ViewSelector from 'components/view-selector';
import logo from 'components/layout/logo-bg.svg';
import styles from '../style.module.scss';

class MobileLayout extends PureComponent {
  static propTypes = {
    mapView: PropTypes.bool.isRequired
  }

  render() {
    const { mapView } = this.props;
    return (
      <div>
        {!mapView && (
          <>
            <NavMenu />
            <Link to={{ type: 'PAGE/APP' }}>
              <img className={styles.logo} src={logo} alt="mangrove-atlas-logo" />
            </Link>
            <Sidebar>
              {({ isSticky }) => (
                <>
                  <Widgets isSticky={isSticky} />
                </>
              )}
            </Sidebar>
          </>
        )}
        {mapView && (
          <div className={styles.vis}>
            <Map />
            <p className={styles.printOnly}>Generate your report at https://www.globalmangrovewatch.org</p>
          </div>)}
        <ViewSelector />
      </div>
    );
  }
}

export default MobileLayout;
