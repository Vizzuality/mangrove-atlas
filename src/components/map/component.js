import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { InteractiveMap as ReactMapGL, Popup, FlyToInterpolator, TRANSITION_EVENTS } from 'react-map-gl';
import WebMercatorViewport from 'viewport-mercator-project';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import { easeCubic } from 'd3-ease';

import MapPopupHotspots from 'components/map-popup-hotspots';
import alerts from 'modules/map-styles/templates/alerts.json';
import styles from './style.module.scss';

const DEFAULT_VIEWPORT = {
  zoom: 2,
  lat: 0,
  lng: 0
};

class Map extends Component {
  events = {}

  static propTypes = {
    /** A function that returns the map instance */
    children: PropTypes.func,

    /** Custom css class for styling */
    customClass: PropTypes.string,

    /** An object that defines the viewport
     * @see https://uber.github.io/react-map-gl/#/Documentation/api-reference/interactive-map?section=initialization
    */
    viewport: PropTypes.shape({

    }),

    /** An object that defines the bounds */
    bounds: PropTypes.shape({
      bbox: PropTypes.array,
      options: PropTypes.shape({})
    }),

    /** A boolean that allows panning */
    dragPan: PropTypes.bool,
    /** A boolean that allows rotating */
    dragRotate: PropTypes.bool,
    /** A boolean that allows zooming */
    scrollZoom: PropTypes.bool,
    /** A boolean that allows zooming */
    touchZoom: PropTypes.bool,
    /** A boolean that allows touch rotating */
    touchRotate: PropTypes.bool,
    /** A boolean that allows double click zooming */
    doubleClickZoom: PropTypes.bool,
    /** A function that exposes when the map is loaded.
     * It returns and object with the `this.map`
     * and `this.mapContainer`reference. */
    onLoad: PropTypes.func,

    /** A function that exposes the viewport */
    onViewportChange: PropTypes.func,
    onClick: PropTypes.func
  }

  static defaultProps = {
    children: null,
    customClass: null,
    viewport: DEFAULT_VIEWPORT,
    bounds: {},
    dragPan: true,
    dragRotate: true,
    scrollZoom: true,
    touchZoom: true,
    touchRotate: true,
    doubleClickZoom: true,
    onViewportChange: () => {},
    onLoad: () => {},
    onClick: () => {}
  }

  state = {
    viewport: {
      ...DEFAULT_VIEWPORT,
      ...this.props.viewport // eslint-disable-line
    },
    flying: false,
    loaded: false
  }

  componentDidMount() {
    const { bounds } = this.props;

    if (!isEmpty(bounds) && !!bounds.bbox) {
      this.fitBounds();
    }
  }

  componentDidUpdate(prevProps) {
    const { viewport: prevViewport, bounds: prevBounds } = prevProps;
    const { viewport, bounds } = this.props;
    const { viewport: stateViewport } = this.state;

    if (!isEqual(viewport, prevViewport)) {
      this.setState({ // eslint-disable-line
        viewport: {
          ...stateViewport,
          ...viewport
        }
      });
    }

    if (!isEmpty(bounds) && !!bounds.bbox && !isEqual(bounds, prevBounds)) {
      this.fitBounds();
    }
  }

  onLoad = () => {
    const { onLoad } = this.props;
    onLoad({
      map: this.map,
      mapContainer: this.mapContainer
    });
    this.setState({ loaded: true });
  }

  onViewportChange = (v) => {
    const { onViewportChange } = this.props;

    this.setState({ viewport: v });
    onViewportChange(v);
  }

  onResize = (v) => {
    const { onViewportChange } = this.props;
    const { viewport } = this.state;
    const newViewport = {
      ...viewport,
      ...v
    };

    this.setState({ viewport: newViewport });
    onViewportChange(newViewport);
  }

  fitBounds = () => {
    const { viewport } = this.state;
    const { bounds, onViewportChange } = this.props;
    const { bbox, options } = bounds;

    const v = {
      ...viewport,
      width: this.mapContainer.offsetWidth,
      height: this.mapContainer.offsetHeight
    };

    const { longitude, latitude, zoom } = new WebMercatorViewport(v).fitBounds(
      [[bbox[0], bbox[1]], [bbox[2], bbox[3]]],
      options
    );

    const newViewport = {
      ...viewport,
      longitude,
      latitude,
      zoom,
      transitionDuration: 2500,
      transitionInterruption: TRANSITION_EVENTS.UPDATE
    };

    this.setState({
      flying: true,
      viewport: newViewport
    });
    onViewportChange(newViewport);

    setTimeout(() => {
      this.setState({ flying: false });
    }, 2500);
  };

  render() {
    const {
      customClass,
      children,
      dragPan,
      dragRotate,
      scrollZoom,
      touchZoom,
      touchRotate,
      doubleClickZoom,
      filters,
      mapStyle,
      onClick,
      onMouseEnter,
      onMouseLeave,
      popup,
      onPopupClose,
      ...mapboxProps
    } = this.props;
    const { viewport, loaded, flying } = this.state;
    const ms = { ...mapStyle };

    const onClickHandler = (e) => {
      onClick({
        event: e,
        map: this.map,
        mapContainer: this.mapContainer
      });
    };

    function applyFilters() {
      const alertsFilter = filters.find(f => f.id === 'alerts-style');

      if (alertsFilter) {
        const startTimestamp = (new Date(alertsFilter.startDate)).valueOf();
        const endTimestamp = (new Date(alertsFilter.endDate)).valueOf();
        const filteredAlerts = {
          ...alerts,
          features: alerts.features.filter(feat => (
            feat.properties.start_date >= startTimestamp
            && feat.properties.end_date <= endTimestamp
          ))
        };
        ms.sources.alerts = {
          type: 'geojson',
          data: filteredAlerts,
          cluster: true
        };
      }
    }

    const MapFunctions = () => {
      if (loaded && Boolean(this.map)) {
        if (typeof children === 'function') {
          return children(this.map);
        }
      }

      return null;
    };

    const PopupManager = () => (popup
      ? (
        <Popup
          longitude={popup.coordinates[0]}
          latitude={popup.coordinates[1]}
          onClose={onPopupClose}
        >
          <MapPopupHotspots {...popup.data} />
        </Popup>
      ) : null);

    applyFilters();

    return (
      <div
        ref={(r) => { this.mapContainer = r; }}
        className={classnames({
          [styles.map]: true,
          [customClass]: !!customClass
        })}
      >
        <ReactMapGL
          ref={(map) => { this.map = map && map.getMap(); }}

          // CUSTOM PROPS FROM REACT MAPBOX API
          mapStyle={ms}
          {...mapboxProps}

          // VIEWPORT
          {...viewport}
          width="100%"
          height="100%"

          // INTERACTIVE
          dragPan={!flying && dragPan}
          dragRotate={!flying && dragRotate}
          scrollZoom={!flying && scrollZoom}
          touchZoom={!flying && touchZoom}
          touchRotate={!flying && touchRotate}
          doubleClickZoom={!flying && doubleClickZoom}

          // DEFAULT FUNC IMPLEMENTATIONS
          onViewportChange={this.onViewportChange}
          onResize={this.onResize}
          onLoad={this.onLoad}
          onClick={onClickHandler}
          clickRadius={5}

          transitionInterpolator={new FlyToInterpolator()}
          transitionEasing={easeCubic}
        >
          <MapFunctions />
          <PopupManager />
        </ReactMapGL>
      </div>
    );
  }
}

export default Map;
