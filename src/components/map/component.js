import React, { Component } from 'react';
import MapGL, { FlyToInterpolator } from 'react-map-gl';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import styles from './style.module.scss';

class Map extends Component {
  static propTypes = {
    viewport: PropTypes.shape({}),
    setMapViewport: PropTypes.func
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
    setMapViewport: () => {}
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  onViewportChange = (nextViewport) => {
    const { viewport, setMapViewport } = this.props;

    setMapViewport({ ...viewport, ...nextViewport });
  }

  resize = () => {
    this.onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  render() {
    const {
      mapStyle,
      mapboxApiAccessToken,
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
        {/* {isLoaded && !!this.map && typeof children === 'function' && children(this.map)} */}
      </MapGL>
    );
  }
}

export default Map;
