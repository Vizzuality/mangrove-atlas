import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';
import { NavigationControl } from 'react-map-gl';
import classnames from 'classnames';
// Components
import MobileLegendControl from 'components/map-legend/mobile';
import MapGl from 'components/map';
import BasemapSelector from 'components/basemap-selector';
import Legend from 'components/map-legend';

import styles from './style.module.scss';

class MapContainer extends PureComponent {
  static propTypes = {
    viewport: PropTypes.shape({}),
    setViewport: PropTypes.func,
    isCollapse: PropTypes.bool.isRequired,
    mapboxApiAccessToken: PropTypes.string.isRequired,
    mapStyle: PropTypes.shape({}).isRequired,
    bounds: PropTypes.shape({}).isRequired
  }

  static defaultProps = {
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      longitude: 0,
      latitude: 0,
      zoom: 2,
      maxZoom: 16,
      bearing: 0,
      pitch: 0
    },
    setViewport: () => { }
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  onViewportChange = (viewport) => {
    const { setViewport } = this.props;
    setViewport(viewport);
  }

  resize = () => {
    const { viewport } = this.props;
    this.onViewportChange({
      ...viewport,
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  render() {
    const {
      mapboxApiAccessToken,
      mapStyle,
      viewport,
      bounds,
      isCollapse
    } = this.props;

    return (
      <div className={styles.map}>
        <MapGl
          viewport={viewport}
          bounds={bounds}
          mapStyle={mapStyle}
          mapboxApiAccessToken={mapboxApiAccessToken}
          onViewportChange={this.onViewportChange}
        >
          {() => (
            <div className={styles.navigation}>
              <MediaQuery minWidth={breakpoints.md}>
                <NavigationControl />
              </MediaQuery>
            </div>
          )
          }
        </MapGl>

        <div className={classnames(styles.legend,
          { [styles.expanded]: !isCollapse })}
        >
          <MediaQuery maxWidth={breakpoints.md - 1}>
            <MobileLegendControl />
          </MediaQuery>
          <div className={styles.tooltip}>
            <Legend />
            <BasemapSelector />
          </div>
        </div>
      </div>
    );
  }
}

export default MapContainer;
