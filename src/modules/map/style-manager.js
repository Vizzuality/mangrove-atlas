import flatten from 'lodash/flatten';
import template from './mapStyles/template.json';
import light from './mapStyles/basemaps/light.json';
import dark from './mapStyles/basemaps/dark.json';
import satellite from './mapStyles/basemaps/satellite.json';
import wdpa from './mapStyles/contextuals/wdpa.json';
import countries from './mapStyles/contextuals/countries.json';
import mapStyles from './mapStyles';


const BASEMAPS = { light, dark, satellite };
const CONTEXTUALS = { wdpa, countries };

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
    const basemapSpec = BASEMAPS[basemap];
    const contextualsSpec = [...CONTEXTUALS.wdpa, ...CONTEXTUALS.countries];
    const result = { ...template };

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

  set layers(layerIds) {
    const styles = mapStyles.layers.filter(layerStyle => layerIds.includes(layerStyle.id));
    if (styles.length === 0) this.settings.layers = [];
    if (styles && styles.length) this.settings.layers = styles.map(s => s.mapStyle);
  }
}

export default StyleManager;
