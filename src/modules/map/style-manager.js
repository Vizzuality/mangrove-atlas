import flatten from 'lodash/flatten';
import mapStyles from './mapStyles';

class StyleManager {
  default = {
    basemap: 'light',
    layers: []
  };

  constructor(options = {}) {
    this.settings = {
      basemap: options.basemap || this.default.basemap,
      layers: options.layers || this.default.layers
    };
  }

  composeLayers() {
    const { basemap, layers: layersSpec } = this.settings;
    const basemapSpec = mapStyles.basemaps[basemap];
    const contextualsSpec = mapStyles.contextuals.map(contextual => contextual.mapStyle);
    const result = { ...mapStyles.template };

    /**
     * Add layers in the next order:
     * - basemaps
     * - contextual
     * - layers
     */
    result.layers = flatten([
      ...basemapSpec,
      ...contextualsSpec,
      ...layersSpec
    ]);

    return result;
  }

  get mapStyle() {
    return this.composeLayers();
  }

  set basemap(basemapSlug) {
    this.settings.basemap = basemapSlug;
  }

  /**
   * This method will and and remove layers depending on layersIds
   */
  set layers(layerIds) {
    const styles = mapStyles.layers.filter(layerStyle => layerIds.includes(layerStyle.id));
    if (styles.length === 0) this.settings.layers = [];
    if (styles && styles.length) this.settings.layers = styles.map(s => s.mapStyle);
  }
}

export default StyleManager;
