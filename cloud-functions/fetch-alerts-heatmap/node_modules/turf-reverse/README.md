# turf-reverse

[![build status](https://secure.travis-ci.org/stepankuzmin/turf-reverse.png)](http://travis-ci.org/stepankuzmin/turf-reverse)

Revert coordinates order for `LineString`, `Polygon`, `MultiLineString` and `MultiPolygon` features.

### `turf.reverse(feature)`

Revert feature geometry coordinates order

### Parameters

| parameter           | type   | description                     |
| ------------------- | ------ | ------------------------------- |
| `feature`           | Object | GeoJSON feature                 |


### Example

```js
var reverse = require('turf-reverse');

var lineString = {
  "type": "Feature",
  "properties": {},
  "geometry": { "type": "LineString", "coordinates": [[100.0, 0.0], [101.0, 1.0]] }
}

var lineStringReverse = reverse(lineString);
//=lineStringReverse
```

**Returns** `Object`, feature with reversed coordinates

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-reverse
```

## Tests

```sh
$ npm test
```