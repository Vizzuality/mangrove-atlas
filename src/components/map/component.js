import React, { Component } from 'react';
import MapGL, { NavigationControl } from 'react-map-gl';
import PropTypes from 'prop-types';
import BasemapSelector from 'components/basemap-selector';
import Legend from 'components/map-legend';
import styles from './style.module.scss';

class Map extends Component {
  static propTypes = {
    basemap: PropTypes.string,
    viewport: PropTypes.shape({}),
    setViewport: PropTypes.func
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
    setViewport: () => {}
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  onViewportChange = (nextViewport) => {
    const { viewport, setViewport } = this.props;

    setViewport({ ...viewport, ...nextViewport });
  }

  resize = () => {
    this.onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  render() {
    const {
      mapboxApiAccessToken,
      mapStyle,
      viewport
    } = this.props;

    return (
      <MapGL
        className={styles.map}
        ref={this.setElement}
        {...viewport}
        mapStyle={mapStyle}
        width="100%"
        height="100%"
        mapboxApiAccessToken={mapboxApiAccessToken}
        onViewportChange={this.onViewportChange}
      >
        <div className={styles.navigation}>
          <NavigationControl />
        </div>
        <div className={styles.legend}>
          <Legend />
          <BasemapSelector />
        </div>
      </MapGL>
    );
  }
}

export default Map;
