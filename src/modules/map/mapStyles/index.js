import template from './template.json';
import light from './basemaps/light.json';
import dark from './basemaps/dark.json';
import satellite from './basemaps/satellite.json';
import wdpa from './contextuals/wdpa.json';
import countries from './contextuals/countries.json';
// import mangrovesExtend1996 from './layers/mangroves-extend-1996.json';
import mangrovesExtend2015 from './layers/mangroves-extend-2015.json';

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
  ],
  layers: [
    {
      id: '187deb54ab1c40c1d4476f8ba3a01ba0',
      mapStyle: mangrovesExtend2015
    }
  ]
};
