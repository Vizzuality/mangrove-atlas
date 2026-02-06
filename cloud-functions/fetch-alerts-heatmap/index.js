const { BigQuery } = require('@google-cloud/bigquery');
const axios = require('axios').default;
const reverse = require('turf-reverse');
const http = require('http');
const https = require('https');

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const bigquery = new BigQuery();
const cache = {};

const makeQuery = (startDate, endDate) => {
  const query = `WITH a AS (
      SELECT TRUNC(longitude, 2) AS longitude,
        TRUNC(latitude, 2) AS latitude,
      FROM deforestation_alerts.alerts
      WHERE confident = 5
        AND scr5_obs_date >= '${startDate}'
        AND scr5_obs_date <= '${endDate}'
    ), b AS (
      SELECT latitude, longitude, COUNT(ST_GEOGPOINT(longitude, latitude)) AS count
      FROM a
      GROUP BY latitude, longitude
    )
    SELECT latitude, longitude, count, MIN(count) OVER() AS min, MAX(count) OVER() AS max
    FROM b`;

  return query;
};

const serializeToGeoJSON = (data) => ({
  type: 'FeatureCollection',
  name: 'deforestation-alerts',
  features: data.map((d) => ({
    type: 'Feature',
    properties: {
      count: d.count,
      intensity: d.count / d.max,
    },
    geometry: {
      type: 'Point',
      coordinates: [d.longitude, d.latitude],
    },
  })),
  metadata: {
    max: data[0].max,
    min: data[0].min,
  },
});

/**
 * Data aggregated by month, latitude and longitude
 * @param {string} locationId # this is no longer used
 * @param {Date} startDate
 * @param {Date} endDate
 */
const alertsJob = async (
  startDate = '2019-01-01',
  endDate = new Date().toISOString().split('T')[0]
) => {
  // First try to get data from cache in order to reduce costs
  const cacheKey = `_${startDate}_${endDate}`;
  if (cache[cacheKey]) {
    console.log(`Response from cache ${cacheKey}`);
    return cache[cacheKey];
  }
  const options = {
    query: makeQuery(startDate, endDate),
    // Location must match that of the dataset(s) referenced in the query.
    location: 'US',
  };

  // Run the query as a job
  const [job] = await bigquery.createQueryJob(options);
  console.info(`Job ${job.id} started.`);

  // Wait for the query to finish
  const [rows] = await job.getQueryResults();

  const result = serializeToGeoJSON(rows);
  // Store in cache
  cache[cacheKey] = result;

  return result;
};

exports.fetchAlertsHeatmap = (req, res) => {
  // Get data and return a JSON
  async function fetch() {
    const { location_id, start_date, end_date } = req.query;
    const result = await alertsJob(start_date, end_date);
    res.json(result);
  }

  // Set CORS headers for preflight requests
  // Allows GETs from any origin with the Content-Type header
  // and caches preflight response for 3600s
  res.set('Access-Control-Allow-Origin', '*');

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
