import{ Request, Response} from 'express';
import  * as ee from '@google/earthengine'
import * as PRIVATE_KEY from './credentials.json'

import { AnalysisResponse } from './AnalysisResponse';
import { FeatureCollection } from './FeatureCollection';
import { BlueCarbonCalculations } from './calculations/BlueCarbon';

enum Widgets {
  alpha  = "a",
  beta   = "b",
  gamma  = "g"
}
interface AnalysisRequestParams {
  widgets: Widgets[],
}

interface AnalysisRequestBody {
  geometry: FeatureCollection
}

export function analyze(req: Request, res: Response): Response<AnalysisResponse> {

  res.set('Access-Control-Allow-Origin', '*');

  const isValid = validate(req, res);

  if (!isValid.status) {
    return isValid.res;
  }

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    return res.status(204).send('');
  }

  ee.data.authenticateViaPrivateKey(PRIVATE_KEY, () => {
    ee.initialize(null, null, () => {
      try {
        const geometryCollection = ee.FeatureCollection(req.body.geometry);
        const result = BlueCarbonCalculations.calculateTotalTreeCover(geometryCollection);

        result.evaluate((success, failure) => {

          if (success) {
            const data = serialize(success);
            res.status(200).json(data);
          }
          if (failure) {
            console.error(failure)
            res.status(500).json( {"error": failure});
          }
        });
      }
      catch (error) {
        console.error(error)
        res.status(400).json({"error": error.message});
      };
  }, (error) => {
    console.log(error);
    res.status(400).json({"error": error});
  });
});

  return res;

};

function serialize(originalData: any): AnalysisResponse {
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
function arrSum(arr: []): number {
  return arr.reduce((a, b) => a + b, 0)
};

function isValidAnalysisRequestBody(obj: any): obj is AnalysisRequestBody {
  return obj.geometry;
}

function isValidAnalysisRequestParams(obj: any): obj is AnalysisRequestParams {
  return obj.widgets;
}

function validate(req: Request, res:  Response): {"status": Boolean, "res": Response} {
  console.log(req.query)
  if (!req.body || !req.query) {
    return {"status": false, "res":  res.status(400).json({"error":"No data provided"})};
  }

  if (!isValidAnalysisRequestBody(req.body)) {
    return {"status": false, "res":  res.status(400).json({"error":"geometry is required as part of the body"})};
  }

  if (!isValidAnalysisRequestParams(req.query)) {
    return {"status": false, "res":  res.status(400).json({"error":"a valid widget param is required"})};
  }

  return {"status": true, "res": res};
}

