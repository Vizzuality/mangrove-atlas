import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';
import { NavigationControl, FullscreenControl } from 'react-map-gl';
import classnames from 'classnames';
import pick from 'lodash/pick';

// Components
import MobileLegendControl from 'components/map-legend/mobile';
import MangroveMap from 'components/map';
import BasemapSelector from 'components/basemap-selector';
import Legend from 'components/map-legend';

import { WDPA } from 'modules/locations/constants';

import styles from './style.module.scss';

export const MapContainer = ({
  viewport,
  setViewport,
  setPopup,
  removePopup,
  isCollapse,
  mapboxApiAccessToken,
  mapStyle,
  bounds,
  goToCountry,
  goToAOI,
}) => {
  const onViewportChange = (newViewport) => {
    setViewport(pick(newViewport, ['latitude', 'longitude', 'zoom', 'bearing', 'pitch']));
  };
  const resize = (newViewport) => {
    onViewportChange({
      ...newViewport,
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  useEffect(() => {
    window.addEventListener('resize', resize);
    resize();
    return function cleanup() {
      window.removeEventListener('resize', resize);
    };
    // eslint-disable-next-line
  }, []);

  /**
   * CHANGING CURSOR FOR INTERACTIVE LAYERS
   * For changing the cursor of interactive layers you need to add
   * interactive layer ids to this array and pass it as a property.
   * It is part of react-map-gl and is documented here:
   * https://uber.github.io/react-map-gl/#/Documentation/api-reference/interactive-map?section=interaction-options
   * You can provide a custom getCursor function that will overwrite
   * the one used by default, documentation is on the same page.
  */
  const requestedInteractiveLayerIds = ['selected-eez-land-v2-201410', 'selected-wdpa-polygons', 'cons-hotspots', 'restoration', 'restoration-sites'];
  const currentLayers = mapStyle.layers.map(layer => layer.id);
  const interactiveLayerIds = requestedInteractiveLayerIds.filter(id => currentLayers.includes(id));

  function popupCloseHandler() {
    removePopup();
  }

  const clickHandler = ({ event }) => {
    const { features } = event;
    const country = features?.find(feat => feat.layer.id === 'selected-eez-land-v2-201410');
    const wdpa = features?.find(feat => feat.layer.id === 'selected-wdpa-polygons');
    const hotspots = features?.find(feat => feat.layer.id === 'cons-hotspots');

    if (hotspots) {
      setPopup({
        type: 'hotspots',
        coordinates: event.lngLat.slice(),
        data: hotspots.properties
      });
      return;
    }

    popupCloseHandler();

    if (wdpa) {
      // todo: this should be done at api level
      // unify AOI ids
      // Use NAME instead of WDPA_PID because there can be different areas with the same name
      const { properties: { NAME: areaName } } = wdpa;
      const internalIdMap = new Map([
        [WDPA.DELTA_DU_SALOUM.areaName, WDPA.DELTA_DU_SALOUM.location_id],
        [WDPA.RUFIKI_MAFIA_KILWA.areaName, WDPA.RUFIKI_MAFIA_KILWA.location_id],
        [WDPA.MAFIA_ISLAND.areaName, WDPA.MAFIA_ISLAND.location_id]
      ]);

      const internalId = internalIdMap.get(areaName);
      if (internalId) {
        goToAOI({ id: internalId });
      }
    } else if (country) {
      const { properties: { iso: countryId } } = country;
      goToCountry({ iso: countryId });
    }
  };

  return (
    <div className={styles.map}>
      <MangroveMap
        viewport={viewport}
        bounds={bounds}
        mapStyle={mapStyle}
        mapboxApiAccessToken={mapboxApiAccessToken}
        onViewportChange={onViewportChange}
        onClick={clickHandler}
        interactiveLayerIds={interactiveLayerIds}
        onPopupClose={popupCloseHandler}
      >
        {() => (
          <div className={styles.navigation}>
            <MediaQuery minWidth={breakpoints.lg + 1}>
              <FullscreenControl className={styles.fullscreen} />
            </MediaQuery>
            <MediaQuery minWidth={breakpoints.sm}>
              <NavigationControl
                captureClick
                captureDoubleClick
                showCompass={true}
                className={styles.zoomControls}
                onViewportChange={onViewportChange}
              />
            </MediaQuery>
          </div>
        )
        }
      </MangroveMap>

      <div className={classnames(styles.legend,
        { [styles.expanded]: !isCollapse })}
      >
        <MediaQuery maxWidth={breakpoints.sm - 1}>
          <MobileLegendControl />
        </MediaQuery>
        <div className={styles.tooltip}>
          <Legend />
          <BasemapSelector />
        </div>
      </div>
    </div>
  );
};

MapContainer.propTypes = {
  viewport: PropTypes.shape({}),
  setViewport: PropTypes.func,
  isCollapse: PropTypes.bool.isRequired,
  mapboxApiAccessToken: PropTypes.string.isRequired,
  mapStyle: PropTypes.shape({}).isRequired,
  bounds: PropTypes.shape({}).isRequired,
  goToCountry: PropTypes.func,
  goToAOI: PropTypes.func,
  setPopup: PropTypes.func,
  removePopup: PropTypes.func
};

MapContainer.defaultProps = {
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
  setPopup: () => { },
  removePopup: () => { },
  setViewport: () => { },
  goToCountry: () => { },
  goToAOI: () => { }
};

export default MapContainer;
