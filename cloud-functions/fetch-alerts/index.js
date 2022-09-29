const { BigQuery } = require('@google-cloud/bigquery');
const axios = require('axios').default;
const reverse = require('turf-reverse');
const mapshaper = require('mapshaper');

const crypto = require('crypto');
const http = require('http');
const https = require('https');

const httpAgent = new http.Agent({keepAlive: true});
const httpsAgent = new https.Agent({keepAlive: true});

const bigquery = new BigQuery();

const cache = {};

const md5 = (x) => crypto.createHash('md5').update(JSON.stringify(x), 'utf8').digest('hex');

const getLocation = async (locationId, env) => {
  if (!locationId) return null;
  console.log('Getting geometry from locations API');
  const apiUrl = {
    production: 'https://mangrove-atlas-api.herokuapp.com',
    staging: 'https://mangrove-atlas-api-staging.herokuapp.com',
  }
  const response = await axios.get(`${apiUrl[env]}/api/v2/locations/${locationId}`, { httpAgent, httpsAgent });
  if (response && response.data) return response.data.data;
  return null;
};

const makeQuery = async (location, startDate, endDate) => {
  let whereQuery = '';

  if (location) {
    const geoJSON = {
      type: 'Feature',
      properties: {},
      geometry: location.geometry,
    };
    const input = {'input.geojson': JSON.stringify(geoJSON)};
    const cmd = '-i input.geojson -simplify dp 20% keep-shapes -clean -o output.geojson format=geojson geojson-type=Feature';

    const geoJSONsimp = (await mapshaper.applyCommands(cmd, input))['output.geojson'].toString();

    const geoJSONreverse = reverse(JSON.parse(geoJSONsimp));
    // Reverse coordinates to get [latitude, longitude]
    whereQuery = `AND ST_INTERSECTS(ST_GEOGFROMGEOJSON('${JSON.stringify(geoJSONreverse.geometry)}'), ST_GEOGPOINT(longitude, latitude))`;
  }

  return `SELECT DATE_ADD(DATE_TRUNC(scr5_obs_date, MONTH), INTERVAL 1 DAY) as date, count(scr5_obs_date) as count
  FROM deforestation_alerts.alerts
  WHERE confident = 5
    AND scr5_obs_date BETWEEN DATE('${startDate}') AND DATE('${endDate}')
    ${whereQuery}
  GROUP BY date
  ORDER BY date ASC`;
};

/**
 * Data aggregated by month
 */
const alertsJob = async (locationId, startDate, endDate, env, geojson) => {
  // First try to get data from cache in order to reduce costs
  const geojson_md5 = geojson  ? md5(geojson) : null;
  const cacheKey = `${locationId || geojson_md5 || ''}_${startDate}_${endDate}`;
  if (cache[cacheKey]) {
    console.log(`Response from cache ${cacheKey}`);
    return cache[cacheKey];
  }

  const location = locationId && await getLocation(locationId, env) || geojson && geojson.features[0];
  const options = {
    query: await makeQuery(location, startDate, endDate),
    // Location must match that of the dataset(s) referenced in the query.
    location: 'US',
  };

  // Run the query as a job
  const [job] = await bigquery.createQueryJob(options);
  console.log(`Job ${job.id} started.`);

  // Wait for the query to finish
  const [rows] = await job.getQueryResults();
  console.log(`Job ${job.id} Finished.`);


  // Store in cache
  cache[cacheKey] = rows;

  return rows;
}

exports.fetchAlerts = (req, res) => {
  // Get data and return a JSON
  async function fetch() {
    try {
      const startDate = req.query.startDate || '2020-01-01';
      const endDate = req.query.end_date || new Date().toISOString().split('T')[0];
      const env = req.query.env || 'production';
      const locationId = req.query.location_id || null;
      const geojson = req.body && req.body.geometry || null;

      const result =  await alertsJob(locationId, startDate, endDate, env, geojson);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);

    }
  }

  // Set CORS headers for preflight requests
  // Allows GETs from any origin with the Content-Type header
  // and caches preflight response for 3600s
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
      fetch();
  }
};
