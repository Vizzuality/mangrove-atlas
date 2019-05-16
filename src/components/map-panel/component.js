import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Map from 'components/map';

// Styles
import './styles.scss';

class MapPanel extends Component {
  static propTypes = {
    viewport: PropTypes.shape().isRequired,
    bounds: PropTypes.shape(),
    mapStyle: PropTypes.string.isRequired,
    setMapViewport: PropTypes.func.isRequired,
  }

  static defaultProps = {
    bounds: {}
  }

  onViewportChange = viewport => {
    const { setMapViewport } = this.props;
    setMapViewport(viewport);
  }

  onZoomChange = (zoom) => {
    const { setMapViewport } = this.props;

    setMapViewport({
      zoom,
      transitionDuration: 250
    });
  }

  onRecenterChange = () => {
    const { bounds, setMapBounds } = this.props;

    setMapBounds(null);

    requestAnimationFrame(() => {
      setMapBounds(bounds);
    })
  }

  onStyleLoad = () => {}

  onLoad = ({ map }) => {
    this.map = map;

    // Listeners
    this.map.on('style.load', this.onStyleLoad);
  }

  onClick = e => {}

  onHover = e => {}

  setLabels = () => {}

  setRoads = () => {}

  render() {
    const { mapStyle, viewport, bounds } = this.props;

    return (
      <div className="c-map-wrapper">
        <Map
          mapStyle={mapStyle}
          viewport={viewport}
          bounds={bounds}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          onViewportChange={this.onViewportChange}
          onClick={this.onClick}
          onHover={this.onHover}
          onLoad={this.onLoad}
        />
      </div>
    )
  }
}

export default MapPanel;
