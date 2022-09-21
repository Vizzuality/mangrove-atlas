import{ Request, Response} from 'express';
import   ee  from '@google/earthengine'
import type { HttpFunction } from '@google-cloud/functions-framework/build/src/functions';

import { eeAuthenticate, eeEvaluate } from './utils';
import { serialize } from './serialize';
import { AnalysisResponse } from './AnalysisResponse';
import { FeatureCollection } from './FeatureCollection';
import { NetChangeCalculations } from './calculations/NetChange';
import { HabitatExtentCalculations } from './calculations/HabitatExtent';

enum Widgets {
  "habitat-extent"  = "habitat-extent",
  "net-change"  = "net-change",
  gamma  = "g"
}
interface AnalysisRequestParams {
  widgets: Widgets[],
}

interface AnalysisRequestBody {
  geometry: FeatureCollection
}

export const analyze: HttpFunction = async (req, res) => {

  res.set('Access-Control-Allow-Origin', '*');
  const TEST_DICT = {
    "habitat-extent": HabitatExtentCalculations,
    "net-change": NetChangeCalculations,
  }
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

  try {
    await eeAuthenticate();
    const geometryCollection = ee.FeatureCollection(req.body.geometry);
    const widgets = req.query.widgets as Widgets[];
    const asyncRes = await Promise.all(widgets.map(async (i) => {
      const calculation = TEST_DICT[i];
      const result = await eeEvaluate(calculation.calculate(geometryCollection));
      return serialize(result, i);
    }));

    res.status(200).json(asyncRes);

  } catch (error) {
    console.error(error)
    res.status(400).json({"error": error.message});
  }

  return res
}

function isValidAnalysisRequestBody(obj: any): obj is AnalysisRequestBody {
  return obj.geometry;
}

function isValidAnalysisRequestParams(obj: any): obj is AnalysisRequestParams {
  return obj.widgets;
}

function validate(req: Request, res:  Response): {"status": Boolean, "res": Response} {
  if (!req.body || !req.query) {
    return {"status": false,
          "res":  res.status(400).json({"error":"No data provided"})};
  }

  if (!isValidAnalysisRequestBody(req.body)) {
    return {"status": false,
            "res":  res.status(400).json({"error":"geometry is required as part of the body"})};
  }

  if (!isValidAnalysisRequestParams(req.query)) {
    return {"status": false,
          "res":  res.status(400).json({"error":"a valid widget param is required"})};
  }

  return {"status": true, "res": res};
}

