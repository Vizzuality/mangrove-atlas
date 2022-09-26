import { createSelector } from "reselect";
import { activeLayers } from "modules/layers/selectors";
import template from "lodash/template";
import orderBy from "lodash/orderBy";
import { rasterLayers } from "./rasters.json";
import StyleManager from "./style-manager";
import {
  LAYERS_ORDER,
  sourcesAndLayers,
  layersMap,
} from "./constants";
import { mapOrder } from 'utils/sortArrayByArray.js'
import { coverageFilter, netChangeFilter } from "./filters";

const styleManager = new StyleManager();
const {  sources: bhSources,  layers: bhLayers } = sourcesAndLayers;
const mapStyles = (state) => state.mapStyles;
const filters = createSelector([mapStyles], (styles) => styles.filters);
const basemap = (state) => state.map.basemap;
const locationId = (state) =>
  state.locations.current.id || state.locations.current.iso;
const locations = (state) => state.locations.list;
const startDateAlerts = (state) => state.widgets.ui.alerts.startDate;
const endDateAlerts = (state) => state.widgets.ui.alerts.endDate;
const activeLayersIds = createSelector([activeLayers], (_activeLayers) =>
  _activeLayers.map((activeLayer) => activeLayer.id)
);

const ALERTS_URL_TEMPLATE =
  "https://us-central1-mangrove-atlas-246414.cloudfunctions.net/fetch-alerts-heatmap?{{startDate}}{{endDate}}{{locationId}}";
const getAlertsUrl = template(ALERTS_URL_TEMPLATE, {
  interpolate: /{{([\s\S]+?)}}/g,
});
const restorationSites = (state) => state.restorationSites.data

function sortLayers(layers) {
  const order = {
    "selected-wdpa-polygons copy 1": 10,
    "alerts-style": 100,
  };

  return layers.sort((a, b) => {
    const aOrder = order[a.id] || 0;
    const bOrder = order[b.id] || 0;

    return aOrder - bOrder;
  });
}

export const layerStyles = createSelector(
  [mapStyles, activeLayersIds],
  (_mapStyles, _activeLayersIds) => {
    if (!_mapStyles.layers || !_mapStyles.layers.mapStyle) {
      return [];
    }

    const { layers: layersStyles } = _mapStyles.layers.mapStyle;
    const extendedLayers = [...layersStyles, ...rasterLayers];
    return extendedLayers.filter(
      (style) =>
        _activeLayersIds.includes(style.id) ||
        (style.metadata &&
          style.metadata.mangroveGroup &&
          _activeLayersIds.includes(style.metadata.mangroveGroup))
    );
  }
);

export const mapStyle = createSelector(
  [
    basemap,
    layerStyles,
    filters,
    activeLayersIds,
    locationId,
    startDateAlerts,
    endDateAlerts,
    locations,
    restorationSites,
  ],
  (
    _basemap,
    _layerStyles,
    _filters,
    _activeLayersIds,
    _locationId,
    _startDateAlerts,
    _endDateAlerts,
    _locations,
    _restorationSites,
  ) => {
    const layersWithFilters = _layerStyles.map((layerStyle) => {
      const newLayerStyle = { ...layerStyle };
      let widgetFilter;
      switch (layerStyle.id) {
        case "coverage-1996-2016":
          widgetFilter = _filters?.find((f) => f.id === "coverage-1996-2016");
          if (widgetFilter) {
            newLayerStyle.filter = coverageFilter(widgetFilter);
          }
          break;
        case "net-change-1996-2016":
          widgetFilter = _filters?.find((f) => f.id === "net-change-1996-2016");
          if (widgetFilter) {
            newLayerStyle.filter = netChangeFilter(widgetFilter);
          }
          break;
        default:
      }

      return newLayerStyle;
    });

    styleManager.basemap = _basemap;
    styleManager.layers = layersWithFilters;

    const composedMapStyle = {
      ...styleManager.mapStyle,
      layers: sortLayers(styleManager.mapStyle.layers),
    };

    /**
     * We are patching here but the object should already be complete by now
     * Selectors are for filtering, not composing
     */
    const visibleRasterLayers = _activeLayersIds.reduce((acc, layerId) => {
      const layerMap = layersMap[layerId];
      const layerFilter = _filters.find((f) => f.id === layerId);

      if (layerFilter && layerMap) {
        if (layerFilter && layerFilter.id === "extent") {
          return [
            ...acc,
            ...layerMap
              .filter((layerMapItem) => {
                return Number(layerFilter.year) === layerMapItem.year;
              })
              .map((layerMapItem) => layerMapItem.layerId),
          ];
        }
        if (layerFilter && layerFilter.id === "net") {
          return [
            ...acc,
            ...layerMap
              .filter((layerMapItem) =>
                layerFilter.years.includes(layerMapItem.year)
              )
              .map((layerMapItem) => layerMapItem.layerId),
          ];
        }

        return [
          ...acc,
          ...layerMap
            .filter(
              (layerMapItem) =>
                parseInt(layerMapItem.year, 10) ===
                  parseInt(layerFilter.year, 10) || layerMapItem
            )
            .map((layerMapItem) => layerMapItem.layerId),
        ];
      }

      if (layerMap) {
        return [
          ...acc,
          ...layerMap.map((layerMapItem) => layerMapItem.layerId),
        ];
      }
      return acc;
    }, []);

    const bhLayersUpdated = orderBy(bhLayers, "order").map((layer) => ({
      ...layer,
      layout: {
        ...layer.layout,
        visibility: visibleRasterLayers.includes(layer.id) ? "visible" : "none",
      },
    }));

    const ordered_array = mapOrder(bhLayersUpdated, LAYERS_ORDER, "id");

    // Getting location
    let currentLocation = _locations?.find(
      (l) => l.iso === _locationId && l.location_type === "country"
    );
    if (!currentLocation) {
      currentLocation = _locations?.find((l) => l.location_id === _locationId);
    }

    // GEN ALERTS URL TEMPLATE
    if (currentLocation && currentLocation.location_type !== "worldwide") {
      bhSources.alerts.data = getAlertsUrl({
        startDate: `start_date=${_startDateAlerts?.value || "2020-01-01"}`,
        endDate: `&end_date=${_endDateAlerts?.value || "2022-12-31"}`,
        locationId: `&location_id=${_locationId}`,
      });
    } else {
      bhSources.alerts.data = getAlertsUrl({
        startDate: `start_date=${_startDateAlerts?.value || "2020-01-01"}`,
        endDate: `&end_date=${_endDateAlerts?.value || "2022-12-31"}`,
        locationId: "",
      });
    }

    const restorationSiteFeatures = _restorationSites.filter(site => !!site.site_centroid )
      .map(
        ({ site_centroid, landscape_name, organizations, site_name }) => {
        if (site_centroid) {
          return (
            {
              geometry: site_centroid,
              properties:
                {
                landscape_name,
                organizations,
                site_name
                }
            })
        }
        })
    
    // append restoration sites data
    bhSources['restoration-sites'].data = {
      type: "FeatureCollection",
      features: restorationSiteFeatures
    }

   
    composedMapStyle.sources = { ...composedMapStyle.sources, ...bhSources };
    composedMapStyle.layers = [...composedMapStyle.layers, ...ordered_array];
    return composedMapStyle;
  }
);

export default { mapStyle };
