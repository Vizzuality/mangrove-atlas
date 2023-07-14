const { BigQuery } = require('@google-cloud/bigquery');
const axios = require('axios').default;
const http = require('http');
const https = require('https');
const Pbf = require('pbf');

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const bigquery = new BigQuery();
const cache = {};

const tile2lon = (x, z) => {
  return (x / Math.pow(2, z)) * 360 - 180;
};

const tile2lat = (y, z) => {
  const r2d = 180 / Math.PI;
  const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z);
  return r2d * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
};

const tileToBBOX = (tile) => {
  const [x, y, z] = tile;
  const w = tile2lon(x, z);
  const s = tile2lat(y + 1, z);
  const e = tile2lon(x + 1, z);
  const n = tile2lat(y, z);
  return [w, s, e, n];
};

const transformPoint = (x, y, extent, z2, tx, ty) => {
  return [Math.round(extent * (x * z2 - tx)), Math.round(extent * (y * z2 - ty))];
};

const makeTileQuery = (startDate, endDate, bBox) => {
  const [minX, minY, maxX, maxY] = bBox;
  const query = `
      SELECT id, longitude, latitude, scr5_obs_date
      FROM deforestation_alerts.alerts
      WHERE confident = 5
        AND scr5_obs_date >= '${startDate}'
        AND scr5_obs_date <= '${endDate}'
        AND ST_INTERSECTSBOX(ST_GEOGPOINT(longitude, latitude), ${minX}, ${minY}, ${maxX}, ${maxY});
    `;

  return query;
};

const getData = async (startDate, endDate, bBox) => {
  const query = makeTileQuery(startDate, endDate, bBox);
  const options = {
    query,
    location: 'US',
  };
  // Run the query as a job
  const [job] = await bigquery.createQueryJob(options);

  console.log(`Job ${job.id} started...`);

  // Wait for the query to finish
  const [rows] = await job.getQueryResults();
  return rows;
};

// This is a simplier version of code adapted from https://github.com/mapbox/geojson-vt/blob/main/src/tile.js
// It is used to generate a vector tile from a geojson of points. If in the future we want to use lines or polygons
// we should replace this code with the original one.
const createTile = (data, z, tx, ty, bBox) => {
  const [minX, minY, maxX, maxY] = bBox;
  const tile = {
    version: 2,
    name: 'points',
    features: [],
    numPoints: 0,
    numSimplified: 0,
    numFeatures: data.length,
    source: null,
    x: tx,
    y: ty,
    z,
    minX,
    minY,
    maxX,
    maxY,
    transformed: true,
    extent: 4096,
  };
  for (const row of data) {
    addTileFeature(tile, row);
  }
  return tile;
};

const addTileFeature = (tile, row) => {
  const tileFeature = {
    id: row.id,
    geometry: transformPoint(row.longitude, row.latitude, tile.extent, tile.z, tile.x, tile.y),
    type: 1,
    tags: { scr5_obs_date: row.scr5_obs_date.value },
  };
  tile.features.push(tileFeature);
  tile.numPoints++;
  tile.numSimplified++;
};

// TODO: This is a very simple implementation of the MVT serialization. We should use a library
const serializeMVT = (tileData) => {
  const pbf = new Pbf();
  const VectorTile = tileData.write(pbf);
  pbf.finish();
  return VectorTile;
};

/**
 * Data fetching and processing
 * @param {int} x
 * @param {int} y
 * @param {int} z
 * @param {Date} startDate
 * @param {Date} endDate
 */
const alertsJob = async (
  x,
  y,
  z,
  startDate = '2020-01-01',
  endDate = new Date().toISOString().split('T')[0]
) => {
  // First try to get data from cache in order to reduce costs
  const cacheKey = `_${startDate}_${endDate}_${z}_${x}_${y}`;
  if (cache[cacheKey]) {
    console.log(`Rensponse from cache ${cacheKey}`);
    return cache[cacheKey];
  }
  const bBox = tileToBBOX([x, y, z]);

  const rows = await getData(startDate, endDate, bBox);

  const result = createTile(rows, z, x, y, bBox);
  // Store in cache
  cache[cacheKey] = result;

  return result;
};

/**
 * HTTP function that supports CORS requests with credentials.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.fetchAlertsTiler = (req, res) => {
  // Get data and return a JSON
  async function fetch() {
    const minZoom = 9;
    const maxZoom = 14;
    const { start_date, end_date, z, x, y } = req.query;

    if (z < minZoom || z > maxZoom)
      throw new Error(`z should be in the ${minZoom}-${maxZoon} range`);

    const result = await alertsJob(parseInt(x), parseInt(y), parseInt(z), start_date, end_date);

    res.json(result);
  }

  // Set CORS headers for preflight requests
  // Allows GETs from any origin with the Content-Type header
  // and caches preflight response for 3600s
  res.set('Access-Control-Allow-Origin', '*');
  res.set('mime-type', 'application/vnd.mapbox-vector-tile');

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
    fetch();
  }
};
