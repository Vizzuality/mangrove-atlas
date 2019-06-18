export default geojson => geojson.features.map(feature => ({
  ...feature.properties,
  id: feature.id,
  geometry: feature.geometry
}));
