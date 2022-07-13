var availableTypes = ['LineString', 'Polygon', 'MultiLineString', 'MultiPolygon'];

/**
 * Revert coordinates order for `LineString`, `Polygon`, `MultiLineString` and `MultiPolygon` features.
 *
 * @name reverse
 * @param {Feature<(LineString|Polygon|MultiLineString|MultiPolygon)>} feature input feature
 * @return {Feature<(LineString|Polygon|MultiLineString|MultiPolygon)>} feature with reversed coordinates order
 * @example
 * var lineString = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": { "type": "LineString", "coordinates": [[100.0, 0.0], [101.0, 1.0]] }
 * }
 * var lineStringReverse = reverse(lineString);
 * //=lineStringReverse
 */
function reverse(feature) {
  var featureClone = JSON.parse(JSON.stringify(feature));
  var geometry = featureClone.geometry;
  var newCoordinates;
  if (availableTypes.indexOf(geometry.type) === -1) {
    throw new Error('Unsupported feature geometry type, input must be a one of: ' +
      availableTypes.join(', '));
  }

  if (geometry.type === 'LineString') {
    featureClone.geometry.coordinates = geometry.coordinates.slice().reverse()
  } else if (geometry.type === 'Polygon' || geometry.type === 'MultiLineString') {
    featureClone.geometry.coordinates = geometry.coordinates.map(function(coordinates) {
      return coordinates.slice().reverse();
    });
  } else if (geometry.type === 'MultiPolygon') {
    featureClone.geometry.coordinates = geometry.coordinates.map(function(coordinates) {
      return coordinates.map(function(nestedCoordinates) {
        return nestedCoordinates.slice().reverse();
      });
    });
  }

  return featureClone;
}

module.exports = reverse;