import { atom } from 'recoil';

export const drawingToolAtom = atom<{
  enabled: boolean;
  customGeojson: GeoJSON.FeatureCollection | null;
  uploadedGeojson: GeoJSON.FeatureCollection | null;
}>({
  key: 'drawingTool',
  default: {
    // ? this property allows to enable/disable the drawing mode in the map
    enabled: false,
    // ? this property stores a geojson geometry draw by the user
    customGeojson: null,
    // ? this property stores a geojson geometry uploaded by the user
    uploadedGeojson: null,
  },
});

export const drawingUploadToolAtom = atom<{
  enabled: boolean;
  customGeojson: GeoJSON.FeatureCollection | null;
  uploadedGeojson: GeoJSON.FeatureCollection | null;
}>({
  key: 'drawingUploadTool',
  default: {
    // ? this property allows to enable/disable the drawing mode in the map
    enabled: false,
    // ? this property stores a geojson geometry draw by the user
    customGeojson: null,
    // ? this property stores a geojson geometry uploaded by the user
    uploadedGeojson: null,
  },
});
