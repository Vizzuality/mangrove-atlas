export const jsonToCSV = (json) => {
  if (!json.length) return [];
  const result = [Object.keys(json[0])];
  json.forEach(element => result.push(Object.values(element)));
  return result;
};

export const geoJsonToJson = geojson => geojson.features.map(feature => ({
  ...feature.properties,
  id: feature.id,
  geometry: feature.geometry
}));

export default { jsonToCSV, geoJsonToJson };
