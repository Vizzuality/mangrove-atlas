import React, { Component } from 'react';
import ReactMapGL, { FlyToInterpolator } from 'react-map-gl';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

import 'mapbox-gl/dist/mapbox-gl.css';

class Map extends Component {
  static propTypes = {
    children: PropTypes.func,
    viewport: PropTypes.shape({}),
    bounds: PropTypes.shape({
      bbox: PropTypes.array,
      options: PropTypes.shape({})
    }),
    dragPan: PropTypes.bool,
    dragRotate: PropTypes.bool, // A boolean that allows rotating
    setMapViewport: PropTypes.func,
    onViewportChange: PropTypes.func,
    onLoad: PropTypes.func,
    onStyleLoad: PropTypes.func
  }

  static defaultProps = {
    children: null,
    viewport: { zoom: 2, lat: 0, lng: 0 },
    bounds: {},
    dragPan: true,
    dragRotate: true,
    onViewportChange: () => {},
    onLoad: () => {},
    onStyleLoad: () => {},
    setMapViewport: () => {}
  }

  componentDidMount() {
    const { bounds } = this.props;

    if (!isEmpty(bounds) && !!bounds.bbox) {
      this.fitBounds();
    }
  }

  componentDidUpdate(prevProps) {
    const { bounds: prevBounds } = prevProps;
    const { bounds } = this.props;

    if (!isEmpty(bounds) && !isEqual(bounds, prevBounds)) {
      this.fitBounds();
    }
  }

  setElement = (map) => {
    this.map = map && map.getMap();
  }

  onLoad = () => {
    const { onLoad, setMapLoaded, onStyleLoad } = this.props;
    setMapLoaded(true);

    this.map.on('style.load', onStyleLoad);

    onLoad({
      map: this.map
    });
  }

  onResize = (resizeViewport) => {
    const { viewport } = this.props;
    this.onViewportChange({
      ...viewport,
      ...resizeViewport
    });
  }

  onMoveEnd = () => {
    const { viewport, setMapFlying } = this.props;

    if (this.map) {
      const bearing = this.map.getBearing();
      const pitch = this.map.getPitch();
      const zoom = this.map.getZoom();
      const { lng, lat } = this.map.getCenter();

      const newViewport = {
        ...viewport,
        bearing,
        pitch,
        zoom,
        latitude: lat,
        longitude: lng
      };

      setMapFlying(false);
      this.onViewportChange(newViewport);
    }
  }

  onViewportChange = (viewport) => {
    const { setMapViewport, onViewportChange } = this.props;

    setMapViewport(viewport);
    onViewportChange(viewport);
  }

  fitBounds = () => {
    const { bounds, settings: { isFlying }, setMapFlying } = this.props;
    const { bbox, options } = bounds;

    if (isFlying) {
      this.map.off('moveend', this.onMoveEnd);
    }

    setMapFlying(true);

    requestAnimationFrame(() => {
      this.map.fitBounds(
        [[bbox[0], bbox[1]], [bbox[2], bbox[3]]],
        options
      );

      this.map.once('moveend', this.onMoveEnd);
    });
  };

  render() {
    const {
      className,
      width,
      height,
      viewport,
      settings: { isFlying, isLoaded },
      children,
      dragPan,
      dragRotate,
      ...mapboxProps
    } = this.props;

    const mapProps = {
      ...mapboxProps,
      ...viewport,
      height: height || viewport.height,
      width: width || viewport.width,
      dragPan: dragPan && !isFlying,
      dragRotate: dragRotate && !isFlying,
      transitionInterpolator: new FlyToInterpolator(),
      onLoad: this.onLoad,
      onResize: this.onResize,
      onViewportChange: this.onViewportChange
    };

    return (
      <ReactMapGL className={className} ref={this.setElement} {...mapProps}>
        {isLoaded && !!this.map && typeof children === 'function' && children(this.map)}
      </ReactMapGL>
    );
  }
}

export default Map;
