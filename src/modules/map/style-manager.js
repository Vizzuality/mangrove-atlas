import template from './mapStyles/template.json';
import light from './mapStyles/basemaps/light.json';
import dark from './mapStyles/basemaps/dark.json';
import satellite from './mapStyles/basemaps/satellite.json';
import wdpa from './mapStyles/contextuals/wdpa.json';
import countries from './mapStyles/contextuals/countries.json';

const BASEMAPS = { light, dark, satellite };
const CONTEXTUALS = { wdpa, countries };

class StyleManager {
  default = {
    basemap: 'light'
  };

  constructor(options = {}) {
    this.settings = {
      basemap: options.basemap || this.default
    };
  }

  composeLayers() {
    const { basemap } = this.settings;
    const basemapSpec = BASEMAPS[basemap];
    const contextualsSpec = [...CONTEXTUALS.wdpa, ...CONTEXTUALS.countries];
    const result = { ...template };

    /**
     * Add layers in the next order:
     * - basemaps
     * - contextual
     * - layers
     */
    result.layers = [
      ...basemapSpec,
      ...contextualsSpec
    ];

    return result;
  }

  get mapStyle() {
    return this.composeLayers();
  }

  set basemap(basemapSlug) {
    this.settings.basemap = basemapSlug;
  }
}

export default StyleManager;
