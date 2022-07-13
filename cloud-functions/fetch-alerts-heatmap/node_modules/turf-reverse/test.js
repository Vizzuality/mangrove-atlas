var test = require('tape');
var reverse = require('./');

var point = {
  "type": "Feature",
  "properties": {},
  "geometry": { "type": "Point", "coordinates": [100.0, 0.0] }
}

var lineString = {
  "type": "Feature",
  "properties": {},
  "geometry": { "type": "LineString", "coordinates": [[100.0, 0.0], [101.0, 1.0]] }
}

var lineStringReverse = {
  "type": "Feature",
  "properties": {},
  "geometry": { "type": "LineString", "coordinates": [[101.0, 1.0], [100.0, 0.0]] }
}

var multiLineString = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "MultiLineString",
    "coordinates": [
      [ [100.0, 0.0], [101.0, 1.0] ],
      [ [102.0, 2.0], [103.0, 3.0] ]
    ]
  }
}

var multiLineStringReverse = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "MultiLineString",
    "coordinates": [
      [ [101.0, 1.0], [100.0, 0.0] ],
      [ [103.0, 3.0], [102.0, 2.0] ]
    ]
  }
}

var polygon = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
      [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ] ]
   }
}

var polygonReverse = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [ [100.0, 0.0], [100.0, 1.0], [101.0, 1.0], [101.0, 0.0], [100.0, 0.0] ],
      [ [100.2, 0.2], [100.2, 0.8], [100.8, 0.8], [100.8, 0.2], [100.2, 0.2] ] ]
   }
}

var multiPolygon = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "MultiPolygon",
    "coordinates": [
      [[[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]],
      [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
       [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
      ]
  }
}

var multiPolygonReverse = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "MultiPolygon",
    "coordinates": [
      [[[102.0, 2.0], [102.0, 3.0], [103.0, 3.0], [103.0, 2.0], [102.0, 2.0]]],
      [[[100.0, 0.0], [100.0, 1.0], [101.0, 1.0], [101.0, 0.0], [100.0, 0.0]],
       [[100.2, 0.2], [100.2, 0.8], [100.8, 0.8], [100.8, 0.2], [100.2, 0.2]]]
      ]
  }
}

test('turf-reverse', function (t) {
  var lineStringClone = JSON.parse(JSON.stringify(lineString));
  var multiLineStringClone = JSON.parse(JSON.stringify(multiLineString));
  var polygonClone = JSON.parse(JSON.stringify(polygon));
  var multiPolygonClone = JSON.parse(JSON.stringify(multiPolygon));

  t.deepEqual(reverse(lineStringClone), lineStringReverse);
  t.deepEqual(lineString, lineStringClone);

  t.deepEqual(reverse(multiLineStringClone), multiLineStringReverse);
  t.deepEqual(multiLineString, multiLineStringClone);

  t.deepEqual(reverse(polygonClone), polygonReverse);
  t.deepEqual(polygon, polygonClone);

  t.deepEqual(reverse(multiPolygonClone), multiPolygonReverse);
  t.deepEqual(multiPolygon, multiPolygonClone);

  t.throws(function() {
    reverse(point);
  });

	t.end();
});