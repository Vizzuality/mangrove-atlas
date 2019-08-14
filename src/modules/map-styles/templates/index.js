import template from './template.json';
import light from './basemaps/light.json';
import dark from './basemaps/dark.json';
import satellite from './basemaps/satellite.json';
import wdpa from './contextuals/wdpa.json';
import countries from './contextuals/countries.json';

export default {
  template,
  basemaps: {
    light,
    dark,
    satellite
  },
  contextuals: [
    { id: 'wpa', mapStyle: wdpa },
    { id: 'countries', mapStyle: countries }
  ]
};
