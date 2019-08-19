import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import MobileLegendControl from 'components/map-legend/mobile';
import classnames from 'classnames';
import { breakpoints } from 'utils/responsive';

import MapGl from 'components/map-2';
import { NavigationControl } from 'react-map-gl';
import BasemapSelector from 'components/basemap-selector';
import Legend from 'components/map-legend';
import styles from './style.module.scss';

class Map extends PureComponent {
  static propTypes = {
    basemap: PropTypes.string,
    viewport: PropTypes.shape({}),
    setViewport: PropTypes.func,
    isCollapse: PropTypes.bool.isRequired
  }

  static defaultProps = {
    basemap: 'light',
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

          // width="100%"
          // height="100%"
          mapboxApiAccessToken={mapboxApiAccessToken}
          onViewportChange={this.onViewportChange}
        >
          {() => {
            return (
              <div className={styles.navigation}>
                <MediaQuery minWidth={breakpoints.md}>
                  <NavigationControl />
                </MediaQuery>
              </div>
            )
          }}
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
      // <MapGL
      //   className={styles.map}
      //   ref={this.setElement}
      //   {...viewport}
      //   mapStyle={mapStyle}
      //   width="100%"
      //   height="100%"
      //   mapboxApiAccessToken={mapboxApiAccessToken}
      //   onViewportChange={this.onViewportChange}
      // >

    );
  }
}

export default Map;
