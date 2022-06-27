const ee = require('@google/earthengine');
const PRIVATE_KEY = require('./credentials.json');

const arrSum = arr => arr.reduce((a, b) => a + b, 0);

const validate = (req, res) => {
  if (!req.body.data) {
    return res.status(400).json({"error":"No data provided"});
  }

  if (!req.body.assetId || !req.body.geometry) {
    return res.status(400).json({"error":"assetId and geometry are required"});
  }
}

const serialize = (originalData) => {
  if (!originalData || !originalData.length) return null;

  const props = originalData[0].properties;
  const data = props.histogram;
  const bucketWidth = data.bucketWidth;
  const countSum = arrSum(data.histogram);

  return {
    rows: data.histogram.map((d, i) => ({
      min: data.bucketMin + (bucketWidth * i),
      max: data.bucketMin + (bucketWidth * (i + 1)),
      count: d,
      percent: d / countSum
    })),
    fields: {
      min: { type: 'number' },
      max: { type: 'number' },
      count: { type: 'number' },
      percent: { type: 'number' }
    },
    total_rows: data.histogram.length,
    stats: {
       min: props.min,
      max: props.max,
      mean: props.mean,
      stdev: props.stdDev,
      sum: props.sum
    }
  };
};

const calcHistogram = (assetId, geometry) => {
  const image = ee.Image(assetId);
  const reducers = ee.Reducer.histogram(20)
      .combine(ee.Reducer.minMax(), '', true)
      .combine(ee.Reducer.mean(),'', true )
      .combine(ee.Reducer.stdDev(), '', true)
      .combine(ee.Reducer.sum(), '', true);
  const regReducer = {
    collection: ee.FeatureCollection(geometry.features),
    reducer: reducers
  };
  const histogram = image.reduceRegions(regReducer).toList(10000);

  return histogram;
};

exports.analyse = (req, res) => {

  res.set('Access-Control-Allow-Origin', '*');

  validate(req, res);
  const assetId = req.body.assetId;
  const geometry = req.body.geometry;

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  }

  ee.data.authenticateViaPrivateKey(PRIVATE_KEY, () => {
    ee.initialize(null, null, () => {
      const result = calcHistogram(assetId, geometry);
      result.evaluate((json) => res.status(200).json(json));
    });
  });
};

