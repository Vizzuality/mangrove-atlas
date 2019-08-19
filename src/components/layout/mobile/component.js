import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Widgets from 'components/widgets';
import Sidebar from 'components/sidebar';
import Map from 'components/map-container';
import ViewSelector from 'components/view-selector';
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
          <Sidebar>
            <Widgets />
          </Sidebar>
        )}
        {mapView && (
          <div className={styles.vis}>
            <Map />
          </div>)}
        <ViewSelector />
      </div>
    );
  }
}

export default MobileLayout;
