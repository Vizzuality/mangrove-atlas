/* eslint-disable camelcase */
import React, { Component } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

import {
  InteractiveMap as ReactMapGL,
  Popup,
  FlyToInterpolator,
  TRANSITION_EVENTS,
} from "react-map-gl";

import WebMercatorViewport from "viewport-mercator-project";

import DrawingEditor from "./drawing-tool";

import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import { easeCubic } from "d3-ease";

import PopupMangroveStyle from "./mangrove-map-styled-popup/PopupMangroveStyle";
import PopUpRestoration from "components/map-popup-restoration";
import styles from "./style.module.scss";

const DEFAULT_VIEWPORT = {
  zoom: 2,
  lat: 0,
  lng: 0,
};

class Map extends Component {
  events = {};

  static propTypes = {
    /** A function that returns the map instance */
    children: PropTypes.func,

    /** Custom css class for styling */
    customClass: PropTypes.string,

    /** An object that defines the viewport
     * @see https://uber.github.io/react-map-gl/#/Documentation/api-reference/interactive-map?section=initialization
     */
    viewport: PropTypes.shape({}),

    /** An object that defines the bounds */
    bounds: PropTypes.shape({
      bbox: PropTypes.array,
      options: PropTypes.shape({}),
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
    onClick: PropTypes.func,
  };

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
    onClick: () => {},
  };

  state = {
    viewport: {
      ...DEFAULT_VIEWPORT,
      ...this.props.viewport, // eslint-disable-line
    },
    flying: false,
    loaded: false,
    popup: [],
    modeId: null,
    modeHandler: null,
    popUpPosition: {},
    popupFeatureType: undefined,
  };

  componentDidMount() {
    const { bounds } = this.props;

    if (!isEmpty(bounds) && !!bounds.bbox) {
      this.fitBounds();
    }
  }

  // eslint-disable-next-line camelcase
  // eslint-disable-next-line react/sort-comp
  componentDidUpdate(prevProps) {
    const { viewport: prevViewport, bounds: prevBounds } = prevProps;
    const { viewport, bounds } = this.props;
    const { viewport: stateViewport } = this.state;

    if (!isEqual(viewport, prevViewport)) {
      this.setState({
        // eslint-disable-line
        viewport: {
          ...stateViewport,
          ...viewport,
        },
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
      mapContainer: this.mapContainer,
    });
    this.setState({ loaded: true });
  };

  onViewportChange = (v) => {
    const { onViewportChange } = this.props;

    this.setState({ viewport: v });
    onViewportChange(v);
  };

  onZoomChange = (newViewport) => {
    const { onViewportChange } = this.props;
    this.setState({ viewport: newViewport });
    onViewportChange(newViewport);
  };

  onResize = (v) => {
    const { onViewportChange } = this.props;
    const { viewport } = this.state;
    const newViewport = {
      ...viewport,
      ...v,
    };

    this.setState({ viewport: newViewport });
    onViewportChange(newViewport);
  };

  fitBounds = () => {
    const { viewport } = this.state;
    const { bounds, onViewportChange } = this.props;
    const { bbox, options } = bounds;

    const v = {
      ...viewport,
      width: this.mapContainer.offsetWidth,
      height: this.mapContainer.offsetHeight,
    };

    const { longitude, latitude, zoom } = new WebMercatorViewport(v).fitBounds(
      [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]],
      ],
      options
    );

    const newViewport = {
      ...viewport,
      longitude,
      latitude,
      zoom,
      transitionDuration: 2500,
      transitionInterruption: TRANSITION_EVENTS.UPDATE,
    };

    this.setState({
      flying: true,
      viewport: newViewport,
    });
    onViewportChange(newViewport);

    setTimeout(() => {
      this.setState({ flying: false });
    }, 2500);
  };

  setRestorationSitePopUpState = (event) => {
    const siteFromEvent = event.features[0]
      const { organizations } = siteFromEvent.properties     
      
      const propertiesWithOrganizationNamesParsed =
      {
        ...siteFromEvent.properties,
        organizations: organizations ? JSON.parse(organizations) : []
      
      }
    
      this.setState({
        ...this.state,
        popup: [event?.lngLat[0], event?.lngLat[1]],
        popupInfo: propertiesWithOrganizationNamesParsed,
        popupFeatureType: 'restoration-sites'
      });        
  }

  expandMarkerCluster = ({ event, clusterLayerId, sourceId }) => {
    const clusterFeatures = this.map.queryRenderedFeatures(event.point, {
      layers: [clusterLayerId]
    });
    const clusterClicked = clusterFeatures[0]
    const clusterId = clusterClicked.properties.cluster_id;
    this.map.getSource(sourceId).getClusterExpansionZoom(
      clusterId,
      (error, zoom) => {
        if (error) {
          return;
        }
        this.map.easeTo({
          center: clusterClicked.geometry.coordinates,
          zoom
        });
      }
    );
  }

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
      onViewportChange,
      onZoomChange,
      onPopupClose,
      drawingMode,
      ...mapboxProps
    } = this.props;

    const { loaded, flying, viewport } = this.state;
    const ms = { ...mapStyle };
    let hoveredStateId = null;
    const onClickHandler = (e) => {

      const getFeatureLayerById = (layerId) => e.features?.find(
        ({ layer }) => layer.id === layerId
      );

     const isClickFromRestorationSite = getFeatureLayerById('restoration-sites')
     const isClickFromRestorationSiteCluster = getFeatureLayerById('restoration-sites-clusters')

      if (isClickFromRestorationSite) {
        // This layer is different from the existing 'restoration' layer and refers to
        // restoration sites where restoration is happening. 
        // These sites are collected as part of the Mangrove Restoration Tracking Took (MRTT)
        // project whose code lives here:  https://github.com/globalmangrovewatch/gmw-users/tree/develop/mrtt-ui
        this.setRestorationSitePopUpState(e)        
      }

      if (isClickFromRestorationSiteCluster) {
        this.expandMarkerCluster({
          event: e,
          clusterLayerId: 'restoration-sites-clusters',
          sourceId: 'restoration-sites'
        })
      }

      const restorationData = e?.features.find(
        ({ layer }) => layer.id === "restoration"
      )?.properties;

      if (restorationData) {
        this.setState({
          ...this.state,
          popup: [e?.lngLat[0], e?.lngLat[1]],
          popupInfo: restorationData,
          popUpPosition: {
            x: e.center.x,
            y: e.center.y,
          },
          popupFeatureType: 'restoration' 

        });
      }
      onClick({
        event: e,
        map: this.map,
        mapContainer: this.mapContainer,
      });
    };

    const MapFunctions = () => {
      if (loaded && Boolean(this.map)) {
        if (typeof children === "function") {
          return children(this.map);
        }
      }

      return null;
    };

    const removePopUp = () => {
      this.setState({
        popup: [],
      });
    };

    const PopupRestoration = () => {
      const {
        popUpPosition: { x, y },
      } = this.state;
      const popUpWidth = 440;
      const sidebarWidth = 630;
      const anchor = () => {
        if (x < sidebarWidth + popUpWidth) return "left";
        else if (y - popUpWidth < 0) return "top";
        else if (x - popUpWidth > popUpWidth) return "right";
        else return "bottom";
      };
      return (
        <Popup
          anchor={anchor()}
          longitude={this.state.popup[0] || null}
          latitude={this.state.popup[1] || null}
          onClose={removePopUp}
        >
          <div className={styles.popup}>
            {<PopUpRestoration data={this.state.popupInfo} />}
          </div>
        </Popup>
      );
    };

    const popupRestorationSites =
      <PopupMangroveStyle
          removePopUp={removePopUp}
          longitude={this.state.popup[0]}
          latitude={this.state.popup[1]}>
        <h2>{this.state.popupInfo?.site_name}</h2>
        <dl>
          <dt>Landscape</dt>
          <dd>{this.state.popupInfo?.landscape_name}</dd>
          <dt>Organizations</dt>
          {
            this.state.popupInfo?.organizations.map(
              organization => <dd key={organization.id}>{organization.organization_name}</dd>
            )
          }
        </dl>
      </PopupMangroveStyle>
    
    const shouldShowPopup = !!this.state.popup.length && !isEmpty(this.state.popupInfo)
    const popupContent = this.state.popupFeatureType === 'restoration-sites'
      ? popupRestorationSites
      : <PopupRestoration data={this.state.popupInfo} />
  
    // applyFilters();
    const onHover = (e) => {
      const restorationData = e?.features.find(
        ({ layer }) => layer.id === "restoration"
      );
      hoveredStateId = restorationData?.id;
      if (hoveredStateId !== null && restorationData) {
        this.map.setFeatureState(
          {
            sourceLayer: "MOW_Global_Mangrove_Restoration",
            source: "restoration",
            id: hoveredStateId,
          },
          { hover: false }
        );
      }

      if (hoveredStateId !== null && !restorationData) {
        this.map.setFeatureState(
          {
            sourceLayer: "MOW_Global_Mangrove_Restoration",
            source: "restoration",
            id: hoveredStateId,
          },
          { hover: true }
        );
      }
    };

    return (
      <div
        ref={(r) => {
          this.mapContainer = r;
        }}
        className={classnames(styles.map, {
          [customClass]: !!customClass,
        })}
      >
        <ReactMapGL
          ref={(map) => (this.map = map && map.getMap())}
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
          onHover={onHover}
          transitionInterpolator={new FlyToInterpolator()}
          transitionEasing={easeCubic}
        >
          {drawingMode && <DrawingEditor />}
          <MapFunctions />
          {shouldShowPopup ? popupContent : null}
        </ReactMapGL>
      </div>
    );
  }
}

export default Map;
