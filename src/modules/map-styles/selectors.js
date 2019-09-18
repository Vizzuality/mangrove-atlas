import { createSelector } from 'reselect';
import { activeLayers } from 'modules/layers/selectors';
// import { rasterLayers } from './rasters';
import StyleManager from './style-manager';

const styleManager = new StyleManager();

const mapStyles = state => state.mapStyles;
const filters = createSelector([mapStyles], styles => styles.filters);
const basemap = state => state.map.basemap;

function sortLayers(layers) {
  const order = {
    'selected-wdpa-polygons copy 1': 10
  };

  return layers.sort((a, b) => {
    const aOrder = order[a.id] || 0;
    const bOrder = order[b.id] || 0;

    return aOrder - bOrder;
  });
}

export const layerStyles = createSelector(
  [mapStyles, activeLayers],
  (_mapStyles, _activeLayers) => {
    if (!_mapStyles.layers || !_mapStyles.layers.mapStyle) {
      return [];
    }

    const { layers: layersStyles } = _mapStyles.layers.mapStyle;
    const activeIds = _activeLayers.map(activeLayer => activeLayer.id);
    // const activeGroups = _activeLayers.map(activeLayer => activeLayer.mapboxGroup);

    const rasterLayer = {
      id: 'biomass',
      type: 'raster',
      source: 'biomass-tiles',
      minzoom: 0,
      maxzoom: 13
    };

    const extendedLayers = [...layersStyles, rasterLayer];
    return extendedLayers
      .filter(style => activeIds.includes(style.id));
    // .filter(style => activeGroups.includes(style.metadata['mapbox:group']));
  }
);

export const mapStyle = createSelector(
  [basemap, layerStyles, filters],
  (_basemap, _layerStyles, _filters) => {
    const coverageFilter = ({ year }) => [
      "all",
      [
        "match",
        ["get", "year"],
        [year],
        true,
        false
      ]
    ];

    const netChangeFilter = ({ startYear, endYear }) => {
      if (startYear === endYear) {
        return ["boolean", false];
      }

      const availableYears = ['1996', '2007', '2008', '2009', '2010', '2015', '2016'];

      const years = availableYears
        .filter(y => parseInt(y) >= parseInt(startYear))
        .filter(y => parseInt(y) < parseInt(endYear));

      return [
        "all",
        [
          "match",
          ["get", "start_year"],
          years,
          true,
          false
        ]
      ];
    };

    const layersWithFilters = _layerStyles.map(layerStyle => {
      let widgetFilter;

      switch (layerStyle.id) {
        case 'coverage-1996-2016':
          widgetFilter = _filters.find(f => f.id === 'coverage-1996-2016');
          if (widgetFilter) {
            layerStyle.filter = coverageFilter(widgetFilter);
          }
          break;
        case 'net-change-1996-2016':
          widgetFilter = _filters.find(f => f.id === 'net-change-1996-2016');
          if (widgetFilter) {
            layerStyle.filter = netChangeFilter(widgetFilter);
          }
          break;
        default:
      }

      return layerStyle;
    });

    styleManager.basemap = _basemap;
    styleManager.layers = layersWithFilters;
    return { ...styleManager.mapStyle, layers: sortLayers(styleManager.mapStyle.layers) };
  }
);

export default { mapStyle };
