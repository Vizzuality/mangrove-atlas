const { BigQuery } = require('@google-cloud/bigquery');
const axios = require('axios').default;
const reverse = require('turf-reverse');
const http = require('http');
const https = require('https');

const httpAgent = new http.Agent({keepAlive: true});
const httpsAgent = new https.Agent({keepAlive: true});

const bigquery = new BigQuery();

const cache = {};

const getLocation = async (locationId) => {
  if (!locationId) return null;
  console.log('Getting geometry from locations API');
  const response = await axios.get(`https://mangrove-atlas-api.herokuapp.com/api/v2/locations/${locationId}`, { httpAgent, httpsAgent });
  if (response && response.data) return response.data.data;
  return null;
};

const makeQuery = (location, startDate, endDate) => {
  let whereQuery = '';

  if (location) {
    const geoJSON = {
      type: 'Feature',
      properties: {},
      geometry: location.geometry,
    };
    // Reverse coordinates to get [latitude, longitude]
    const geoJSONreverse = reverse(geoJSON);
    whereQuery = `AND ST_INTERSECTS(ST_GEOGFROMGEOJSON('${JSON.stringify(geoJSONreverse.geometry)}'), ST_GEOGPOINT(longitude, latitude))`;
  }

  return `SELECT DATE_TRUNC(scr5_obs_date, MONTH) as date, count(scr5_obs_date) as count
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
const alertsJob = async (locationId, startDate = '2020-01-01', endDate) => {

  endDate = endDate || new Date().toISOString().split('T')[0];
  // First try to get data from cache in order to reduce costs
  const cacheKey = `${locationId || ''}_${startDate}_${endDate}`;
  if (cache[cacheKey]) {
    console.log(`Response from cache ${cacheKey}`);
    return cache[cacheKey];
  }

  const location = locationId && await getLocation(locationId);
  const options = {
    query: makeQuery(location, startDate, endDate),
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
    const result =  await alertsJob(req.query.location_id, req.query.start_date, req.query.end_date);
    res.status(200).json(result);
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
